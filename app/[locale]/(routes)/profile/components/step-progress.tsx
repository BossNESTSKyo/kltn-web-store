"use client";

import axios from "axios";
import { Steps } from "antd";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import getCurrentUser from "@/actions/get-current-user";

import Button from "@/components/ui/button";

interface StepProgressProps {
  data: any;
}

const StepProgressPage: React.FC<StepProgressProps> = ({ data }) => {
  const user = getCurrentUser();
  const t = useTranslations("Profile");

  const [stateProgress, setStateProgress] = useState("");

  useEffect(() => {
    setStateProgress(data.state);
  }, [data]);

  const onClickSubmit = async () => {
    if (stateProgress !== "cancel") {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/order/${data.id}`, {
        customerId: user ? user.id : "",
        phoneNumber: "",
        address: "",
        state: "recieve",
      });

      setStateProgress("complete");

      toast.success("Xác nhận nhận hàng thành công.");
    } else {
      toast.error(
        "Có lỗi xảy ra khi xác nhận nhận hàng. \nVui lòng liên hệ admin để được hỗ trợ."
      );
    }
  };

  const onClickCanel = async () => {
    if (data.dynamicDeliveryDay < 3) {
      toast.error(
        "Chỉ có thể hủy đơn khi thời gian giao hàng dự kiến lớn hơn 3 ngày."
      );
    } else {
      if (stateProgress !== "cancel") {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/order/${data.id}`,
          {
            customerId: user ? user.id : "",
            phoneNumber: "",
            address: "",
            state: "cancel",
          }
        );

        setStateProgress("cancel");

        toast.success(
          "Hủy đơn hàng thành công. \nVui lòng liên hệ admin để được hỗ trợ."
        );
      } else {
        toast.error(
          "Đơn hàng đã được hủy. \nVui lòng liên hệ admin để được hỗ trợ."
        );
      }
    }
  };

  return (
    <div>
      <Steps
        size="small"
        current={
          stateProgress === "cancel"
            ? 3
            : stateProgress === "complete"
            ? 5
            : stateProgress === "payment"
            ? 2
            : stateProgress === "delivery"
            ? 3
            : stateProgress === "recieve"
            ? 4
            : 1
        }
        status={stateProgress === "cancel" ? "error" : undefined}
        items={[
          {
            title: "Order",
          },
          {
            title: "Payment",
          },
          {
            title: "Delivery",
            description: `Dự kiến: ${data.dynamicDeliveryDay} ngày`,
          },
          {
            title: "Receive",
          },
          {
            title: "Complete",
          },
        ]}
      />
      <div className="flex gap-2 justify-end">
        <div>
          <Button
            className="py-1 px-3 bg-blue-500"
            disabled={stateProgress !== "recieve"}
            onClick={onClickSubmit}
          >
            {t("order.submit")}
          </Button>
        </div>
        <div>
          <Button
            className="py-1 px-3 bg-red-500"
            disabled={stateProgress !== "delivery"}
            onClick={onClickCanel}
          >
            {t("order.cancel")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepProgressPage;
