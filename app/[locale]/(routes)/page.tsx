import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";

import ProductList from "@/components/product-list";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";
import UserPage from "@/components/user";

export const revalidate = 0;

const HomePage = async () => {
  const billboard = await getBillboard("73408105-7e1e-49bf-910b-ea4574e4a176");
  const featureProducts = await getProducts({ isFeatured: true });
  const newProducts = await getProducts({ isNewed: true });
  const discountProducts = await getProducts({ isDiscounted: true });

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <UserPage />
        <Billboard data={billboard} />
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="new-products" items={newProducts} />
        </div>
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="featured-products" items={featureProducts} />
        </div>
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="discount-products" items={discountProducts} />
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
