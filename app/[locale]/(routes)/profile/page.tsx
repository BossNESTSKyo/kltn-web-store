"use client";

import { useEffect, useState } from "react";

import Container from "@/components/ui/container";

import MenuBar from "./components/menu-bar";

export const revalidate = 0;

const FavoritePage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 pt-16 sm:px-6 lg:px-8 pb-24">
          <MenuBar />
        </div>
      </Container>
    </div>
  );
};

export default FavoritePage;
