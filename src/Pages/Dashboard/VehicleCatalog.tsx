import { useEffect, useState } from "react";
import { Card, Col, Input, Row, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  listVehicleBrands,
  listVehicleModels,
  listVehicleVariants,
} from "../../Config/managementApi";
import { getErrorMessage } from "../../Utils/apiData";
import { notifyError } from "../../Utils/notify";

type Row = Record<string, unknown> & { id?: string; _id?: string };

function getId(row: Row) {
  return String(row.id || row._id || "");
}

export default function VehicleCatalogPage() {
  const [vehicleType, setVehicleType] = useState("CAR");
  const [keyword, setKeyword] = useState("");
  const [brands, setBrands] = useState<Row[]>([]);
  const [models, setModels] = useState<Row[]>([]);
  const [variants, setVariants] = useState<Row[]>([]);
  const [brandId, setBrandId] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);

  const loadBrands = async () => {
    setLoadingBrands(true);
    try {
      const data = await listVehicleBrands({
        vehicleType: vehicleType || undefined,
        keyword: keyword || undefined,
      });
      setBrands(data.items as Row[]);
      setBrandId("");
      setModelId("");
      setModels([]);
      setVariants([]);
    } catch (error) {
      notifyError(error, "Không tải được brands");
    } finally {
      setLoadingBrands(false);
    }
  };

  useEffect(() => {
    loadBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBrands();
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const loadModels = async (nextBrandId: string) => {
    setBrandId(nextBrandId);
    setModelId("");
    setVariants([]);
    if (!nextBrandId) {
      setModels([]);
      return;
    }
    setLoadingModels(true);
    try {
      const data = await listVehicleModels({
        brandId: nextBrandId,
        vehicleType: vehicleType || undefined,
      });
      setModels(data.items as Row[]);
    } catch (error) {
      notifyError(error, "Không tải được models");
    } finally {
      setLoadingModels(false);
    }
  };

  const loadVariants = async (nextModelId: string) => {
    setModelId(nextModelId);
    if (!nextModelId) {
      setVariants([]);
      return;
    }
    setLoadingVariants(true);
    try {
      const data = await listVehicleVariants({ modelId: nextModelId });
      setVariants(data.items as Row[]);
    } catch (error) {
      notifyError(error, "Không tải được variants");
    } finally {
      setLoadingVariants(false);
    }
  };

  const nameColumns: ColumnsType<Row> = [
    {
      title: "Tên",
      render: (_, row) => String(row.name || row.title || "—"),
    },
    {
      title: "ID",
      render: (_, row) => getId(row) || "—",
      width: 220,
      ellipsis: true,
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <Card title="Catalog hãng / dòng / phiên bản xe">
        <Row gutter={12} className="mb-4">
          <Col xs={24} md={8}>
            <Select
              value={vehicleType}
              style={{ width: "100%" }}
              onChange={setVehicleType}
              options={[
                { value: "CAR", label: "CAR" },
                { value: "MOTORBIKE", label: "MOTORBIKE" },
                { value: "ELECTRIC_CAR", label: "ELECTRIC_CAR" },
                { value: "ELECTRIC_MOTORBIKE", label: "ELECTRIC_MOTORBIKE" },
              ]}
            />
          </Col>
          <Col xs={24} md={16}>
            <Input.Search
              placeholder="Tìm hãng xe"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              allowClear
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} lg={8}>
            <Card type="inner" title="Brands" size="small">
              <Table<Row>
                rowKey={(row) => getId(row)}
                loading={loadingBrands}
                dataSource={brands}
                pagination={{ pageSize: 8 }}
                columns={nameColumns}
                onRow={(row) => ({
                  onClick: () => loadModels(getId(row)),
                  className:
                    brandId === getId(row) ? "bg-green-50 cursor-pointer" : "cursor-pointer",
                })}
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card type="inner" title="Models" size="small">
              <Table<Row>
                rowKey={(row) => getId(row)}
                loading={loadingModels}
                dataSource={models}
                pagination={{ pageSize: 8 }}
                columns={nameColumns}
                onRow={(row) => ({
                  onClick: () => loadVariants(getId(row)),
                  className:
                    modelId === getId(row) ? "bg-green-50 cursor-pointer" : "cursor-pointer",
                })}
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card type="inner" title="Variants" size="small">
              <Table<Row>
                rowKey={(row) => getId(row)}
                loading={loadingVariants}
                dataSource={variants}
                pagination={{ pageSize: 8 }}
                columns={nameColumns}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
