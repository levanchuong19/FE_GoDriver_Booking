import api from "../Config/api";
import { unwrapData, unwrapList } from "./apiData";

export type LandingPriceCard = {
  id: string;
  title: string;
  /** Giá tính (hiển thị lớn) */
  amount: number;
  unit: string;
  description: string;
  /** Giá mở cửa từ API baseFare */
  baseFare: number;
  /** Giá tính từ bracket / rate */
  rateAmount: number;
  rateUnit: string;
  /** Giá chờ / phút từ waitingFeePerMin */
  waitingFeePerMin: number;
  bullets: string[];
  popular?: boolean;
  source: "fare_policy" | "pricing_plan" | "fare_quote";
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function num(...values: unknown[]) {
  for (const value of values) {
    const n = Number(value);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return 0;
}

export function formatCompactVnd(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return "—";
  if (amount >= 1_000_000) {
    const tr = amount / 1_000_000;
    return `${tr.toLocaleString("vi-VN", {
      maximumFractionDigits: tr >= 10 ? 0 : 1,
    })}tr`;
  }
  if (amount >= 1000) {
    const k = amount / 1000;
    return Number.isInteger(k)
      ? `${k}K`
      : `${k.toLocaleString("vi-VN", { maximumFractionDigits: 0 })}K`;
  }
  return amount.toLocaleString("vi-VN");
}

function serviceLabel(raw: string) {
  const key = raw.trim().toLowerCase();
  const map: Record<string, string> = {
    per_km: "Theo km",
    per_hour: "Theo giờ",
    hourly: "Theo giờ",
    per_day: "Theo ngày",
    daily: "Theo ngày",
    long_distance: "Đi tỉnh",
    intercity: "Đi tỉnh",
    motorcycle: "Xe máy",
    dich_vu_tai_xe_theo_cay_so: "Theo km",
    dich_vu_tai_xe_theo_gio: "Theo giờ",
    dich_vu_tai_xe_theo_ngay: "Theo ngày",
    dich_vu_tai_xe_lien_tinh: "Đi tỉnh",
    driver_booking: "Thuê tài xế",
    ride_hailing: "Đặt xe",
    self_drive: "Thuê xe tự lái",
    delivery: "Giao hàng",
    roadside_assistance: "Cứu hộ",
  };
  return map[key] || raw || "Bảng giá";
}

function serviceUnit(raw: string) {
  const key = raw.trim().toLowerCase();
  const exact: Record<string, string> = {
    per_km: "/km",
    motorcycle: "/km",
    intercity: "/km",
    long_distance: "/km",
    per_hour: "/giờ",
    hourly: "/giờ",
    per_day: "/ngày",
    daily: "/ngày",
  };
  if (exact[key]) return exact[key];
  if (key.includes("gio") || key.includes("hour")) return "/giờ";
  if (key.includes("ngay") || key.includes("day")) return "/ngày";
  if (
    key.includes("km") ||
    key.includes("cay_so") ||
    key.includes("motorcycle")
  ) {
    return "/km";
  }
  if (
    key.includes("tinh") ||
    key.includes("distance") ||
    key.includes("intercity")
  ) {
    return "/km";
  }
  if (key.includes("minute") || key.includes("phut")) return "/phút";
  return "";
}

function serviceDescription(raw: string) {
  const title = serviceLabel(raw);
  if (title === "Theo giờ") return "Phù hợp tiệc tùng, công việc nội thành.";
  if (title === "Theo ngày") return "Tài xế đồng hành cả ngày.";
  if (title === "Theo km") return "Thanh toán theo quãng đường, báo giá trước.";
  if (title === "Đi tỉnh") return "Tính theo km / chuyến, báo giá trước.";
  if (title === "Đặt xe") return "Giá theo bảng giá Đặt xe đang áp dụng.";
  return "Giá theo bảng giá đang áp dụng trên hệ thống.";
}

function itemAmount(
  items: unknown,
  code: string
): number {
  if (!Array.isArray(items)) return 0;
  const found = items.find((row) => asRecord(row).code === code);
  return num(asRecord(found).amount);
}

function extractRates(item: Record<string, unknown>) {
  const brackets = Array.isArray(item.fareBrackets)
    ? (item.fareBrackets as Record<string, unknown>[])
    : [];
  const hourBrackets = Array.isArray(item.hourBrackets)
    ? (item.hourBrackets as Record<string, unknown>[])
    : [];
  const dayBrackets = Array.isArray(item.dayBrackets)
    ? (item.dayBrackets as Record<string, unknown>[])
    : [];
  const firstBracket = brackets[0] ?? {};
  const firstHour = hourBrackets[0] ?? {};
  const firstDay = dayBrackets[0] ?? {};
  const pricePerMinute = num(item.pricePerMinute, item.perMinute);
  const pricePerHour =
    num(
      item.pricePerHour,
      item.hourlyRate,
      item.perHour,
      firstHour.pricePerHour
    ) || (pricePerMinute > 0 ? pricePerMinute * 60 : 0);
  const pricePerDay = num(
    item.pricePerDay,
    item.dailyRate,
    item.perDay,
    firstDay.pricePerDay
  );
  const pricePerKm = num(
    item.pricePerKm,
    firstBracket.pricePerKm,
    item.perKm
  );
  const baseFare = num(item.baseFare, item.minimumFare, item.minFare);
  const waitingFeePerMin = num(
    item.waitingFeePerMin,
    item.waitingFee,
    item.waitingPerMin
  );
  const service = String(item.serviceType ?? item.service ?? item.name ?? "");
  const unit = serviceUnit(service);

  let rateAmount = 0;
  let rateUnit = unit;
  if (unit === "/giờ" && pricePerHour > 0) {
    rateAmount = pricePerHour;
    rateUnit = "/giờ";
  } else if (unit === "/ngày" && pricePerDay > 0) {
    rateAmount = pricePerDay;
    rateUnit = "/ngày";
  } else if (unit === "/km" && pricePerKm > 0) {
    rateAmount = pricePerKm;
    rateUnit = "/km";
  } else if (pricePerHour > 0) {
    rateAmount = pricePerHour;
    rateUnit = "/giờ";
  } else if (pricePerDay > 0) {
    rateAmount = pricePerDay;
    rateUnit = "/ngày";
  } else if (pricePerKm > 0) {
    rateAmount = pricePerKm;
    rateUnit = "/km";
  } else if (baseFare > 0) {
    rateAmount = baseFare;
    rateUnit = "";
  }

  return { baseFare, rateAmount, rateUnit, waitingFeePerMin, service };
}

function buildPriceBullets(card: {
  baseFare: number;
  rateAmount: number;
  rateUnit: string;
  waitingFeePerMin: number;
}) {
  const bullets: string[] = [];
  if (card.baseFare > 0) {
    bullets.push(`Giá mở cửa ${formatCompactVnd(card.baseFare)}`);
  }
  if (card.rateAmount > 0) {
    bullets.push(
      `Giá tính ${formatCompactVnd(card.rateAmount)}${card.rateUnit || ""}`
    );
  }
  if (card.waitingFeePerMin > 0) {
    bullets.push(
      `Giá chờ ${formatCompactVnd(card.waitingFeePerMin)}/phút`
    );
  }
  return bullets.length > 0
    ? bullets
    : ["Giá hiển thị trước khi đặt", "Không phụ phí ẩn"];
}

function toPolicyCard(
  item: Record<string, unknown>,
  source: LandingPriceCard["source"],
  popular = false
): LandingPriceCard | null {
  const { baseFare, rateAmount, rateUnit, waitingFeePerMin, service } =
    extractRates(item);
  if (!service && !baseFare && !rateAmount) return null;
  if (rateAmount <= 0 && baseFare <= 0) return null;

  const amount = rateAmount > 0 ? rateAmount : baseFare;
  const unit = rateAmount > 0 ? rateUnit : baseFare > 0 ? " mở cửa" : "";
  const id = String(item._id ?? item.id ?? `${source}-${service}-${amount}`);
  const title = serviceLabel(service || String(item.name || "Bảng giá"));
  const priceFields = { baseFare, rateAmount, rateUnit, waitingFeePerMin };

  return {
    id,
    title,
    amount,
    unit,
    description: serviceDescription(service),
    ...priceFields,
    bullets: buildPriceBullets(priceFields),
    popular,
    source,
  };
}

function isEffective(item: Record<string, unknown>) {
  const now = Date.now();
  const from = item.effectiveFrom ? Date.parse(String(item.effectiveFrom)) : NaN;
  const to = item.effectiveTo ? Date.parse(String(item.effectiveTo)) : NaN;
  if (Number.isFinite(from) && now < from) return false;
  if (Number.isFinite(to) && now > to) return false;
  if (item.active === false) return false;
  return true;
}

/** Public: GET /pricing/getAll */
async function fetchFarePolicies(): Promise<LandingPriceCard[]> {
  const res = await api.get("/pricing/getAll", {
    params: { limit: 50 },
    skipErrorToast: true,
  });
  const { items } = unwrapList(res.data);
  const list = (items.length ? items : [unwrapData(res.data)]).filter(Boolean);
  return list
    .map((raw) => asRecord(raw))
    .filter(isEffective)
    .map((item, index) => toPolicyCard(item, "fare_policy", index === 0))
    .filter((card): card is LandingPriceCard => Boolean(card));
}

/** Public: GET /pricing/plans (nếu mở) */
async function fetchPricingPlans(): Promise<LandingPriceCard[]> {
  const res = await api.get("/pricing/plans", { skipErrorToast: true });
  const { items } = unwrapList(res.data);
  const root = asRecord(unwrapData(res.data) ?? res.data);
  const plans = items.length
    ? items
    : Array.isArray(root.plans)
      ? root.plans
      : [];

  return plans
    .map((raw) => asRecord(raw))
    .filter(isEffective)
    .map((item, index) => toPolicyCard(item, "pricing_plan", index === 0))
    .filter((card): card is LandingPriceCard => Boolean(card));
}

/** Public: POST /pricing/quote */
async function fetchEngineQuoteCards(): Promise<LandingPriceCard[]> {
  const samples = [
    {
      service: "DRIVER_BOOKING",
      title: "Thuê tài xế",
      unit: "",
      context: { distanceKm: 8, durationMin: 60 },
    },
    {
      service: "RIDE_HAILING",
      title: "Đặt xe",
      unit: "/chuyến",
      context: { distanceKm: 5, durationMin: 20 },
    },
  ] as const;

  const cards: LandingPriceCard[] = [];
  for (const sample of samples) {
    try {
      const res = await api.post(
        "/pricing/quote",
        { service: sample.service, context: sample.context },
        { skipErrorToast: true }
      );
      const data = asRecord(unwrapData(res.data) ?? res.data);
      const amount = num(
        data.finalFare,
        data.estimatedFare,
        data.total,
        data.amount,
        asRecord(data.quote).finalFare,
        asRecord(data.quote).total
      );
      if (amount <= 0) continue;
      const baseFare = num(
        data.baseFare,
        asRecord(data.quote).baseFare,
        itemAmount(data.items, "BASE_FARE")
      );
      const waitingFeePerMin = num(
        data.waitingFeePerMin,
        asRecord(data.quote).waitingFeePerMin
      );
      const priceFields = {
        baseFare,
        rateAmount: amount,
        rateUnit: sample.unit || " / ước tính",
        waitingFeePerMin,
      };
      cards.push({
        id: `quote-${sample.service}`,
        title: sample.title,
        amount,
        unit: sample.unit || " / ước tính",
        description: serviceDescription(sample.service),
        ...priceFields,
        bullets: buildPriceBullets(priceFields).length
          ? [
              ...buildPriceBullets(priceFields),
              `Ước tính mẫu ${sample.context.distanceKm} km`,
            ].slice(0, 3)
          : [
              `Ước tính mẫu ${sample.context.distanceKm} km`,
              "Giá thật báo trước khi xác nhận",
            ],
        source: "fare_quote",
      });
    } catch {
      // endpoint may still be protected on some envs
    }
  }
  return cards;
}

/**
 * Public fallback: POST /bookings/calculateFare
 * Dùng khi getAll chưa trả về đủ loại dịch vụ.
 */
async function fetchCalculateFareCards(): Promise<LandingPriceCard[]> {
  const start = new Date();
  start.setDate(start.getDate() + 3);
  start.setHours(10, 0, 0, 0);

  const hourlyEnd = new Date(start);
  hourlyEnd.setHours(start.getHours() + 4);

  const dailyEnd = new Date(start);
  dailyEnd.setDate(dailyEnd.getDate() + 1);

  const samples: Array<{
    id: string;
    title: string;
    unit: string;
    body: Record<string, unknown>;
    popular?: boolean;
    rateFrom?: "hourly" | "daily" | "final";
  }> = [
    {
      id: "calc-hourly",
      title: "Theo giờ",
      unit: "/giờ",
      rateFrom: "hourly",
      body: {
        pickupLocation: "Quận 1, TP.HCM",
        startTime: start.toISOString(),
        endTime: hourlyEnd.toISOString(),
        serviceType: "hourly",
      },
    },
    {
      id: "calc-daily",
      title: "Theo ngày",
      unit: "/ngày",
      popular: true,
      rateFrom: "daily",
      body: {
        pickupLocation: "Quận 1, TP.HCM",
        startTime: start.toISOString(),
        endTime: dailyEnd.toISOString(),
        serviceType: "daily",
      },
    },
  ];

  const cards: LandingPriceCard[] = [];
  for (const sample of samples) {
    try {
      const res = await api.post("/bookings/calculateFare", sample.body, {
        skipErrorToast: true,
      });
      const data = asRecord(unwrapData(res.data) ?? res.data);
      const hours = num(data.durationHours) || 4;
      const days = num(data.durationDays) || 1;
      const timeFare = itemAmount(data.items, "TIME_FARE");
      const baseFare = num(data.baseFare, itemAmount(data.items, "BASE_FARE"));
      const finalFare = num(data.finalFare, data.estimatedFare);

      let amount = finalFare;
      if (sample.rateFrom === "hourly" && timeFare > 0 && hours > 0) {
        amount = timeFare / hours;
      } else if (sample.rateFrom === "daily" && timeFare > 0) {
        amount = timeFare / Math.max(1, days);
      }

      if (amount <= 0) continue;

      const waitingFeePerMin = num(
        data.waitingFeePerMin,
        itemAmount(data.items, "WAITING_FEE")
      );
      const priceFields = {
        baseFare,
        rateAmount: amount,
        rateUnit: sample.unit,
        waitingFeePerMin,
      };

      cards.push({
        id: sample.id,
        title: sample.title,
        amount,
        unit: sample.unit,
        description: serviceDescription(String(sample.body.serviceType)),
        ...priceFields,
        bullets: buildPriceBullets(priceFields),
        popular: sample.popular,
        source: "fare_quote",
      });
    } catch {
      // ignore sample failures
    }
  }
  return cards;
}

function dedupeCards(cards: LandingPriceCard[]) {
  const seen = new Set<string>();
  const out: LandingPriceCard[] = [];
  for (const card of cards) {
    const key = `${card.title}|${card.unit}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(card);
  }
  return out;
}

function pickFeatured(cards: LandingPriceCard[]) {
  const preferred = [
    "Theo giờ",
    "Theo ngày",
    "Theo km",
    "Đi tỉnh",
    "Thuê tài xế",
    "Đặt xe",
  ];
  const picked: LandingPriceCard[] = [];
  for (const title of preferred) {
    const found = cards.find((c) => c.title === title);
    if (found) picked.push(found);
    if (picked.length >= 3) break;
  }
  if (picked.length < 3) {
    for (const card of cards) {
      if (picked.some((p) => p.id === card.id || p.title === card.title)) continue;
      picked.push(card);
      if (picked.length >= 3) break;
    }
  }
  return picked.map((card, index) => ({
    ...card,
    popular: index === 1 || Boolean(card.popular),
  }));
}

/**
 * Landing pricing:
 * 1) GET /pricing/getAll (+ plans) — bảng giá công khai
 * 2) POST /pricing/quote — bổ sung
 * 3) POST /bookings/calculateFare — fallback mẫu theo giờ/ngày
 */
export async function loadLandingPricing(): Promise<{
  cards: LandingPriceCard[];
  fromPrice: number;
}> {
  const settled = await Promise.allSettled([
    fetchFarePolicies(),
    fetchPricingPlans(),
    fetchEngineQuoteCards(),
  ]);

  let cards = dedupeCards(
    settled.flatMap((result) =>
      result.status === "fulfilled" ? result.value : []
    )
  );

  // Nếu bảng giá/list chưa đủ (vd. API getAll chưa deploy public), dùng calculateFare
  const hasHour = cards.some((c) => c.title === "Theo giờ");
  const hasDay = cards.some((c) => c.title === "Theo ngày");
  if (!hasHour || !hasDay || cards.length === 0) {
    const calcCards = await fetchCalculateFareCards().catch(() => []);
    cards = dedupeCards([...cards, ...calcCards]);
  }

  const featured = pickFeatured(cards);
  const fromPrice = featured.reduce(
    (min, card) => (card.amount > 0 ? Math.min(min, card.amount) : min),
    Number.POSITIVE_INFINITY
  );

  return {
    cards: featured,
    fromPrice: Number.isFinite(fromPrice) ? fromPrice : 0,
  };
}

/** Public quote helpers for other modules */
export async function publicPricingQuote(payload: {
  service: string;
  context?: Record<string, unknown>;
}) {
  const res = await api.post("/pricing/quote", payload, {
    skipErrorToast: true,
  });
  return unwrapData(res.data) ?? res.data;
}

export async function publicCalculateFare(payload: Record<string, unknown>) {
  const res = await api.post("/bookings/calculateFare", payload, {
    skipErrorToast: true,
  });
  return unwrapData(res.data) ?? res.data;
}
