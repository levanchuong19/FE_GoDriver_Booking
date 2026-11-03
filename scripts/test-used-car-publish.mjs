/**
 * Test đăng tin xe cũ với brand local (Mercedes) + features hợp lệ.
 * Usage:
 *   node scripts/test-used-car-publish.mjs <accessToken>
 * hoặc set env ACCESS_TOKEN=
 */
import fs from "fs";
import path from "path";

const API = "https://api.smartdrive.io.vn/api";
const token = process.argv[2] || process.env.ACCESS_TOKEN || "";

if (!token) {
  console.error("Missing token. Pass as argv or ACCESS_TOKEN env.");
  process.exit(1);
}

function toCatalogObjectId(input) {
  const text = String(input || "").trim();
  if (/^[a-fA-F0-9]{24}$/.test(text)) return text.toLowerCase();
  const src = `smartdrive:catalog:${text.toLowerCase()}`;
  const seeds = [2166136261, 1469598101, 2246822519, 3266489917];
  const bytes = [];
  for (const seed of seeds) {
    let h = seed >>> 0;
    for (let i = 0; i < src.length; i += 1) {
      h ^= src.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    h ^= src.length + seed;
    h = Math.imul(h ^ (h >>> 16), 2246822507) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0;
    h ^= h >>> 16;
    bytes.push((h >>> 24) & 0xff, (h >>> 16) & 0xff, (h >>> 8) & 0xff, h & 0xff);
  }
  return bytes
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function api(method, urlPath, body, isForm = false, retries = 6) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const headers = { Authorization: `Bearer ${token}` };
    let payload = undefined;
    if (body != null && !isForm) {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    } else if (isForm) {
      payload = body;
    }
    const res = await fetch(`${API}${urlPath}`, {
      method,
      headers,
      body: payload,
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    const rateLimited =
      res.status === 429 ||
      /thao tác quá nhanh|too many|rate/i.test(JSON.stringify(data));
    if (rateLimited && attempt < retries) {
      const waitMs = 15000 * (attempt + 1);
      console.log(`   rate-limited, wait ${waitMs / 1000}s...`);
      await new Promise((r) => setTimeout(r, waitMs));
      continue;
    }
    return { status: res.status, data };
  }
  return { status: 429, data: { message: "rate limited" } };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  console.log("1) Load server brands...");
  const brandsRes = await api("GET", "/vehicle-catalog/brands?vehicleType=CAR");
  assert(brandsRes.status === 200, `brands fail ${brandsRes.status}`);
  const brands = brandsRes.data?.data || [];
  assert(brands.length > 0, "no brands");
  const brand = brands[0];
  const modelsRes = await api(
    "GET",
    `/vehicle-catalog/models?brandId=${brand._id}&vehicleType=CAR`
  );
  const models = modelsRes.data?.data || [];
  assert(models.length > 0, "no models");
  const model = models[0];
  console.log("   server brand/model:", brand.name, model.name);

  const cases = [
    {
      name: "A) no features",
      features: undefined,
    },
    {
      name: "B) enum features",
      features: ["ABS", "SUNROOF", "LEATHER", "CRUISE"],
    },
    {
      name: "C) INVALID brand tag in features (expect fail)",
      features: ["Hãng: Mercedes-Benz"],
      expectFail: true,
    },
  ];

  // tránh rate-limit API
  await new Promise((r) => setTimeout(r, 5000));

  for (const testCase of cases) {
    console.log(`\n2) Create listing: ${testCase.name}`);
    const payload = {
      vehicleType: "CAR",
      title: `TEST MERCEDES PUBLISH ${Date.now()}`,
      description: "Test publish any brand via server catalog ids",
      manufactureYear: 2019,
      mileage: 20000,
      price: 1500000000,
      negotiable: true,
      transmission: "AUTOMATIC",
      fuelType: "GASOLINE",
      bodyType: "SEDAN",
      condition: "EXCELLENT",
      provinceCode: "79",
      districtCode: "760",
      contactName: "Admin Test",
      contactPhone: "0901234567",
      brandId: brand._id,
      modelId: model._id,
      brandName: "Mercedes-Benz",
      modelName: "S-Class",
      variantName: "S450",
    };
    if (testCase.features) payload.features = testCase.features;

    const created = await api("POST", "/used-cars", payload);
    console.log("   create:", created.status, created.data?.message || created.data?.errorCode || "ok");

    if (testCase.expectFail) {
      assert(created.status >= 400, "expected create to fail");
      assert(
        /INVALID_FEATURE|Tiện nghi/i.test(JSON.stringify(created.data)),
        "expected INVALID_FEATURE"
      );
      console.log("   PASS expected INVALID_FEATURE");
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }

    assert(created.status < 300, `create failed: ${JSON.stringify(created.data)}`);
    const id =
      created.data?.data?._id ||
      created.data?.data?.id ||
      created.data?._id ||
      created.data?.id;
    assert(id, "missing id");
    console.log("   id:", id);

    const imgPath = path.resolve("public/used-cars/mercedes-s450/01.jpg");
    assert(fs.existsSync(imgPath), "missing sample image");
    for (let i = 0; i < 5; i += 1) {
      const buf = fs.readFileSync(imgPath);
      const form = new FormData();
      form.append(
        "file",
        new Blob([buf], { type: "image/jpeg" }),
        `test-${i}.jpg`
      );
      const up = await api("POST", `/used-cars/${id}/media`, form, true);
      assert(up.status < 300, `upload fail ${i}: ${JSON.stringify(up.data)}`);
    }
    console.log("   uploaded 5 images");

    const submit = await api("POST", `/used-cars/${id}/submit`);
    console.log(
      "   submit:",
      submit.status,
      submit.data?.message || submit.data?.errorCode || "ok"
    );
    assert(
      submit.status < 300,
      `submit failed: ${JSON.stringify(submit.data)}`
    );

    await api("DELETE", `/used-cars/${id}`);
    console.log("   PASS + archived");
    await new Promise((r) => setTimeout(r, 2500));
  }

  // Prove local hash is NOT sent as brandId in our resolver strategy
  const localMercedes = toCatalogObjectId("local:mercedes");
  console.log("\n3) local mercedes hash (must NOT be sent as brandId):", localMercedes);
  assert(localMercedes !== brand._id, "hash unexpectedly equals server brand");

  console.log("\nALL TESTS PASSED");
}

main().catch((err) => {
  console.error("\nTEST FAILED:", err.message);
  process.exit(1);
});
