export interface Product {
  id: string;
  category: Category;
  name: string;
  price: string;
  priceVN: string;
  isFeatured: boolean;
  isNewed: boolean;
  isDiscounted: boolean;
  perDiscount: string;
  priceDiscount: string;
  priceVNDiscount: string;
  size: any;
  color: any;
  images: Image[];
  quantity?: number;
  amount: number;
  sellAmount: number;
};

export interface Image {
  id: string;
  url: string;
}

export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
};

export interface Category {
  id: string;
  name: string;
  billboard: Billboard;
};

export interface Size {
  id: string;
  name: string;
  value: string;
};

export interface Color {
  id: string;
  name: string;
  value: string;
};
