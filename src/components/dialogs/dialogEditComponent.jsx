"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { changeName, changeRequired } from "@/store/features/componentSlice";
export default function DialogEditComponent(props) {
  const { edit, name, content, description } = props;
  const componentData = useSelector((state) => state.componentReducer);

  const handleChange = (e) => {
    // Kiểm tra xem e có phải là đối tượng sự kiện không
    if (!e.target) return;

    const { id, value, type, checked } = e.target;

    if (id === "name") {
      dispatch(changeName(value));
    } else if (id === "required") {
      dispatch(changeRequired(checked));
    }
  };


  const dispatch = useDispatch();

  const handleSubmit = () => {
    const data = {
      name: componentData.name,
      required: componentData.required,
    };

    editComponent(data)
      .then(() => {
        console.log("Success ");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  async function editComponent(data) {
    try {
      // const response = await axios.post("/api/v1/components", data);
      // console.log(response);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        {edit ? (
          <span className="block w-full">{props.name}</span>
        ) : (
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              {name}
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{content}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tên TP
            </Label>
            <Input
              placeholder="tên thành phần"
              className="col-span-3"
              id="name"
              value={componentData.name}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4 flex items-center justify-center space-x-2">
              <Checkbox
                id="required"
                checked={componentData.required}
                onCheckedChange={(checked) => dispatch(changeRequired(checked))}
              />
              <label
                htmlFor="isMandatory"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Bắt buộc người bán nhập mục này
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            {props.nameButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
