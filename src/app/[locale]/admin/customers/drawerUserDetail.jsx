import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { use, useEffect, useState } from "react";
import { getUserById } from "@/api/admin/customerRequest";

export default function DrawerCustomerDetail({ isOpen, onClose, userId }) {
  const { toast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const response = await getUserById(userId);
      setUser(response.result);
      console.log("user: ", response.result);
    } catch (error) {
      toast({
        title: "Lấy thông tin thất bại",
        description: "Không thể lấy thông tin khách hàng",
        variant: "destructive",
      });
    }
  };
  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Khách hàng</DrawerTitle>
            <DrawerDescription>
              Thông tin chi tiết về khách hàng
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex gap-10">
            {" "}
            {/* Sử dụng Flex để chia bố cục */}
            {/* Bên trái */}
            <div className="w-1/3">
              <div className="mb-4">
                {/* Avatar */}
                <Avatar className="w-32 h-32 rounded-full mx-auto">
                  <AvatarImage src={user?.imageUrl} alt="@shadcn" />
                  <AvatarFallback>{user?.username}</AvatarFallback>
                </Avatar>
              </div>
              {/* Tên */}
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {user?.name ? user.name : "Chưa có tên"}
                </h3>
                {/* Username */}
                <p className="text-sm text-muted-foreground">
                  @{user?.username}
                </p>
                {/* Bio */}
                <p className="text-sm mt-2">{user?.bio ? user.bio : "trống"}</p>
              </div>
            </div>
            {/* Bên phải */}
            <div className="w-1/2">
              {/* Email */}
              <div className="mb-2">
                <p className="font-medium">Email:</p>
                <p>{user?.email ? user.email : "trống"}</p>
              </div>
              {/* Số điện thoại */}
              <div className="mb-2">
                <p className="font-medium">Số điện thoại:</p>
                <p>{user?.phone ? user.phone : "trống"}</p>
              </div>
              {/* Ngày sinh */}
              <div className="mb-2">
                <p className="font-medium">Ngày sinh:</p>
                <p>{user?.dateOfBirth ? user.dateOfBirth : "trống"}</p>
              </div>
              {/* Giới tính */}
              <div className="mb-2">
                <p className="font-medium">Giới tính:</p>
                <p>{user?.gender ? user.gender : "trống"}</p>
              </div>
              {/* Trạng thái tài khoản */}
              <div className="mb-2">
                <p className="font-medium">Trạng thái tài khoản:</p>
                <p>{user?.blocked ? "Đã khoá" : "Hoạt động"}</p>
              </div>
              {/* Ngày tạo */}
              <div className="mb-2">
                <p className="font-medium">Ngày tạo:</p>
                <p>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : ""}
                </p>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Thoát</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
