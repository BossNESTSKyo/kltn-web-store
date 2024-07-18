"use client";

import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";
import { Product } from "@/types";
import useCart from "@/hooks/use-cart";

import Rating from "@/components/ui/rating";
import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import CurrencyVN from "@/components/ui/currency-vn";

const gridArr = [
  { img: "/footer/1.webp", text: "MIỄN PHÍ vận chuyển cho đơn hàng từ 500K" },
  { img: "/footer/2.webp", text: "Giao hàng NHANH toàn quốc" },
  { img: "/footer/3.webp", text: "Miễn phí ĐỔI HÀNG trong 30 ngày" },
  { img: "/footer/4.webp", text: "Thủ tục đổi hàng DỄ DÀNG" },
  { img: "/footer/5.webp", text: "ĐA DẠNG hình thức thanh toán" },
  { img: "/footer/6.webp", text: "ĐƯỢC KIỂM TRA HÀNG trước khi thanh toán" },
];

interface InfoProductProps {
  data: any;
}

const InfoProduct: React.FC<InfoProductProps> = ({ data }) => {
  const t = useTranslations("InfoProduct");
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState("description");
  const [sizeSelect, setSizeSelect] = useState("");
  const [sizeIdSelect, setSizeIdSelect] = useState("");
  const [colorSelect, setColorSelect] = useState("");
  const [colorIdSelect, setColorIdSelect] = useState("");
  const [ratingArr, setRatingArr] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    const reviews = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/review/${data.id}`
    );

    if (reviews?.data?.data.length > 0) {
      const newRatingArr = [0, 0, 0, 0, 0];

      reviews.data.data.forEach((item: any) => {
        if (item.rating >= 1 && item.rating <= 5) {
          newRatingArr[5 - item.rating] += 1;
        }
      });

      setRatingArr(newRatingArr);
    }
  };

  const totalRatings = ratingArr.reduce((sum, count) => sum + count, 0);
  const totalPoints = ratingArr.reduce(
    (sum, count, index) => sum + count * (5 - index),
    0
  );

  const averageRating = totalRatings === 0 ? 0 : totalPoints / totalRatings;

  const handleTabClick = (name: string) => {
    setActiveTab(name);
  };

  const cart = useCart();

  const onAddToCart = () => {
    if (
      sizeSelect !== "" &&
      colorSelect !== "" &&
      sizeIdSelect !== "" &&
      colorIdSelect !== ""
    ) {
      const { colors, sizes, ...newData } = data;
      const updatedData = {
        ...newData,
        color: { name: colorSelect, id: colorIdSelect },
        size: { name: sizeSelect, id: sizeIdSelect },
      };
      cart.addItem(updatedData);
    } else {
      toast.error("Vui lòng chọn size và color cho sản phẩm.");
    }
  };

  return (
    <div>
      <Tabs defaultValue={activeTab} className="w-[450px]">
        <TabsList className="bg-gray-100 flex justify-center gap-1">
          <TabsTrigger
            value="description"
            className={cn(
              "text-xl rounded-md transition-all duration-300 py-1",
              activeTab === "description" ? "bg-white" : "bg-gray-100"
            )}
            onClick={() => handleTabClick("description")}
          >
            {t("description")}
          </TabsTrigger>
          <TabsTrigger
            value="detail"
            className={cn(
              "text-xl rounded-md transition-all duration-300 py-1",
              activeTab === "detail" ? "bg-white" : "bg-gray-100"
            )}
            onClick={() => handleTabClick("detail")}
          >
            {t("detail")}
          </TabsTrigger>
          <TabsTrigger
            value="feature"
            className={cn(
              "text-xl rounded-md transition-all duration-300 py-1",
              activeTab === "feature" ? "bg-white" : "bg-gray-100"
            )}
            onClick={() => handleTabClick("feature")}
          >
            {t("feature")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="px-3">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
            <Rating rating={averageRating} setRating={null} />
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div className="flex gap-2 text-2xl text-gray-900">
              {data.isDiscounted && (
                <div className="text-red-500">
                  {locale === "vi" ? (
                    <CurrencyVN value={data?.priceVNDiscount} />
                  ) : (
                    <Currency value={data?.priceDiscount} />
                  )}
                </div>
              )}
              <div
                className={cn(
                  "flex items-center",
                  data.isDiscounted && "text-sm line-through text-gray-400"
                )}
              >
                {locale === "vi" ? (
                  <CurrencyVN value={data?.priceVN} />
                ) : (
                  <Currency value={data?.price} />
                )}
              </div>
            </div>
            <div className="text-sm text-gray-400 italic">
              {t("sell")}: {data.sellAmount}
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center gap-x-4">
              <h3 className="font-semibold text-black">{t("size")}:</h3>
              {data?.sizes &&
                data.sizes.map((size: any, index: any) => {
                  return (
                    <Button
                      key={index}
                      className={cn(
                        "rounded-md text-sm text-gray-800 p-2 bg-white border border-gray-300",
                        sizeSelect === size.size.value && "bg-black text-white"
                      )}
                      onClick={() => {
                        setSizeSelect(size.size.value);
                        setSizeIdSelect(size.size.id);
                      }}
                    >
                      {size.size.value}
                    </Button>
                  );
                })}
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-x-4">
                <h3 className="font-semibold text-black">{t("color")}:</h3>
                {data?.colors &&
                  data.colors.map((color: any, index: number) => {
                    return (
                      <div key={index} className="flex items-center">
                        <div
                          className={cn(
                            "h-6 w-6 rounded-full hover:cursor-pointer",
                            colorSelect === color.color.name
                              ? "border-red-600  border-2"
                              : "border-black border"
                          )}
                          style={{ backgroundColor: color?.color?.value }}
                          onClick={() => {
                            setColorSelect(color.color.name);
                            setColorIdSelect(color.color.id);
                          }}
                        />
                      </div>
                    );
                  })}
              </div>
              <div className="flex items-center gap-x-3">
                <Button
                  onClick={onAddToCart}
                  className="flex items-center gap-x-2"
                >
                  {t("add-to-card")}
                  <ShoppingCart size={20} />
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {gridArr.map((item) => {
              return (
                <div className="flex items-center gap-4" key={item.text}>
                  <div className="relative rounded-md overflow-hidden sm:h-12 sm:w-14 bg-gray-300">
                    <Image
                      fill
                      src={item.img}
                      alt=""
                      className="object-cover object-center"
                    />
                  </div>
                  <p className="text-sm w-28">{item.text}</p>
                </div>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="detail" className="px-3">
          <div className="px-1 text-justify text-lg">
            Tăng chút cuộc chơi và lên rổ hệt như Trae Young. Đôi giày signature
            đến từ adidas Basketball này có thiết kế tương xứng với lối chơi
            bóng rổ siêu tốc vốn là thương hiệu của Trae, cùng đế giữa
            Lightstrike siêu nhẹ để bạn có thể nhẹ lướt trên sân. Thân giày bằng
            vải dệt tạo điểm nhấn bắt mắt, bởi phong cách cũng chính là một
            trong những yếu tố khiến Trae nổi bật.
          </div>
        </TabsContent>
        <TabsContent value="feature" className="px-3">
          <div className="px-1 text-lg">
            <ul className="list-disc ml-6">
              <li>
                Thoải mái: Giày được thiết kế để mang lại cảm giác thoải mái cho
                người mang, với chất liệu mềm mại và đệm êm ái.
              </li>
              <li>
                Độ bền: Giày được làm từ các chất liệu chất lượng cao và có cấu
                trúc chắc chắn, giúp chúng bền bỉ và chịu được sự mài mòn của
                thời gian.
              </li>
              <li>
                Trọng lượng: Giày được thiết kế nhẹ nhàng để giảm bớt sự căng
                thẳng khi hoạt động và di chuyển.
              </li>
              <li>
                Độ bám dính: Giày có đế được thiết kế để cung cấp độ bám dính
                tốt trên mọi loại bề mặt, giúp người mang di chuyển an toàn.
              </li>
              <li>
                Thấm hút và thông thoáng: Giày có khả năng thấm hút mồ hôi và
                tạo cảm giác thoáng mát cho chân.
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InfoProduct;
