import ProductCard from "@/components/card/productCard";
import clsx from "clsx";

export default function ListProductSuggess({ listProduct, loadRef, hasNext, loadPage, maxCol = 6 }) {

    const gridCols = clsx("grid-cols-2", {
        "sm:grid-cols-2": maxCol === 4,
        "sm:grid-cols-3": maxCol >= 6,

        "lg:grid-cols-2": maxCol === 4,
        "lg:grid-cols-4": maxCol >= 6,

        "xl:grid-cols-4": maxCol === 4,
        "xl:grid-cols-6": maxCol >= 6,
    });

    const SkeletonItem = () => (
        <div className="skeleton-item w-full aspect-square">
            <div className="skeleton-line w-full aspect-square" />
            <div className="skeleton-line w-full h-[30px]" />
        </div>
    );

    return (
        <>
            <div className={`w-full grid gap-3 grid-cols-2 ${gridCols}`}>
                {listProduct.map((product) => (
                    <ProductCard
                        name={product.name}
                        price={product.salePrice}
                        originalPrice={product.originalPrice}
                        mainImageUrl={product.mainImageUrl}
                        videoUrl={product.videoUrl}
                        sold={product.sold}
                        percentDiscount={product.percentDiscount}
                        rating={product.rating}
                        showRating={false}
                        isFavorite={false}
                        link={product.slug}
                    />
                ))}
            </div>

            {hasNext && <div ref={loadRef} className="w-full h-24"></div>}

            {loadPage && (
                <div className={`w-full grid gap-3 grid-cols-2 ${gridCols}`}>
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                </div>
            )}
        </ >
    )
}