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

export default function DrawerUserDetail({ isOpen, onClose }) {
  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Người dùng</DrawerTitle>
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
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              {/* Tên */}
              <div className="text-center">
                <h3 className="text-lg font-semibold">John Doe</h3>
                {/* Username */}
                <p className="text-sm text-muted-foreground">@johndoe</p>
                {/* Bio */}
                <p className="text-sm mt-2">Bio của người dùng...</p>
              </div>
            </div>
            {/* Bên phải */}
            <div className="w-1/2">
              {/* Email */}
              <div className="mb-2">
                <p className="font-medium">Email:</p>
                <p>john.doe@example.com</p>
              </div>
              {/* Số điện thoại */}
              <div className="mb-2">
                <p className="font-medium">Số điện thoại:</p>
                <p>+84 123 456 789</p>
              </div>
              {/* Ngày sinh */}
              <div className="mb-2">
                <p className="font-medium">Ngày sinh:</p>
                <p>01/01/1990</p>
              </div>
              {/* Giới tính */}
              <div className="mb-2">
                <p className="font-medium">Giới tính:</p>
                <p>Nam</p>
              </div>
              {/* Trạng thái tài khoản */}
              <div className="mb-2">
                <p className="font-medium">Trạng thái tài khoản:</p>
                <p>Hoạt động</p>
              </div>
              {/* Ngày tạo */}
              <div className="mb-2">
                <p className="font-medium">Ngày tạo:</p>
                <p>2023-07-12</p>
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
