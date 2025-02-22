import { Suspense } from "react";
import ProductDetailsSkeleton from "./productSkeleton";
import ProductDetailsContent from "./productDetails";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function ProductDetailsPage({ params }: PageProps) {
  // Await the params before using them
  const resolvedParams = await params;

  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailsContent id={resolvedParams.id} />
    </Suspense>
  );
}

export default ProductDetailsPage;
