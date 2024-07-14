"use client";

import { UserButton } from "@clerk/nextjs";
import { useLocale, useTranslations } from "next-intl";
import {
  User2,
  ShoppingBag,
  MessageCircle,
  Globe,
  UserCircle2,
  LogIn,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState, useTransition } from "react";

import { Product } from "@/types";
import useCart from "@/hooks/use-cart";
import getCurrentUser from "@/actions/get-current-user";

import Button from "@/components/ui/button";
import StoreSwitcher from "@/components/store-switcher";

interface NavbarActionsProps {
  data: Product[];
}

const NavbarActions: React.FC<NavbarActionsProps> = ({ data }) => {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const user = getCurrentUser();

  const [isOpenDrop, setIsOpenDrop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const localActive = useLocale();
  const pathName = usePathname();
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onMouseHover = () => {
    setIsOpenDrop(true);
  };

  const onMouseLeave = () => {
    setIsOpenDrop(false);
  };

  const onClickLogin = () => {
    if (locale === "vi") {
      router.push("/vi/sign-in");
    } else {
      router.push("/sign-in");
    }
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;

    if (nextLocale === "en") {
      const parts = pathName.split("/");
      const newParts = parts.map((e) => (e === "vi" ? "en" : e));

      let newPathName = newParts.join("/");

      startTransition(() => {
        router.replace(`${newPathName}`);
      });
    } else {
      startTransition(() => {
        router.replace(`/vi/${pathName}`);
      });
    }
  };

  return (
    <div className="ml-auto flex items-center gap-x-3">
      {user && user.id && (
        <Button
          onClick={() => router.push("profile")}
          className="flex items-center rounded-full bg-orange-400 px-4 py-2"
        >
          <User2 size={20} color="white" />
          <span className="ml-1 text-sm font-medium text-white">
            {t("profile")}
          </span>
        </Button>
      )}
      <Button
        onClick={() => window.open("http://localhost:3002/", "_blank")}
        className="flex items-center bg-blue-400 px-4 py-2"
      >
        <MessageCircle size={20} color="white" />
        <span className="ml-1 text-sm font-medium text-white">{t("chat")}</span>
      </Button>
      <StoreSwitcher items={data} />
      <Button
        onClick={() => router.push("/cart")}
        className="flex items-center rounded-full bg-black px-4 py-2"
      >
        <ShoppingBag size={20} color="white" />
        <span className="ml-2 text-sm font-medium text-white">
          {cart.items.length}
        </span>
      </Button>
      <div className="flex gap-1 items-center px-2">
        <Globe size={20} />
        <select
          defaultValue={localActive}
          className="bg-transparent py-2"
          onChange={onSelectChange}
        >
          <option value="en">EN</option>
          <option value="vi">VN</option>
        </select>
      </div>
      {user && user.id ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <div onMouseEnter={onMouseHover} onMouseLeave={onMouseLeave}>
          <UserCircle2
            size={35}
            color="gray"
            className="hover:cursor-pointer"
          />
          {isOpenDrop && (
            <div
              className="absolute w-20 bg-white border border-gray-200 rounded-md hover:cursor-pointer hover:bg-gray-200"
              onClick={onClickLogin}
            >
              <div className="flex gap-2 px-2 py-1 items-center">
                <p>Login</p>
                <LogIn size={20} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarActions;
