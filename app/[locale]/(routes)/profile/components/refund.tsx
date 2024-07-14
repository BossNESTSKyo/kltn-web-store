"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import TextArea from "antd/es/input/TextArea";
import { Input, Select, DatePicker } from "antd";
import { zodResolver } from "@hookform/resolvers/zod";

import getCurrentUser from "@/actions/get-current-user";

import Button from "@/components/ui/button";
import ImageUpload from "@/components/ui/image-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const formSchema = z.object({
  orderId: z.string().min(1),
  userId: z.string().min(1),
  productId: z.string().min(1),
  quantity: z.coerce.number().min(1),
  status: z.string().min(1),
  method: z.string().min(1),
  note: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
});

type ProductFormValues = z.infer<typeof formSchema>;

const RefundPage = () => {
  const t = useTranslations("Profile");
  const { RangePicker } = DatePicker;

  const user = getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([null, null]);
  const [listOrders, setListOrders] = useState<any>([]);
  const [selectOrder, setSelectOrder] = useState("");
  const [listProducts, setListProducts] = useState<any>([]);
  const [listRefunds, setListRefunds] = useState<any>([]);
  const [isValid, setIsValid] = useState(true);
  const [isAccept, setIsAccept] = useState("true");

  const defaultValues = {
    orderId: "",
    userId: user && user.id,
    productId: "",
    quantity: 1,
    status: "",
    method: "",
    note: "",
    images: [],
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    fetchRefunds();

    if (dates && dates[0] && dates[1]) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }

    if (listOrders && listOrders.length > 0) {
      const order = listOrders.find((order: any) => order.id === selectOrder);
      setListProducts(order.orderItems);
    }
  }, [selectOrder, dates, isAccept]);

  const fetchRefunds = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/refund?customerId=${
        user ? user.id : "new"
      }&isAccept=${isAccept}`
    );

    const refunds = response ? response.data.data : [];
    setListRefunds(refunds);
  };

  const handleChange = (dates: any, dateStrings: any) => {
    setDates(dates);
  };

  const handleChangeSelect = (value: any) => {
    setIsAccept(value);
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
        setListOrders(orders);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
      setListOrders([]);
    }
  };

  const onSubmit: any = async (data: ProductFormValues) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/refund`, data);

      toast.success("Yêu cầu hoàn trả đơn hàng thành công.");
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 lg:col-span-4 lg:mt-0">
      <div className="text-2xl font-bold mb-2">{t("refund.title")}</div>
      <div className="flex flex-col gap-3 border-2 rounded-md p-3">
        <div className="flex justify-end">
          <Select
            defaultValue="true"
            style={{
              width: 120,
            }}
            onChange={handleChangeSelect}
            options={[
              {
                value: "true",
                label: t("refund.accept"),
              },
              {
                value: "false",
                label: t("refund.reject"),
              },
            ]}
          />
        </div>
        <div className="flex flex-col gap-2">
          {listRefunds &&
            listRefunds.length > 0 &&
            listRefunds.map((refund: any, index: any) => {
              return (
                <div className="flex flex-col gap-3 border-2 rounded-md p-3">
                  <div className="flex justify-between">
                    <div>Order - {refund.order?.totalPrice}</div>
                    <div>
                      {refund.accept === true ? (
                        <div className="flex gap-2 items-center">
                          <div>{t("refund.accept")}</div>
                          <Check size={20} color="green" />
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <div>{t("refund.reject")}</div>
                          <Check size={20} color="red" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="flex gap-2 items-center">
                      <label>{t("refund.product")}:</label>
                      <Input
                        value={refund.product?.name}
                        className="w-48"
                        onChange={() => {}}
                        disabled={true}
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <label>{t("refund.reason")}:</label>
                      <Input
                        value={refund.reason}
                        className="w-72"
                        onChange={() => {}}
                        disabled={true}
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <label>{t("refund.create-at")}:</label>
                      <Input
                        value={new Date(refund.createdAt).toLocaleString()}
                        className="w-40"
                        onChange={() => {}}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="w-full">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <span className="text-md">Form</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="rounded-md border p-4">
                  <div className="flex justify-between border rounded-md p-2 mb-4">
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
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4 w-full"
                    >
                      <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField
                          control={form.control}
                          name="orderId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("refund.order")}</FormLabel>
                              <Select
                                className="w-64"
                                placeholder="Select a order"
                                defaultValue={field.value}
                                value={field.value}
                                optionFilterProp="label"
                                onChange={(value) => {
                                  field.onChange(value);
                                  setSelectOrder(value);
                                }}
                                options={
                                  listOrders &&
                                  listOrders.length > 0 &&
                                  listOrders.map((order: any) => ({
                                    value: order.id,
                                    label: `Cart - ${order.totalPrice}`,
                                  }))
                                }
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="productId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("refund.product")}</FormLabel>
                              <Select
                                className="w-64"
                                placeholder="Select a product"
                                defaultValue={field.value}
                                value={field.value}
                                optionFilterProp="label"
                                onChange={field.onChange}
                                options={
                                  listProducts &&
                                  listProducts.length > 0 &&
                                  listProducts.map((item: any) => ({
                                    value: item.product && item.product.id,
                                    label: item.product && item.product.name,
                                  }))
                                }
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("refund.quantity")}</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  disabled={loading}
                                  placeholder="1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("refund.status")}</FormLabel>
                              <Select
                                className="w-64"
                                placeholder="Select a status"
                                defaultValue={field.value}
                                value={field.value}
                                optionFilterProp="label"
                                onChange={field.onChange}
                                options={[
                                  {
                                    value: "broken",
                                    label: t("refund.broken"),
                                  },
                                  {
                                    value: "error",
                                    label: t("refund.error"),
                                  },
                                  {
                                    value: "not_as_described",
                                    label: t("refund.not-as-described"),
                                  },
                                ]}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="method"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("refund.method")}</FormLabel>
                              <Select
                                className="w-64"
                                placeholder="Select a method"
                                defaultValue={field.value}
                                value={field.value}
                                optionFilterProp="label"
                                onChange={field.onChange}
                                options={[
                                  {
                                    value: "exchange_new_product",
                                    label: t("refund.exchange-new-product"),
                                  },
                                  {
                                    value: "exchange_other_product",
                                    label: t("refund.exchange-other-product"),
                                  },
                                  {
                                    value: "refund_to_account",
                                    label: t("refund.refund-to-account"),
                                  },
                                  {
                                    value: "product_warranty",
                                    label: t("refund.product-warranty"),
                                  },
                                ]}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:grid md:grid-cols-1 gap-8">
                        <FormField
                          control={form.control}
                          name="note"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("refund.note")}</FormLabel>
                              <FormControl>
                                <TextArea
                                  placeholder={t("refund.enter-note")}
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:grid md:grid-cols-1 gap-8">
                        <FormField
                          control={form.control}
                          name="images"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("refund.images")}</FormLabel>
                              <FormControl>
                                <ImageUpload
                                  value={field.value.map((image) => image.url)}
                                  disabled={loading}
                                  onChange={(url) =>
                                    field.onChange([...field.value, { url }])
                                  }
                                  onRemove={(url) =>
                                    field.onChange([
                                      ...field.value.filter(
                                        (current) => current.url !== url
                                      ),
                                    ])
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          disabled={loading}
                          className="px-3 py-1"
                          type="submit"
                        >
                          {t("refund.send")}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default RefundPage;
