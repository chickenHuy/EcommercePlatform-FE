"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import axios from "@/configs/axiosConfig";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  required: z.boolean(),
});

export default function DialogEditComponent(props) {
  const { edit, content, description, nameButton } = props;

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      required: false,
    },
  });

  const handleSubmit = (data) => {
    editComponent(data)
      .then(() => {
        console.log("Success ");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  async function editComponent(data) {
    const config = {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6ODA4MCIsInN1YiI6IkFETUlOIiwiZXhwIjoxNzI4MzgxNTMxLCJpYXQiOjE3MjgzNzc5MzEsImp0aSI6IjIyM2QxOGZiLWMxYmMtNGNmZi1hY2NlLWI4MjhkNjk5ZTAzNSIsInNjb3BlIjoiUk9MRV9BRE1JTiJ9.BvFIRbaNV8TtlmlqiqG8JNrqdetdvoaTURhDRyEQkfq0bcXzi8zTBIHkIbrY0cOJfAC4Q5WosIlcMmsxYfFqAw`,
      },
    };

    try {
      if (edit) {
        await axios.put(`/api/v1/components/${props.id}`, data, config);
      } else {
        //await axios.post("/api/v1/components", data, config);
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {edit ? (
          <span className="block w-full">{props.name}</span>
        ) : (
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              {nameButton}
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{content}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tên TP
            </Label>
            <Input
              placeholder="tên thành phần"
              className="col-span-3"
              {...form.register("name")}
            />
          </div>
          {form.formState.errors.name && (
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-sm text-error col-start-2 col-span-3">
                {form.formState.errors.name.message}
              </p>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4 flex items-center justify-center space-x-2">
              <Checkbox
                id="required"
                checked={form.watch("required")}
                onCheckedChange={(checked) =>
                  form.setValue("required", checked)
                }
              />
              <label
                htmlFor="isMandatory"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Bắt buộc người bán nhập mục này
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{nameButton}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
