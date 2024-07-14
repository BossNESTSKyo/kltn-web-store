"use client";

import axios from "axios";
import { DatePicker } from "antd";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { parseISO, differenceInDays } from "date-fns";

import getCurrentUser from "@/actions/get-current-user";

import Button from "@/components/ui/button";

import OrderItemPage from "./order-item";

const OrderPage = () => {
  const t = useTranslations("Profile");

  const user = getCurrentUser();
  const { RangePicker } = DatePicker;

  const [isMounted, setIsMounted] = useState(false);
  const [orderList, setOrderList] = useState<any>([]);
  const [isValid, setIsValid] = useState(true);
  const [dates, setDates] = useState([null, null]);

  useEffect(() => {
    setIsMounted(true);

    if (dates && dates[0] && dates[1]) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [user, dates]);

  if (!isMounted) {
    return null;
  }

  const handleChange = (dates: any, dateStrings: any) => {
    setDates(dates);
  };

  const handleClickSearch = async () => {
    try {
      if (dates[0] && dates[1]) {
        const startDate: any = dates[0];
        const endDate: any = dates[1];
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/order?customerId=${
            user ? user.id : "new"
          }&startDate=${startDate.format(
            "YYYY-MM-DD"
          )}&endDate=${endDate.format("YYYY-MM-DD")}`
        );
        const orders = response.data.data || [];

        const updatedOrders = orders.map((order: any) => {
          const createdAt = parseISO(order.createdAt);
          const now = new Date();
          const daysSinceCreated = differenceInDays(now, createdAt);
          const dynamicDeliveryDay = Math.max(
            order.deliveryDay - daysSinceCreated,
            0
          );
          return {
            ...order,
            dynamicDeliveryDay,
          };
        });

        setOrderList(updatedOrders);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
      setOrderList([]);
    }
  };

  return (
    <div className="mt-6 lg:col-span-4 lg:mt-0">
      <div className="text-2xl font-bold mb-2">{t("order.title")}</div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between border rounded-md p-2">
          <RangePicker onChange={handleChange} />
          <Button
            disabled={isValid}
            className="px-3 py-1"
            type="button"
            onClick={handleClickSearch}
          >
            {t("refund.search")}
          </Button>
        </div>
        {orderList.length > 0 &&
          orderList.map((order: any, index: any) => (
            <OrderItemPage key={index} data={order} />
          ))}
      </div>
    </div>
  );
};

export default OrderPage;
