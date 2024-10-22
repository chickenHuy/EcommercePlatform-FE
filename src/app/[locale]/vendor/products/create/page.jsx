"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicProduct from "./basic";
import { Plus } from "lucide-react";

export default function CreateComplexProduct() {
  return (
    <form className="p-6 space-y-8 relative">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Tạo sản phẩm mới</CardTitle>
          <Button className="flex items-center space-x-2" type="submit">
            <Plus className="w-4 h-4"></Plus>
            <span>Tạo sản phẩm</span>
          </Button>
        </CardHeader>
        <CardContent className="flex">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList>
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="variants">Biến thể</TabsTrigger>
              <TabsTrigger value="specifications">
                Thông số kỹ thuật
              </TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4">
              <BasicProduct></BasicProduct>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </form>
  );
}
