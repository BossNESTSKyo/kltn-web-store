"use client";

import { Input } from "antd";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  BsYoutube,
  BsTiktok,
  BsTwitter,
  BsFacebook,
  BsInstagram,
} from "react-icons/bs";
import {
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaCreditCard,
} from "react-icons/fa";

const gridArr = [
  { img: "/footer/1.webp", text: "MIỄN PHÍ vận chuyển cho đơn hàng từ 500K" },
  { img: "/footer/2.webp", text: "Giao hàng NHANH toàn quốc" },
  { img: "/footer/3.webp", text: "Miễn phí ĐỔI HÀNG trong 30 ngày" },
  { img: "/footer/4.webp", text: "Thủ tục đổi hàng DỄ DÀNG" },
  { img: "/footer/5.webp", text: "ĐA DẠNG hình thức thanh toán" },
  { img: "/footer/6.webp", text: "ĐƯỢC KIỂM TRA HÀNG trước khi thanh toán" },
];

const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer className="p-6 bg-black text-white">
      <div className="grid grid-cols-6 gap-2">
        {gridArr.map((item) => {
          return (
            <div
              className="flex items-center gap-4 p-4 bg-gray-900"
              key={item.text}
            >
              <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-12 sm:w-20">
                <Image
                  fill
                  src={item.img}
                  alt=""
                  className="object-cover object-center"
                />
              </div>
              <p className="text-sm">{item.text}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-2 mx-40 mt-8">
        <div>
          <p className="text-xl font-bold">{t("hotline")}</p>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-xl font-bold">{t("about-us")}</p>
          <div className="flex flex-col gap-2">
            <p>{t("contact")}</p>
            <p>{t("introduce")}</p>
            <p>{t("new")}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-xl font-bold">{t("support")}</p>
          <div className="flex flex-col gap-2">
            <p>{t("product-exchange-policy")}</p>
            <p>{t("complaint-resolution-policy")}</p>
            <p>{t("shipping-delivery-policy")}</p>
            <p>{t("payment-method")}</p>
            <p>{t("purchase-guide")}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-bold text-xl text-center">STORE</p>
          <div className="flex flex-col gap-2">
            <p>{t("subscribe-title")}</p>
            <div className="flex gap-2">
              <Input className="rounded-2xl" />
              <button className="bg-red-500 rounded-2xl p-2">
                {t("subscribe-text")}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p>{t("payment-title")}</p>
            <div className="flex gap-4">
              <FaCcVisa size={25} />
              <FaCcPaypal size={25} />
              <FaCcMastercard size={25} />
              <FaCreditCard size={25} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <div className="flex gap-8 justify-center">
          <BsInstagram size={25} className="hover:cursor-pointer" />
          <BsTiktok size={25} className="hover:cursor-pointer" />
          <BsTwitter size={25} className="hover:cursor-pointer" />
          <BsFacebook size={25} className="hover:cursor-pointer" />
          <BsYoutube size={25} className="hover:cursor-pointer" />
        </div>
        <p className="text-center text-xs">&copy; {t("policy")}</p>
      </div>
    </footer>
  );
};

export default Footer;
