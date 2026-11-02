import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Col,
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
import {
  createUsedCar,
  deleteUsedCarMedia,
  getUsedCar,
  setUsedCarCover,
  submitUsedCar,
  updateUsedCar,
  uploadUsedCarMedia,
} from "../../Config/adminApi";
import { getErrorMessage } from "../../Utils/apiData";
import { getUsedCarId, type UsedCarListing } from "../../models/UsedCar";
import { MERCEDES_S450_SEED } from "../../models/UsedCarWrite";
import { seedMercedesS450Listing } from "../../Utils/seedMercedesListing";

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
    Array<{ id: string; url: string; isCover?: boolean }>
  >([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const titleText = useMemo(
    () => (isEdit ? "Sửa tin xe cũ" : "Thêm tin xe cũ"),
    [isEdit]
  );

  const loadDetail = async (carId: string) => {
    setLoading(true);
    try {
      const detail = (await getUsedCar(carId)) as UsedCarListing;
      form.setFieldsValue({
        vehicleType: detail.vehicleType || "CAR",
        title: detail.title,
        description: detail.description,
        manufactureYear: detail.manufactureYear,
        mileage: detail.mileage,
        price: detail.price,
        negotiable: detail.negotiable ?? true,
        transmission: detail.transmission,
        fuelType: detail.fuelType,
        condition: detail.condition,
        contactName: detail.contactName,
        contactPhone: detail.contactPhone,
        plateNumber: detail.plateNumber,
        features: (detail.features || []).join(", "),
      });
      setMedia(
        (detail.media || [])
          .map((item) => ({
            id: String(item.id || item._id || ""),
            url: String(item.url || ""),
            isCover: Boolean(item.isCover),
          }))
          .filter((item) => item.id && item.url)
      );
      setListingId(getUsedCarId(detail) || carId);
    } catch (error) {
      message.error(getErrorMessage(error, "Không tải được tin"));
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
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fillMercedes = () => {
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
      features: MERCEDES_S450_SEED.features.join(", "),
    });
    message.success("Đã điền nội dung Mercedes S450 2019");
  };

  const buildPayload = (values: Record<string, unknown>) => {
    const features =
      typeof values.features === "string"
        ? values.features
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];
    return {
      vehicleType: values.vehicleType,
      title: values.title,
      description: values.description,
      manufactureYear: values.manufactureYear,
      mileage: values.mileage,
      price: values.price,
      negotiable: values.negotiable,
      transmission: values.transmission,
      fuelType: values.fuelType,
      condition: values.condition,
      contactName: values.contactName,
      contactPhone: values.contactPhone,
      plateNumber: values.plateNumber,
      features,
    };
  };

  const handleSave = async (submitAfter = false) => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      let currentId = listingId;
      if (isEdit || currentId) {
        await updateUsedCar(currentId, buildPayload(values));
      } else {
        const created = (await createUsedCar(buildPayload(values))) as {
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
            file.name
          );
        }
      }
      setFileList([]);

      if (submitAfter && currentId) {
        await submitUsedCar(currentId);
        message.success("Đã lưu và gửi duyệt");
      } else {
        message.success("Đã lưu tin");
      }

      navigate(`/dashboard/used-cars/${currentId}`);
    } catch (error) {
      message.error(getErrorMessage(error, "Lưu tin thất bại"));
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const newId = await seedMercedesS450Listing({
        autoSubmit: true,
        autoApprove: true,
      });
      message.success("Đã tạo tin Mercedes S450 2019 kèm ảnh");
      navigate(`/dashboard/used-cars/${newId}`);
    } catch (error) {
      message.error(getErrorMessage(error, "Seed tin S450 thất bại"));
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
                    { value: "CAR", label: "CAR" },
                    { value: "MOTORBIKE", label: "MOTORBIKE" },
                    { value: "ELECTRIC_CAR", label: "ELECTRIC_CAR" },
                    {
                      value: "ELECTRIC_MOTORBIKE",
                      label: "ELECTRIC_MOTORBIKE",
                    },
                  ]}
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
              <Form.Item name="manufactureYear" label="Năm SX">
                <InputNumber style={{ width: "100%" }} min={1980} max={2030} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="mileage" label="Số km">
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
              <Form.Item name="transmission" label="Hộp số">
                <Select
                  allowClear
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
              <Form.Item name="fuelType" label="Nhiên liệu">
                <Select
                  allowClear
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
              <Form.Item name="condition" label="Tình trạng">
                <Select
                  allowClear
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
              <Form.Item name="plateNumber" label="Biển số">
                <Input />
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
            <Col span={24}>
              <Form.Item
                name="features"
                label="Tiện ích / điểm nổi bật (phân tách bằng dấu phẩy)"
              >
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>

          {(isEdit || listingId) && media.length > 0 && (
            <div className="mb-4">
              <div className="font-medium mb-2">Ảnh hiện có</div>
              <Image.PreviewGroup>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {media.map((item) => (
                    <div key={item.id} className="border rounded p-2">
                      <Image src={item.url} className="rounded" />
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
                                message.error(
                                  getErrorMessage(error, "Đặt ảnh bìa thất bại")
                                );
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
                              message.error(
                                getErrorMessage(error, "Xóa ảnh thất bại")
                              );
                            }
                          }}
                        >
                          Xóa
                        </Button>
                      </Space>
                    </div>
                  ))}
                </div>
              </Image.PreviewGroup>
            </div>
          )}

          <Form.Item label="Thêm ảnh (tối thiểu 5 ảnh để gửi duyệt)">
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList: next }) => setFileList(next)}
              multiple
            >
              <div>
                <UploadOutlined />
                <div className="mt-1">Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Space wrap>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              loading={saving}
              onClick={() => handleSave(false)}
            >
              Lưu nháp
            </Button>
            <Button loading={saving} onClick={() => handleSave(true)}>
              Lưu & gửi duyệt
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
