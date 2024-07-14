"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

interface CurrencyVNProps {
  value?: string | number;
}

const CurrencyVN: React.FC<CurrencyVNProps> = ({ value = 0 }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <div className="font-semibold">{formatter.format(Number(value))}</div>;
};

export default CurrencyVN;
