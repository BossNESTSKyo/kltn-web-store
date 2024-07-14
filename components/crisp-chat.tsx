"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("6b0df1c1-fd37-447c-9df2-2b4cee2170d3");
  }, []);

  return null;
};
