import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Form,
  Upload,
  Input,
  Select,
  message,
  InputNumber,
  DatePicker,
  Space,
} from "antd";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import { APILink } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { PlusOutlined } from "@ant-design/icons";

export default function AddProperties() {
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const navigate = useNavigate();

  const [form] = Form.useForm();
  var token = sessionStorage.getItem("token");

  const { setLayout } = useLayout();
  useEffect(() => {
    if (sessionStorage.getItem("role") === "SAdmin") {
      setLayout("SAdmin");
    } else if (sessionStorage.getItem("role") === "Admin") {
      setLayout("Admin");
    } else {
      setLayout("auth");
    }
  }, [setLayout]);
  const [waiting, setwaiting] = useState(false);
  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent automatic upload
  };
  const [listProduct, setlistProduct] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        setwaiting(true);
        const response = await axios.get(APILink() + "Product", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);

        setlistProduct(response.data.data);
      } catch (error) {
        message.error("Error: ", error);
      } finally {
        setwaiting(false);
      }
    };
    fetchdata();
  }, []);
  const [listNameProperties, setlistNameProperties] = useState([]);
  const [listNamePropertiesMatch, setlistNamePropertiesMatch] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(APILink() + "Properties", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);

        setlistNameProperties(response.data.data);
      } catch (error) {
        message.error("Error: ", error);
      } finally {
      }
    };
    fetchdata();
  }, []);
  const [listpropertiesByStore, setlistpropertiesByStore] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(
          APILink() + "Properties/" + sessionStorage.getItem("storeId"),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data.data);
        setlistpropertiesByStore(response.data.data);
      } catch (error) {
      } finally {
      }
    };
    fetchdata();
  }, []);
  const [listStore, setlistStore] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(APILink() + "Store", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);

        setlistStore(response.data.data);
      } catch (error) {
      } finally {
      }
    };
    fetchdata();
  }, []);
  const handleCreate = async (value) => {
    // console.log(value);
    // const Product = listProduct.find((e) => e.productId === value.ProductId);
    // console.log(Product);

    // console.log(value);
    const formData = new FormData();
    try {
      var PropertiesName = listNameProperties.filter(
        (e) => e.id === value.PropertiesName
      )[0].name;
      console.log(PropertiesName);
      formData.append("ProductId", value.ProductId);
      formData.append("StoreId", value.StoreId);
      formData.append("CostPrice", value.CostPrice);
      formData.append("Price", value.Price);
      formData.append("Name", PropertiesName);
      formData.append("Image", value.Image);
    } catch (error) {
      message.error("Error Form : " + error);
      return;
    }
    try {
      setwaiting(true);

      const response = await axios.post(APILink() + "Properties", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      if (window.confirm("Create Success.Back To List")) {
        navigate(`/listproperties`);
      }
    } catch (error) {
      message.error("Create Error: " + error);
    } finally {
      setwaiting(false);
    }
  };

  form.setFieldsValue({
    StoreId: sessionStorage.getItem("storeId"),
    storeAddress: sessionStorage.getItem("storeAddress"),
  });
  const handlChangeProduct = (value, option) => {
    var data = listNameProperties.filter((e) => e.productId === value);
    var currentPropertiesByproduc = listpropertiesByStore.filter(
      (e) => e.productId === value
    );
    if (currentPropertiesByproduc.length === 0) {
      setlistNamePropertiesMatch(data);
    } else {
      currentPropertiesByproduc.forEach((e) => {
        data = data.filter((g) => g.name !== e.name);
      });
      console.log("AAAAAAAAAAAAAAA");
      console.log(data);

      setlistNamePropertiesMatch(data);
    }
    form.setFieldsValue({
      PropertiesName: "",
      CostPrice: "",
      Price: "",
      Image: "",
    });
  };
  const handlChangePropertiesname = (value, option) => {
    var data = listNameProperties.filter((e) => e.id === value)[0];
    var cosst = data.costPrice;
    var price = data.price;
    const parts = data.image.split("/");
    const filename1 = parts[parts.length - 1];

    form.setFieldsValue({
      CostPrice: cosst,
      Price: price,
      Image: filename1,
    });
  };
  return (
    <>
      {waiting && (
        <div
          className="LoadingMain"
          style={{ width: "100vw", height: "105vh" }}
        >
          <div className="background"></div>
          <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
            <circle
              class="pl__ring pl__ring--a"
              cx="120"
              cy="120"
              r="105"
              fill="none"
              stroke="#000"
              stroke-width="20"
              stroke-dasharray="0 660"
              stroke-dashoffset="-330"
              stroke-linecap="round"
            ></circle>
            <circle
              class="pl__ring pl__ring--b"
              cx="120"
              cy="120"
              r="35"
              fill="none"
              stroke="#000"
              stroke-width="20"
              stroke-dasharray="0 220"
              stroke-dashoffset="-110"
              stroke-linecap="round"
            ></circle>
            <circle
              class="pl__ring pl__ring--c"
              cx="85"
              cy="120"
              r="70"
              fill="none"
              stroke="#000"
              stroke-width="20"
              stroke-dasharray="0 440"
              stroke-linecap="round"
            ></circle>
            <circle
              class="pl__ring pl__ring--d"
              cx="155"
              cy="120"
              r="70"
              fill="none"
              stroke="#000"
              stroke-width="20"
              stroke-dasharray="0 440"
              stroke-linecap="round"
            ></circle>
          </svg>
        </div>
      )}
      <div className="container my-5" style={{ height: "auto", width: "70%" }}>
        <h1 className="mb-4">Create New Properties.</h1>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="Product."
            name="ProductId"
            rules={[{ required: true, message: "Please input Product!" }]}
          >
            <Select style={{ width: "35%" }} onChange={handlChangeProduct}>
              {listProduct?.map((item) => (
                <Option key={item.productId} value={item.productId}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Name."
            name="PropertiesName"
            rules={[{ required: true, message: "Please input Product!" }]}
          >
            <Select
              style={{ width: "35%" }}
              onChange={handlChangePropertiesname}
            >
              {listNamePropertiesMatch?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            style={{ width: "35%" }}
            label="Cost (USD)."
            name="CostPrice"
            rules={[{ required: true, message: "Please input Cost!" }]}
          >
            <InputNumber readOnly />
          </Form.Item>
          <Form.Item
            style={{ width: "35%" }}
            label="Price (USD)."
            name="Price"
            rules={[{ required: true, message: "Please input Price!" }]}
          >
            <InputNumber readOnly />
          </Form.Item>
          <Form.Item
            label="Store (Readonly)."
            name="storeAddress"
            style={{ width: "35%" }}
          >
            <Input readOnly />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
          <Form.Item name="Image" style={{ width: "35%" }}>
            <Input hidden />
          </Form.Item>
          <Form.Item name="StoreId" style={{ width: "35%" }}>
            <Input hidden />
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
