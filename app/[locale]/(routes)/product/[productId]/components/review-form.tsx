"use client";

import axios from "axios";
import { Progress } from "antd";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { MouseEventHandler, useEffect, useState } from "react";

import ReviewDisplay from "./review-display";

import Rating from "@/components/ui/rating";
import Button from "@/components/ui/button";
import { Textarea } from "@/components/ui/text-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

import getCurrentUser from "@/actions/get-current-user";

interface ReviewFormProps {
  data: any;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ data }) => {
  const t = useTranslations("InfoProduct");

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviewArr, setReviewArr] = useState([]);
  const [ratingArr, setRatingArr] = useState([0, 0, 0, 0, 0]);

  const user = getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      const reviews = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/review/${data.id}`
      );

      setReviewArr(reviews.data.data);

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

    fetchData();
  }, [data.id]);

  const totalRatings = ratingArr.reduce((sum, count) => sum + count, 0);
  const getPercentage = (count: any) =>
    totalRatings === 0 ? 0 : Number(((count / totalRatings) * 100).toFixed(1));

  const totalPoints = ratingArr.reduce(
    (sum, count, index) => sum + count * (5 - index),
    0
  );
  const averageRating = totalRatings === 0 ? 0 : totalPoints / totalRatings;

  const onClickSubmit: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation();

    if (user !== "") {
      if (rating !== 0 && review !== "") {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/review`, {
          customer: user,
          productId: data.id,
          rating,
          content: review,
        });

        setRating(0);
        setReview("");

        toast.success("Đánh giá sản phẩm thành công.");
      } else {
        toast.error("Vui lòng nhập đầy đủ thông tin");
      }
    } else {
      toast.error("Vui lòng đăng nhập để thực hiện tính năng này.");
    }
  };

  return (
    <div className="flex justify-between gap-8">
      <div className="mt-3">
        <span className="text-lg font-bold">{t("customer-review")}</span>
        <div className="flex gap-8 mt-4">
          <div className="flex flex-col gap-2 items-center">
            <div className="h-16 w-16 rounded-md bg-orange-400 flex items-center justify-center">
              <p className="text-white text-2xl font-bold">
                {averageRating.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col text-center text-sm">
              <div>{t("base-on")}</div>
              <div className="font-bold">{totalRatings} reviews</div>
            </div>
          </div>
          <div className="w-[300px]">
            {ratingArr.length > 0 &&
              ratingArr.map((count, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center mb-2 gap-2 text-sm"
                  >
                    <span className="w-6 text-right">{5 - index}</span>
                    <Star size={22} fill="gold" color="gold" />
                    <div className="flex-grow mr-2">
                      <Progress percent={getPercentage(count)} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="w-full">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <span className="text-lg">{t("create-review")}</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                <div>
                  <Rating rating={rating} setRating={setRating}></Rating>;
                </div>
                <div>
                  <Textarea
                    className="h-40"
                    value={review}
                    onChange={(e) => {
                      setReview(e.target.value);
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <Button className="py-1 px-3" onClick={onClickSubmit}>
                    {t("send")}
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <span className="text-lg">{t("other-review")}</span>
            </AccordionTrigger>
            <AccordionContent>
              {reviewArr.length > 2 ? (
                <ScrollArea className="h-[500px] rounded-md border p-4">
                  {reviewArr.map((item: any, index) => {
                    return (
                      <div key={index}>
                        <ReviewDisplay data={item} />;
                      </div>
                    );
                  })}
                </ScrollArea>
              ) : (
                <div>
                  {reviewArr.map((item: any, index) => {
                    return (
                      <div key={index}>
                        <ReviewDisplay data={item} />
                      </div>
                    );
                  })}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ReviewForm;
