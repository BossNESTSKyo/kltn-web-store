"use client";

import axios from "axios";
import { Input } from "antd";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import getCurrentUser from "@/actions/get-current-user";

import CartItem from "./cart-item";
import StepProgressPage from "./step-progress";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Button from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderItemPageProps {
  data: any;
}

const OrderItemPage: React.FC<OrderItemPageProps> = ({ data }) => {
  const t = useTranslations("Profile");
  const user = getCurrentUser();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditPhone, setIsEditPhone] = useState(false);
  const [address, setAddress] = useState("");
  const [isEditAddress, setIsEditAddress] = useState(false);

  useEffect(() => {
    setIsEditPhone(false);
    setIsEditAddress(false);

    if (data) {
      setPhoneNumber(data.phone);
      setAddress(data.address);
    }
  }, [data]);

  const handlePencilClickPhone = () => {
    setIsEditPhone(true);
  };

  const handleChangePhone = (e: any) => {
    setPhoneNumber(e.target.value);
  };

  const handlePencilClickAddress = () => {
    setIsEditAddress(true);
  };

  const handleChangeAddress = (e: any) => {
    setAddress(e.target.value);
  };

  const onClickConfirm = async () => {
    if (phoneNumber !== "" && address !== "") {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/order/${data.id}`, {
        customerId: user ? user.id : "",
        phoneNumber,
        address,
        state: "",
      });

      toast.success("Thay đổi thông tin thành công.");

      setPhoneNumber("");
      setAddress("");
    } else {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      setPhoneNumber("");
      setAddress("");
    }
  };

  return (
    <div className="border-2 rounded-md p-3">
      <div className="flex flex-col gap-3 border-2 rounded-md p-3">
        <div className="flex justify-between">
          <div>Cart</div>
          <div>
            {t("order.total-price")}: {data.totalPrice}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <label>{t("order.user-name")}:</label>
            <Input
              value={user && user.fullName ? user.fullName : ""}
              className="w-48"
              disabled={true}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label>{t("order.phone")}:</label>
            <Input
              value={phoneNumber}
              className="w-48"
              onChange={handleChangePhone}
              disabled={!isEditPhone}
            />
            <Pencil
              size={18}
              className={cn(
                "hover:cursor-pointer hover:fill-black",
                isEditPhone && "fill-black"
              )}
              onClick={handlePencilClickPhone}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label>{t("order.address")}:</label>
            <Input
              value={address}
              className="w-48"
              onChange={handleChangeAddress}
              disabled={!isEditAddress}
            />
            <Pencil
              size={20}
              className={cn(
                "hover:cursor-pointer hover:fill-black",
                isEditAddress && "fill-black"
              )}
              onClick={handlePencilClickAddress}
            />
          </div>
        </div>
        <div>
          {t("order.create-at")}: {new Date(data.createdAt).toLocaleString()}
        </div>
        <div>
          <Button
            className="py-1 px-3 flex ml-auto text-sm"
            onClick={onClickConfirm}
          >
            {t("order.submit")}
          </Button>
        </div>
      </div>
      <div className="w-full">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <span className="text-md">{t("order.progress")}</span>
            </AccordionTrigger>
            <AccordionContent>
              <StepProgressPage data={data} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <span className="text-md">{t("order.detail")}</span>
            </AccordionTrigger>
            <AccordionContent>
              {data.orderItems.length > 2 ? (
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <ul>
                    {data.orderItems.map((item: any, itemIndex: any) => (
                      <CartItem key={itemIndex} data={item} />
                    ))}
                  </ul>
                </ScrollArea>
              ) : (
                <ul>
                  {data.orderItems.map((item: any, itemIndex: any) => (
                    <CartItem key={itemIndex} data={item} />
                  ))}
                </ul>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default OrderItemPage;
