import ListCategoryComponent from "@/components/category";

export default function CategoryPage() {
  return (
    <div className="sm:py-24 py-20 xl:px-28 lg:px-20 sm:px-6 px-4">
      <ListCategoryComponent isPage={true} />
    </div>
  );
}
