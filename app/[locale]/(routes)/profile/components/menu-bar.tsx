"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Heart, LogOut, UserSquare, ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";

import OrderPage from "./order";
import RefundPage from "./refund";
import PaginationPage from "./pagination";
import InformationPage from "./information";

const MenuBar = () => {
  const t = useTranslations("Profile");
  const locale = useLocale();
  const router = useRouter();
  const { signOut } = useClerk();

  const [isMounted, setIsMounted] = useState(false);
  const [title, setTitle] = useState(() => {
    return localStorage.getItem("menuTitle") || "info";
  });

  useEffect(() => {
    setIsMounted(true);

    localStorage.setItem("menuTitle", title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem("menuTitle", title);
  }, [locale, title]);

  if (!isMounted) {
    return null;
  }

  const SignOut = () => {
    signOut();
    if (locale === "vi") {
      router.push("/vi");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
      <div className="hidden lg:block">
        <div>
          <ul>
            <li
              key="info"
              className={cn(
                "flex gap-4 border rounded-md pl-3 py-2 hover:cursor-pointer hover:bg-gray-500 hover:text-white",
                title === "info" && "bg-black text-white"
              )}
              onClick={() => setTitle("info")}
            >
              <UserSquare size={25} /> {t("menu.info")}
            </li>
            <li
              key="order"
              className={cn(
                "flex gap-4 border rounded-md pl-3 py-2 hover:cursor-pointer hover:bg-gray-500 hover:text-white",
                title === "order" && "bg-black text-white"
              )}
              onClick={() => setTitle("order")}
            >
              <ShoppingBag size={25} />
              {t("menu.order")}
            </li>
            <li
              key="refund"
              className={cn(
                "flex gap-4 border rounded-md pl-3 py-2 hover:cursor-pointer hover:bg-gray-500 hover:text-white",
                title === "refund" && "bg-black text-white"
              )}
              onClick={() => setTitle("refund")}
            >
              <ShoppingBag size={25} /> {t("menu.refund")}
            </li>
            <li
              key="favorite"
              className={cn(
                "flex gap-4 border rounded-md pl-3 py-2 hover:cursor-pointer hover:bg-gray-500 hover:text-white",
                title === "favorite" && "bg-black text-white"
              )}
              onClick={() => setTitle("favorite")}
            >
              <Heart size={25} /> {t("menu.favorite")}
            </li>
            <li
              key="signOut"
              className={cn(
                "flex gap-4 border rounded-md pl-3 py-2 hover:cursor-pointer hover:bg-gray-500 hover:text-white"
              )}
              onClick={SignOut}
            >
              <LogOut size={25} /> {t("menu.log-out")}
            </li>
          </ul>
        </div>
      </div>
      {title === "info" && <InformationPage />}
      {title === "order" && <OrderPage />}
      {title === "refund" && <RefundPage />}
      {title === "favorite" && <PaginationPage />}
    </div>
  );
};

export default MenuBar;
