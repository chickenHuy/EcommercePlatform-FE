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
import { useEffect, useState } from "react";
import { getAdminById } from "@/api/admin/manageRequest";

export default function DrawerAdminDetail({ isOpen, onClose, adminId }) {
  const { toast } = useToast();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      const response = await getAdminById(adminId);
      setAdmin(response.result);
      console.log("admin: ", response.result);
    } catch (error) {
      toast({
        title: "Lấy thông tin thất bại",
        description: "Không thể lấy thông tin quản trị viên",
        variant: "destructive",
      });
    }
  };
  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Quản trị viên</DrawerTitle>
            <DrawerDescription>
              Thông tin chi tiết về quản trị viên
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
                  <AvatarImage src={admin?.imageUrl} alt="@shadcn" />
                  <AvatarFallback>{admin?.username}</AvatarFallback>
                </Avatar>
              </div>
              {/* Tên */}
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {admin?.name ? admin.name : "Chưa đặt tên"}
                </h3>
                {/* Username */}
                <p className="text-sm text-muted-foreground">
                  @{admin?.username}
                </p>
                {/* Bio */}
                <p className="text-sm mt-2">
                  {admin?.bio ? admin.bio : "trống"}
                </p>
              </div>
            </div>
            {/* Bên phải */}
            <div className="w-1/2">
              {/* Email */}
              <div className="mb-2">
                <p className="font-medium">Email:</p>
                <p>{admin?.email ? admin.email : "trống"}</p>
              </div>
              {/* Số điện thoại */}
              <div className="mb-2">
                <p className="font-medium">Số điện thoại:</p>
                <p>{admin?.phone ? admin.phone : "trống"}</p>
              </div>
              {/* Ngày sinh */}
              <div className="mb-2">
                <p className="font-medium">Ngày sinh:</p>
                <p>{admin?.dateOfBirth ? admin.dateOfBirth : "trống"}</p>
              </div>
              {/* Giới tính */}
              <div className="mb-2">
                <p className="font-medium">Giới tính:</p>
                <p>{admin?.gender ? admin.gender : "trống"}</p>
              </div>
              {/* Trạng thái tài khoản */}
              <div className="mb-2">
                <p className="font-medium">Trạng thái tài khoản:</p>
                <p>{admin?.blocked ? "Đã khoá" : "Hoạt động"}</p>
              </div>
              {/* Ngày tạo */}
              <div className="mb-2">
                <p className="font-medium">Ngày tạo:</p>
                <p>
                  {admin?.createdAt
                    ? new Date(admin.createdAt).toLocaleString()
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
