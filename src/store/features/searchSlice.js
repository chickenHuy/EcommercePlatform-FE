import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "searchSlice",
  initialState: {
    searchTerm: "",
    placeholder: "Search products...",
    showSearch: true, // Thêm thuộc tính này để quản lý hiển thị thanh tìm kiếm
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setPlaceholder: (state, action) => {
      state.placeholder = action.payload;
    },
    toggleSearchVisibility: (state, action) => {
      state.showSearch = action.payload; // Cập nhật trạng thái hiển thị
    },
  },
});

export const { setSearchTerm, setPlaceholder, toggleSearchVisibility } =
  searchSlice.actions;
export default searchSlice.reducer;
