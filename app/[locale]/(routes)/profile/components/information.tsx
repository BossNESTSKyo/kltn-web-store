"use client";

import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Input, Radio, Col, InputNumber, Row, Slider } from "antd";

import getCurrentUser from "@/actions/get-current-user";

import Button from "@/components/ui/button";

const InformationPage = () => {
  const t = useTranslations("Profile");
  const user = getCurrentUser();

  const [userInfo, setUserInfo] = useState({
    imageUrl: "/user.png",
    gender: 1,
    name: "",
    email: "",
    phone: "",
    address: "",
    height: 1,
    weight: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user ? user.id : "new"}`
      );

      const data = response.data.data;

      setUserInfo({
        imageUrl: data && data.imageUrl ? data.imageUrl : "/user.png",
        gender: data && data.gender ? data.gender : 1,
        name: data && data.name ? data.name : "",
        email: data && data.email ? data.email : "",
        phone: data && data.phone ? data.phone : "",
        address: data && data.address ? data.address : "",
        height: data && data.height ? data.height : 1,
        weight: data && data.weight ? data.weight : 1,
      });
    };

    fetchData();
  }, [user]);

  const onChangeValue = (e: any, name: string) => {
    if (name === "height" || name === "weight") {
      setUserInfo((prevState) => ({
        ...prevState,
        [name]: e,
      }));
    } else {
      setUserInfo((prevState) => ({
        ...prevState,
        [name]: e.target.value,
      }));
    }
  };

  const onClickConfirm = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user ? user.id : ""}`,
        {
          gender: userInfo.gender,
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          address: userInfo.address,
          height: userInfo.height,
          weight: userInfo.weight,
        }
      );

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user ? user.id : "new"}`
      );

      const data = response.data.data;

      setUserInfo({
        imageUrl: data && data.imageUrl ? data.imageUrl : "/user.png",
        gender: data && data.gender ? data.gender : 1,
        name: data && data.name ? data.name : "",
        email: data && data.email ? data.email : "",
        phone: data && data.phone ? data.phone : "",
        address: data && data.address ? data.address : "",
        height: data && data.height ? data.height : 1,
        weight: data && data.weight ? data.weight : 1,
      });

      toast.success("Cập nhật thông tin cá nhân thành công.");
    } catch {
      toast.error("Cập nhật thông tin thất bại.");
    }
  };

  return (
    <div className="mt-6 lg:col-span-4 lg:mt-0">
      <div className="text-2xl font-bold mb-2">{t("info.title")}</div>
      <div className="flex flex-col gap-3 border-2 rounded-md p-3">
        <div className="flex gap-3">
          <div className="flex flex-col gap-4 items-center w-52">
            <label className="text-lg">{t("info.name")}</label>
            <div className="relative h-24 w-24 rounded-full overflow-hidden sm:h-20 sm:w-20">
              <Image
                fill
                src={userInfo ? userInfo.imageUrl : "/user.png"}
                alt=""
                className="object-cover object-center"
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div>
              <Radio.Group
                onChange={(e) => onChangeValue(e, "gender")}
                value={userInfo ? userInfo.gender : 1}
              >
                <Radio value={1} className="mr-16">
                  {t("info.male")}
                </Radio>
                <Radio value={2}>{t("info.female")}</Radio>
              </Radio.Group>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <label>{t("info.user-name")}</label>
                <Input
                  value={userInfo ? userInfo.name : ""}
                  className="w-80"
                  onChange={(e) => onChangeValue(e, "name")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>{t("info.email")}</label>
                <Input
                  value={userInfo ? userInfo.email : ""}
                  className="w-80"
                  onChange={(e) => onChangeValue(e, "email")}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label>{t("info.phone")}</label>
              <Input
                value={userInfo ? userInfo.phone : ""}
                className="w-full"
                onChange={(e) => onChangeValue(e, "phone")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>{t("info.address")}</label>
              <Input
                value={userInfo ? userInfo.address : ""}
                className="w-full"
                onChange={(e) => onChangeValue(e, "address")}
              />
            </div>
          </div>
        </div>
        <div className="w-40 text-lg text-center">{t("info.other-name")}</div>
        <div className="flex flex-col gap-1">
          <label>{t("info.height")} (cm)</label>
          <div>
            <Row>
              <Col span={20}>
                <Slider
                  min={1}
                  max={200}
                  onChange={(value) => onChangeValue(value, "height")}
                  value={userInfo ? userInfo.height : 1}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={200}
                  style={{
                    margin: "0 16px",
                  }}
                  value={userInfo ? userInfo.height : 1}
                  onChange={(value) => onChangeValue(value, "height")}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label>{t("info.weight")} (kg)</label>
          <div>
            <Row>
              <Col span={20}>
                <Slider
                  min={1}
                  max={150}
                  onChange={(value) => onChangeValue(value, "weight")}
                  value={userInfo ? userInfo.weight : 1}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={150}
                  style={{
                    margin: "0 16px",
                  }}
                  value={userInfo ? userInfo.weight : 1}
                  onChange={(value) => onChangeValue(value, "weight")}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <Button
            className="py-1 px-3 flex ml-auto text-sm"
            onClick={onClickConfirm}
          >
            {t("info.submit")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InformationPage;
