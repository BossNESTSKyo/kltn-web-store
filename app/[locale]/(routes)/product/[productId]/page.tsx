import Gallery from "@/components/gallery";
import Container from "@/components/ui/container";
import ReviewForm from "./components/review-form";
import InfoProduct from "@/components/info-product";
import ProductList from "@/components/product-list";

import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";

export const revalidate = 0;

interface ProductPageProps {
  params: {
    productId: string;
  };
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const product = await getProduct(params.productId);
  const suggestedProducts = await getProducts({
    categoryId: product?.category?.id,
  });

  if (!product) {
    return null;
  }

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Gallery images={product.images} page="product" />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <InfoProduct data={product} />
            </div>
          </div>
          <hr className="my-10" />
          <div>
            <ReviewForm data={product} />
          </div>
          <hr className="my-10" />
          <ProductList title="related-products" items={suggestedProducts} />
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
