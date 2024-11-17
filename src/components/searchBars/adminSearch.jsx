import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  setPlaceholder,
  setSearchTerm,
  toggleSearchVisibility,
} from "@/store/features/searchSlice";
import { usePathname } from "next/navigation";
export const AdminSearch = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.searchReducer.searchTerm);
  const placeholder = useSelector((state) => state.searchReducer.placeholder);
  const showSearch = useSelector((state) => state.searchReducer.showSearch);
  const pathName = usePathname();

  useEffect(() => {
    // Reset search term on mount and path change
    dispatch(setSearchTerm(""));

    // Show or hide search based on path
    dispatch(toggleSearchVisibility(true));
    if (pathName.includes("/admin/categories")) {
      dispatch(setPlaceholder("Tìm kiếm danh mục..."));
    } else if (pathName.includes("/admin/customers")) {
      dispatch(setPlaceholder("Tìm kiếm khách hàng..."));
    } else if (pathName.includes("/admin/stores")) {
      dispatch(setPlaceholder("Tìm kiếm cửa hàng..."));
    } else if (pathName.includes("/admin/manages")) {
      dispatch(setPlaceholder("Tìm kiếm qtv..."));
    } else if (pathName.includes("/admin/brands")) {
      dispatch(setPlaceholder("Tìm kiếm thương hiệu..."));
    } else if (pathName.includes("/admin/components")) {
      dispatch(setPlaceholder("Tìm kiếm thông số..."));
    } else if (pathName.includes("/admin/orders")) {
      dispatch(setPlaceholder("Tìm kiếm đơn hàng..."));
    } else {
      dispatch(toggleSearchVisibility(false));
    }
  }, [pathName, dispatch]);

  return (
    <form className="ml-auto flex-1 sm:flex-initial">
      <div className="relative">
        {showSearch && (
          <>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => {
                dispatch(setSearchTerm(e.target.value));
              }}
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </>
        )}
      </div>
    </form>
  );
};
