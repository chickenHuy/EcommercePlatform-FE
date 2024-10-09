"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import axios from "@/configs/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { changeName, changeDescription } from "@/store/features/brandSlice";
import { useEffect, useState } from "react";

export default function DialogAddEditBrand(props) {
  const { title, edit, brand} = props;
  const brandData = useSelector((state) => state.brandReducer);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (brand) {
      dispatch(changeName(brand.name));
      dispatch(changeDescription(brand.description));
    }
  }, [brand, dispatch]);

  const handleSubmit = () => {
    const data = {
      name: brandData.name,
      description: brandData.description,
    };

    editBrand(data)
      .then(() => {
        console.log("Success");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  async function editBrand(data) {
    const config = {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6ODA4MCIsInN1YiI6IkFETUlOIiwiZXhwIjoxNzI4NDQzOTMzLCJpYXQiOjE3Mjg0NDAzMzMsImp0aSI6ImJjNGI5YjdmLTkyY2UtNDg1OS05NDA1LTMyYTQxNWU1OWJiNyIsInNjb3BlIjoiUk9MRV9BRE1JTiJ9.evsiNK6QliUgEOxrCJlJ-XMYoCdXD3HZWgLwdeDCV-dYVTCqZHT4csJJE7BDz40N5LpZUzTjwLGYSaJaW44Xrw`,
      },
    };
    try {
      if (edit) {
        const response = await axios.put(
          `/api/v1/brands/${props.id}`,
          data,
          config
        );
        return;
      }

      const response = await axios.post("/api/v1/brands", data, config);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {edit ? (
          <span className="block w-full">Sửa</span>
        ) : (
          <Button size="sm" variant="outline" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              {title}
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm font-medium">
            {props.content}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 m-1">
            <Label
              htmlFor="name"
              className="text-left font-bold whitespace-nowrap overflow-hidden text-ellipsis"
            >
              Tên
            </Label>
            <Input
              id="name"
              value={brandData.name}
              onChange={(e) => dispatch(changeName(e.target.value))}
              placeholder="Nhập tên thương hiệu"
              className="text-xs font-bold col-span-3 focus:visible"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 m-1">
            <Label
              htmlFor="description"
              className="text-left font-bold whitespace-nowrap overflow-hidden text-ellipsis"
            >
              Mô tả
            </Label>
            <Input
              id="description"
              value={brandData.description}
              onChange={(e) => dispatch(changeDescription(e.target.value))}
              placeholder="Nhập mô tả thương hiệu"
              className="text-xs font-bold col-span-3 focus:visible"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="text-sm font-bold"
            onClick={handleSubmit}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
