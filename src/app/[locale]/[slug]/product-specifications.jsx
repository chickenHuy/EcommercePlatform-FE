import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";


export function ProductSpecifications({
  components,
}) {
  if (components.length === 0) {
    return <p>Không có thông số kỹ thuật.</p>;
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="">
        <CardTitle className="text-2xl font-bold">THÔNG SỐ KỸ THUẬT</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="hover">
            <TableRow className="bg-black-primary bg-opacity-90">
              <TableHead className="text-white-primary font-semibold">
                Tên
              </TableHead>
              <TableHead className="text-white-primary font-semibold">
                Giá trị
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {components.map((component, index) => (
              <TableRow
                key={component.valueId}
                className={
                  index % 2 === 0
                    ? "bg-white-primary"
                    : "bg-blue-primary bg-opacity-50"
                }
              >
                <TableCell className="font-medium text-black-primary w-1/3 text-center">
                  {component.name}
                </TableCell>
                <TableCell className="text-black-primary text-center">
                  {component.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
