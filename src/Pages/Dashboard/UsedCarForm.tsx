import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
  Upload,
  message,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { jwtDecode } from "jwt-decode";
import {
  approveUsedCar,
  createUsedCar,
  deleteUsedCarMedia,
  getUsedCar,
  setUsedCarCover,
  submitUsedCar,
  updateUsedCar,
  uploadUsedCarMedia,
} from "../../Config/adminApi";
import {
  listVehicleBrands,
  listVehicleModels,
  listVehicleVariants,
} from "../../Config/managementApi";
import {
  findCatalogLabel,
  registerCustomCatalogOption,
  resolveCatalogWriteIds,
  toCatalogObjectId,
} from "../../data/vehicleCatalog";
import { getErrorMessage } from "../../Utils/apiData";
import { notifyError, notifyWarning } from "../../Utils/notify";
import { usedCarToFormValues } from "../../Utils/normalizeUsedCar";
import { getUsedCarId, type UsedCarListing } from "../../models/UsedCar";
import { MERCEDES_S450_SEED } from "../../models/UsedCarWrite";
import { seedMercedesS450Listing } from "../../Utils/seedMercedesListing";
import type { JwtPayload } from "../../Model/User";

type CatalogOption = { value: string; label: string };

function catalogId(row: Record<string, unknown>) {
  return String(row.id || row._id || "").trim();
}

function catalogLabel(row: Record<string, unknown>) {
  return String(row.name || row.title || row.label || catalogId(row) || "—");
}

function toOptions(items: unknown[]): CatalogOption[] {
  return (items as Record<string, unknown>[])
    .map((row) => {
      const value = catalogId(row);
      if (!value) return null;
      return { value, label: catalogLabel(row) };
    })
    .filter((item): item is CatalogOption => Boolean(item));
}

function ensureOption(
  options: CatalogOption[],
  id?: string,
  name?: string,
): CatalogOption[] {
  const value = String(id || "").trim();
  if (!value) return options;
  if (options.some((item) => item.value === value)) return options;
  return [{ value, label: name || value }, ...options];
}

function cleanPayload(values: Record<string, unknown>) {
  const payload: Record<string, unknown> = {
    vehicleType: values.vehicleType,
    title: String(values.title || "").trim(),
    description: String(values.description || "").trim(),
    manufactureYear: values.manufactureYear,
    mileage: values.mileage,
    price: values.price ?? 0,
    negotiable: Boolean(values.negotiable),
    transmission: values.transmission,
    fuelType: values.fuelType,
    condition: values.condition,
  };

  const contactName = String(values.contactName || "").trim();
  const contactPhone = String(values.contactPhone || "").trim();
  const plateNumber = String(values.plateNumber || "").trim();
  const bodyType = String(values.bodyType || "").trim();
  const exteriorColor = String(values.exteriorColor || "").trim();
  const interiorColor = String(values.interiorColor || "").trim();
  const provinceCode = String(values.provinceCode || "").trim();
  const districtCode = String(values.districtCode || "").trim();
  if (contactName) payload.contactName = contactName;
  if (contactPhone) payload.contactPhone = contactPhone;
  if (plateNumber) payload.plateNumber = plateNumber;
  if (bodyType) payload.bodyType = bodyType;
  if (exteriorColor) payload.exteriorColor = exteriorColor;
  if (interiorColor) payload.interiorColor = interiorColor;
  if (provinceCode) payload.provinceCode = provinceCode;
  if (districtCode) payload.districtCode = districtCode;

  const catalog = resolveCatalogWriteIds({
    brandId: String(values.brandId || "").trim(),
    modelId: String(values.modelId || "").trim(),
    variantId: String(values.variantId || "").trim(),
    vehicleType: String(values.vehicleType || ""),
  });

  // Chỉ gửi id có trên catalog server (tránh "hãng xe không hợp lệ")
  if (catalog.brandId) {
    payload.brandId = catalog.brandId;
    payload.brandName = catalog.brandName;
  }
  if (catalog.modelId) {
    payload.modelId = catalog.modelId;
    payload.modelName = catalog.modelName;
  }
  if (catalog.variantId) {
    payload.variantId = catalog.variantId;
    payload.variantName = catalog.variantName;
  }

  // Bỏ tiện ích/điểm nổi bật — xóa features cũ để tránh INVALID_FEATURE
  payload.features = [];

  // Giữ tên xe đã chọn trong title nếu title chưa có
  if (
    catalog.brandName &&
    payload.title &&
    !String(payload.title)
      .toLowerCase()
      .includes(String(catalog.brandName).toLowerCase())
  ) {
    payload.title =
      `${catalog.brandName} ${catalog.modelName || ""} ${payload.title}`
        .replace(/\s+/g, " ")
        .trim();
  }

  return payload;
}

export default function UsedCarFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [listingId, setListingId] = useState(id || "");
  const [media, setMedia] = useState<
    Array<{ id: string; url: string; isCover?: boolean; canManage?: boolean }>
  >([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [brandOptions, setBrandOptions] = useState<CatalogOption[]>([]);
  const [modelOptions, setModelOptions] = useState<CatalogOption[]>([]);
  const [variantOptions, setVariantOptions] = useState<CatalogOption[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [variantSearch, setVariantSearch] = useState("");

  const vehicleType = Form.useWatch("vehicleType", form);
  const brandIdWatch = Form.useWatch("brandId", form);
  const modelIdWatch = Form.useWatch("modelId", form);

  const isAdmin = useMemo(() => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return false;
      const decoded: JwtPayload = jwtDecode(token);
      return decoded.role === "admin" || decoded.role === "staff";
    } catch {
      return false;
    }
  }, []);

  const titleText = useMemo(
    () => (isEdit ? "Sửa tin xe cũ" : "Thêm tin xe cũ"),
    [isEdit],
  );

  const totalImageCount = media.length + fileList.length;

  const loadBrands = async (
    type?: string,
    keep?: { id?: string; name?: string },
  ) => {
    setLoadingBrands(true);
    try {
      const data = await listVehicleBrands({
        vehicleType: type || undefined,
      });
      setBrandOptions(
        ensureOption(toOptions(data.items), keep?.id, keep?.name),
      );
    } catch (error) {
      notifyError(error, "Không tải được danh sách hãng xe");
      setBrandOptions(ensureOption([], keep?.id, keep?.name));
    } finally {
      setLoadingBrands(false);
    }
  };

  const loadModels = async (
    brandId: string,
    type?: string,
    keep?: { id?: string; name?: string },
  ) => {
    if (!brandId) {
      setModelOptions([]);
      setVariantOptions([]);
      return;
    }
    setLoadingModels(true);
    try {
      const data = await listVehicleModels({
        brandId,
        vehicleType: type || undefined,
      });
      setModelOptions(
        ensureOption(toOptions(data.items), keep?.id, keep?.name),
      );
    } catch (error) {
      notifyError(error, "Không tải được danh sách dòng xe");
      setModelOptions(ensureOption([], keep?.id, keep?.name));
    } finally {
      setLoadingModels(false);
    }
  };

  const loadVariants = async (
    modelId: string,
    keep?: { id?: string; name?: string },
  ) => {
    if (!modelId) {
      setVariantOptions([]);
      return;
    }
    setLoadingVariants(true);
    try {
      const data = await listVehicleVariants({ modelId });
      setVariantOptions(
        ensureOption(toOptions(data.items), keep?.id, keep?.name),
      );
    } catch (error) {
      notifyError(error, "Không tải được danh sách phiên bản");
      setVariantOptions(ensureOption([], keep?.id, keep?.name));
    } finally {
      setLoadingVariants(false);
    }
  };

  const loadDetail = async (carId: string) => {
    setLoading(true);
    try {
      const detail = (await getUsedCar(carId)) as UsedCarListing;
      const values = usedCarToFormValues(detail);
      form.setFieldsValue(values);
      setMedia(
        (detail.media || [])
          .map((item, index) => ({
            id: String(item.id || item._id || `media-${index}`),
            url: String(item.url || ""),
            isCover: Boolean(item.isCover),
            canManage: Boolean(item.id || item._id),
          }))
          .filter((item) => item.url),
      );
      setListingId(getUsedCarId(detail) || carId);

      await loadBrands(values.vehicleType, {
        id: values.brandId,
        name: detail.brandName,
      });
      if (values.brandId) {
        await loadModels(values.brandId, values.vehicleType, {
          id: values.modelId,
          name: detail.modelName,
        });
      }
      if (values.modelId) {
        await loadVariants(values.modelId, {
          id: values.variantId,
          name: detail.variantName,
        });
      }
    } catch (error) {
      notifyError(error, "Không tải được tin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadDetail(id);
    else {
      form.setFieldsValue({
        vehicleType: "CAR",
        negotiable: true,
        transmission: "AUTOMATIC",
        fuelType: "GASOLINE",
        condition: "EXCELLENT",
        bodyType: "SEDAN",
        provinceCode: "79",
        districtCode: "760",
        brandId: undefined,
        modelId: undefined,
        variantId: undefined,
      });
      loadBrands("CAR");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fillMercedes = async () => {
    const brandId = toCatalogObjectId("local:mercedes");
    const modelId = toCatalogObjectId("local:mercedes:s-class");
    const variantId = toCatalogObjectId("local:mercedes:s450");

    form.setFieldsValue({
      vehicleType: MERCEDES_S450_SEED.vehicleType,
      title: MERCEDES_S450_SEED.title,
      description: MERCEDES_S450_SEED.description,
      manufactureYear: MERCEDES_S450_SEED.manufactureYear,
      mileage: MERCEDES_S450_SEED.mileage,
      price: MERCEDES_S450_SEED.price,
      negotiable: MERCEDES_S450_SEED.negotiable,
      transmission: MERCEDES_S450_SEED.transmission,
      fuelType: MERCEDES_S450_SEED.fuelType,
      condition: MERCEDES_S450_SEED.condition,
      bodyType: MERCEDES_S450_SEED.bodyType,
      exteriorColor: MERCEDES_S450_SEED.exteriorColor,
      interiorColor: MERCEDES_S450_SEED.interiorColor,
      provinceCode: "79",
      districtCode: "760",
      brandId,
      modelId,
      variantId,
    });

    await loadBrands("CAR");
    await loadModels(brandId, "CAR");
    await loadVariants(modelId);

    message.success(
      `Đã điền mẫu ${findCatalogLabel("brand", brandId)} ${findCatalogLabel(
        "variant",
        variantId,
      )}`,
    );
  };

  const handleSave = async (publish = false) => {
    const values = await form.validateFields();
    const payload = cleanPayload(values);

    if (!payload.brandId || !payload.modelId) {
      notifyError("Vui lòng chọn hãng xe và dòng xe trước khi lưu/đăng.");
      return;
    }

    if (publish && (!values.provinceCode || !values.districtCode)) {
      notifyError("Cần nhập mã Tỉnh/TP và Quận/Huyện trước khi đăng.");
      return;
    }

    if (publish && totalImageCount < 5) {
      notifyError(
        `Gửi duyệt cần tối thiểu 5 ảnh (hiện có ${totalImageCount}). Hãy thêm ảnh rồi thử lại.`,
      );
      return;
    }

    setSaving(true);
    try {
      let currentId = listingId;
      if (isEdit || currentId) {
        await updateUsedCar(currentId, payload);
      } else {
        const created = (await createUsedCar(payload)) as {
          id?: string;
          _id?: string;
        };
        currentId = getUsedCarId(created);
        if (!currentId) throw new Error("Không nhận được id tin mới");
        setListingId(currentId);
      }

      for (const file of fileList) {
        if (file.originFileObj && currentId) {
          await uploadUsedCarMedia(
            currentId,
            file.originFileObj as File,
            file.name,
          );
        }
      }
      setFileList([]);

      if (!publish) {
        message.success("Đã lưu nháp (DRAFT)");
        navigate(`/dashboard/used-cars/${currentId}`);
        return;
      }

      const latest = (await getUsedCar(currentId)) as UsedCarListing;
      const serverMediaCount = (latest.media || []).filter((item) =>
        Boolean(item.url),
      ).length;
      setMedia(
        (latest.media || [])
          .map((item, index) => ({
            id: String(item.id || item._id || `media-${index}`),
            url: String(item.url || ""),
            isCover: Boolean(item.isCover),
            canManage: Boolean(item.id || item._id),
          }))
          .filter((item) => item.url),
      );

      if (serverMediaCount < 5) {
        notifyError(
          `Server chỉ ghi nhận ${serverMediaCount}/5 ảnh. Hãy thêm ảnh rồi gửi duyệt lại.`,
        );
        return;
      }

      await submitUsedCar(currentId);

      if (isAdmin) {
        try {
          await approveUsedCar(currentId);
          message.success("Đã đăng tin và duyệt (PUBLISHED)");
        } catch (approveError) {
          notifyWarning(
            `Đã gửi duyệt (PENDING_REVIEW). Duyệt tự động thất bại: ${getErrorMessage(
              approveError,
              "không có quyền duyệt",
            )}`,
          );
        }
      } else {
        message.success("Đã gửi duyệt (PENDING_REVIEW)");
      }

      navigate(`/dashboard/used-cars/${currentId}`);
    } catch (error) {
      notifyError(error, "Lưu / đăng tin thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const newId = await seedMercedesS450Listing({
        autoSubmit: true,
        autoApprove: isAdmin,
      });
      message.success("Đã tạo tin Mercedes S450 2019 kèm ảnh");
      navigate(`/dashboard/used-cars/${newId}`);
    } catch (error) {
      notifyError(error, "Seed tin S450 thất bại");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Space>
          <Button onClick={() => navigate("/dashboard/used-cars")}>
            Quay lại
          </Button>
          <h1 className="text-xl font-semibold m-0">{titleText}</h1>
        </Space>
        <Space wrap>
          {!isEdit && (
            <>
              <Button onClick={fillMercedes}>Điền mẫu S450</Button>
              <Button type="dashed" loading={seeding} onClick={handleSeed}>
                Tạo nhanh tin S450 + ảnh
              </Button>
            </>
          )}
        </Space>
      </div>

      <Card loading={loading}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="vehicleType"
                label="Loại xe"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: "CAR", label: "Ô tô (CAR)" },
                    { value: "MOTORBIKE", label: "Xe máy (MOTORBIKE)" },
                    { value: "ELECTRIC_CAR", label: "Ô tô điện" },
                    {
                      value: "ELECTRIC_MOTORBIKE",
                      label: "Xe máy điện",
                    },
                  ]}
                  onChange={(value) => {
                    form.setFieldsValue({
                      vehicleType: value,
                      brandId: undefined,
                      modelId: undefined,
                      variantId: undefined,
                    });
                    setModelOptions([]);
                    setVariantOptions([]);
                    loadBrands(String(value || "CAR"));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Form.Item
                name="title"
                label="Tiêu đề"
                rules={[{ required: true, message: "Nhập tiêu đề" }]}
              >
                <Input placeholder="MERCEDES-BENZ S450 2019" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Mô tả"
                rules={[{ required: true, message: "Nhập mô tả" }]}
              >
                <Input.TextArea rows={8} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="manufactureYear"
                label="Năm SX"
                rules={[{ required: true, message: "Chọn năm SX" }]}
              >
                <InputNumber style={{ width: "100%" }} min={1980} max={2030} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="mileage"
                label="Số km"
                rules={[{ required: true, message: "Nhập số km" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="price" label="Giá (VNĐ)">
                <InputNumber style={{ width: "100%" }} min={0} step={1000000} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="negotiable"
                label="Thương lượng"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="transmission"
                label="Hộp số"
                rules={[{ required: true, message: "Chọn hộp số" }]}
              >
                <Select
                  options={[
                    { value: "AUTOMATIC", label: "AUTOMATIC" },
                    { value: "MANUAL", label: "MANUAL" },
                    { value: "CVT", label: "CVT" },
                    { value: "DCT", label: "DCT" },
                    { value: "OTHER", label: "OTHER" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="fuelType"
                label="Nhiên liệu"
                rules={[{ required: true, message: "Chọn nhiên liệu" }]}
              >
                <Select
                  options={[
                    { value: "GASOLINE", label: "GASOLINE" },
                    { value: "DIESEL", label: "DIESEL" },
                    { value: "HYBRID", label: "HYBRID" },
                    { value: "ELECTRIC", label: "ELECTRIC" },
                    { value: "OTHER", label: "OTHER" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="condition"
                label="Tình trạng"
                rules={[{ required: true, message: "Chọn tình trạng" }]}
              >
                <Select
                  options={[
                    { value: "EXCELLENT", label: "EXCELLENT" },
                    { value: "GOOD", label: "GOOD" },
                    { value: "FAIR", label: "FAIR" },
                    { value: "NEEDS_REPAIR", label: "NEEDS_REPAIR" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="bodyType" label="Kiểu dáng">
                <Select
                  allowClear
                  options={[
                    { value: "SEDAN", label: "SEDAN" },
                    { value: "SUV", label: "SUV" },
                    { value: "HATCHBACK", label: "HATCHBACK" },
                    { value: "PICKUP", label: "PICKUP" },
                    { value: "OTHER", label: "OTHER" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="plateNumber" label="Biển số">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="exteriorColor" label="Màu ngoại thất">
                <Input placeholder="Đen" />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="interiorColor" label="Màu nội thất">
                <Input placeholder="Nâu" />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="provinceCode"
                label="Tỉnh/TP (mã)"
                rules={[{ required: true, message: "Nhập mã tỉnh/TP" }]}
              >
                <Input placeholder="79" />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="districtCode"
                label="Quận/Huyện (mã)"
                rules={[{ required: true, message: "Nhập mã quận/huyện" }]}
              >
                <Input placeholder="760" />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="contactName" label="Người liên hệ">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="contactPhone" label="SĐT liên hệ">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="brandId"
                label="Hãng xe"
                extra="Chọn có sẵn hoặc gõ tên rồi thêm mới — mọi hãng đều đăng được."
                rules={[{ required: true, message: "Chọn hãng xe" }]}
              >
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  loading={loadingBrands}
                  placeholder="VD: Toyota, Mercedes-Benz..."
                  options={brandOptions}
                  onSearch={setBrandSearch}
                  onChange={(value) => {
                    form.setFieldsValue({
                      brandId: value,
                      modelId: undefined,
                      variantId: undefined,
                    });
                    setModelOptions([]);
                    setVariantOptions([]);
                    setBrandSearch("");
                    if (value) {
                      loadModels(String(value), vehicleType || "CAR");
                    }
                  }}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      {brandSearch.trim() &&
                        !brandOptions.some(
                          (item) =>
                            item.label.toLowerCase() ===
                            brandSearch.trim().toLowerCase(),
                        ) && (
                          <>
                            <Divider style={{ margin: "8px 0" }} />
                            <Button
                              type="link"
                              icon={<PlusOutlined />}
                              onClick={() => {
                                const created = registerCustomCatalogOption(
                                  "brand",
                                  brandSearch.trim(),
                                  { vehicleType: vehicleType || "CAR" },
                                );
                                if (!created) return;
                                const option = {
                                  value: created.id,
                                  label: created.label,
                                };
                                setBrandOptions((prev) => [option, ...prev]);
                                form.setFieldsValue({
                                  brandId: created.id,
                                  modelId: undefined,
                                  variantId: undefined,
                                });
                                setModelOptions([]);
                                setVariantOptions([]);
                                setBrandSearch("");
                              }}
                            >
                              Thêm hãng “{brandSearch.trim()}”
                            </Button>
                          </>
                        )}
                    </>
                  )}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="modelId"
                label="Dòng xe"
                extra={
                  !brandIdWatch ? "Chọn hãng trước" : "Có thể thêm dòng mới"
                }
                rules={[{ required: true, message: "Chọn dòng xe" }]}
              >
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  loading={loadingModels}
                  disabled={!brandIdWatch}
                  placeholder="VD: Camry, S-Class..."
                  options={modelOptions}
                  onSearch={setModelSearch}
                  onChange={(value) => {
                    form.setFieldsValue({
                      modelId: value,
                      variantId: undefined,
                    });
                    setVariantOptions([]);
                    setModelSearch("");
                    if (value) loadVariants(String(value));
                  }}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      {brandIdWatch &&
                        modelSearch.trim() &&
                        !modelOptions.some(
                          (item) =>
                            item.label.toLowerCase() ===
                            modelSearch.trim().toLowerCase(),
                        ) && (
                          <>
                            <Divider style={{ margin: "8px 0" }} />
                            <Button
                              type="link"
                              icon={<PlusOutlined />}
                              onClick={() => {
                                const created = registerCustomCatalogOption(
                                  "model",
                                  modelSearch.trim(),
                                  {
                                    brandId: String(brandIdWatch),
                                    vehicleType: vehicleType || "CAR",
                                  },
                                );
                                if (!created) return;
                                const option = {
                                  value: created.id,
                                  label: created.label,
                                };
                                setModelOptions((prev) => [option, ...prev]);
                                form.setFieldsValue({
                                  modelId: created.id,
                                  variantId: undefined,
                                });
                                setVariantOptions([]);
                                setModelSearch("");
                              }}
                            >
                              Thêm dòng “{modelSearch.trim()}”
                            </Button>
                          </>
                        )}
                    </>
                  )}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="variantId"
                label="Phiên bản"
                extra={
                  !modelIdWatch
                    ? "Chọn dòng xe trước"
                    : "Tùy chọn / có thể thêm mới"
                }
              >
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  loading={loadingVariants}
                  disabled={!modelIdWatch}
                  placeholder="VD: S450, 2.5Q..."
                  options={variantOptions}
                  onSearch={setVariantSearch}
                  onChange={() => setVariantSearch("")}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      {modelIdWatch &&
                        variantSearch.trim() &&
                        !variantOptions.some(
                          (item) =>
                            item.label.toLowerCase() ===
                            variantSearch.trim().toLowerCase(),
                        ) && (
                          <>
                            <Divider style={{ margin: "8px 0" }} />
                            <Button
                              type="link"
                              icon={<PlusOutlined />}
                              onClick={() => {
                                const created = registerCustomCatalogOption(
                                  "variant",
                                  variantSearch.trim(),
                                  { modelId: String(modelIdWatch) },
                                );
                                if (!created) return;
                                const option = {
                                  value: created.id,
                                  label: created.label,
                                };
                                setVariantOptions((prev) => [option, ...prev]);
                                form.setFieldsValue({ variantId: created.id });
                                setVariantSearch("");
                              }}
                            >
                              Thêm phiên bản “{variantSearch.trim()}”
                            </Button>
                          </>
                        )}
                    </>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          {(isEdit || listingId) && media.length > 0 && (
            <div className="mb-4">
              <div className="font-medium mb-2">
                Ảnh hiện có ({media.length})
              </div>
              <Image.PreviewGroup>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {media.map((item) => (
                    <div key={item.id} className="border rounded p-2">
                      <Image src={item.url} className="rounded" />
                      {item.canManage && (
                        <Space className="mt-2" wrap>
                          {!item.isCover && (
                            <Button
                              size="small"
                              onClick={async () => {
                                try {
                                  await setUsedCarCover(listingId, item.id);
                                  message.success("Đã đặt ảnh bìa");
                                  await loadDetail(listingId);
                                } catch (error) {
                                  notifyError(error, "Đặt ảnh bìa thất bại");
                                }
                              }}
                            >
                              Làm bìa
                            </Button>
                          )}
                          <Button
                            size="small"
                            danger
                            onClick={async () => {
                              try {
                                await deleteUsedCarMedia(listingId, item.id);
                                message.success("Đã xóa ảnh");
                                await loadDetail(listingId);
                              } catch (error) {
                                notifyError(error, "Xóa ảnh thất bại");
                              }
                            }}
                          >
                            Xóa
                          </Button>
                        </Space>
                      )}
                    </div>
                  ))}
                </div>
              </Image.PreviewGroup>
            </div>
          )}

          <Form.Item
            label={`Thêm ảnh (đã có ${totalImageCount}/5 tối thiểu để đăng)`}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList: next }) => setFileList(next)}
              multiple
              accept="image/jpeg,image/png,image/webp,image/heic"
            >
              <div>
                <UploadOutlined />
                <div className="mt-1">Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Space wrap>
            <Button loading={saving} onClick={() => handleSave(false)}>
              Lưu nháp
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              loading={saving}
              onClick={() => handleSave(true)}
            >
              {isAdmin
                ? "Đăng tin (gửi duyệt + duyệt)"
                : "Đăng tin / gửi duyệt"}
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
