"use client";

import axios from "axios";
import { Input } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import CurrencyVN from "@/components/ui/currency-vn";

import useCart from "@/hooks/use-cart";
import getCurrentUser from "@/actions/get-current-user";

const Summary = () => {
  const user = getCurrentUser();
  const t = useTranslations("Cart");
  const locale = useLocale();

  const [coupon, setCoupon] = useState("");
  const [couponId, setCouponId] = useState("");
  const [useCoupon, setUseCoupon] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPriceVN, setTotalPriceVN] = useState(0);

  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAll();
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  useEffect(() => {
    let price = items.reduce((total, item) => {
      if (item.quantity === undefined) {
        item.quantity = 1;
      }
      return total + Number(item.priceDiscount) * item.quantity;
    }, 0);
    setTotalPrice(price);

    let priceVN = items.reduce((total, item) => {
      if (item.quantity === undefined) {
        item.quantity = 1;
      }
      return total + Number(item.priceVNDiscount) * item.quantity;
    }, 0);
    setTotalPriceVN(priceVN);

    setUseCoupon(false);
  }, [items]);

  const onCheckCoupon = async () => {
    if (useCoupon) {
      setCoupon("");
      toast.error("Mã khuyến mãi đã được áp dụng.");
      return;
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkcoupon`,
      { coupon }
    );
    if (response && response.data && response.data.couponData) {
      const currentDate = new Date();
      const data = response.data.couponData;
      if (new Date(data.expiredDate) < currentDate) {
        setCoupon("");
        toast.error("Mã khuyễn mãi đã hết hạn sử dụng.");
        return;
      }
      if (data.quantity === 0) {
        setCoupon("");
        toast.error("Mã khuyễn mãi đã hết số lượng.");
        return;
      }
      if (locale === "vi") {
        const discountedPriceVN =
          totalPriceVN - (totalPriceVN * data.value) / 100;
        setTotalPriceVN(discountedPriceVN);
      }
      if (locale === "en") {
        const discountedPrice = totalPrice - (totalPrice * data.value) / 100;
        setTotalPrice(discountedPrice);
      }
      setUseCoupon(true);
      setCouponId(data.id);
      setCoupon("");
      toast.success("Áp dụng mã khuyến mãi thành công.");
    } else {
      setCoupon("");
      toast.error("Mã khuyễn mãi không khả dụng.");
    }
  };

  const onCheckout = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      {
        products: items,
        totalPrice,
        userId: user ? user.id : "",
        couponId,
      }
    );

    window.location = response.data.url;
  };

  const onCheckoutVNPAY = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/vnpay`,
      {
        products: items,
        totalPrice: totalPriceVN,
        userId: user ? user.id : "",
      }
    );

    window.location = response.data.url;
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">
        {t("order-summary")}
      </h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">
            {t("order-total")}
          </div>
          {locale === "vi" ? (
            <CurrencyVN value={totalPriceVN} />
          ) : (
            <Currency value={totalPrice} />
          )}
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Input
          className="rounded-2xl w-72"
          placeholder={t("coupon-action")}
          value={coupon}
          onChange={(e) => {
            setCoupon(e.target.value);
          }}
        />
        <Button className="bg-red-400" onClick={onCheckCoupon}>
          {t("submit")}
        </Button>
      </div>
      <Button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full mt-6 bg-blue-500"
      >
        {t("checkout")}
      </Button>
      {locale === "vi" && (
        <Button
          onClick={onCheckoutVNPAY}
          disabled={items.length === 0}
          className="w-full mt-6"
        >
          Thanh toán bằng VNPAY
        </Button>
      )}
    </div>
  );
};

export default Summary;
