import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ProductSpecifications({components,t}) {
  const validComponents = components.filter(
    (component) => component.value && component.value.trim() !== ""
  );

  if (validComponents.length === 0) {
    return (<></>);
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="">
        <CardTitle className="text-2xl font-bold">{t("text_specifications")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="hover">
            <TableRow className="bg-black-primary bg-opacity-90">
              <TableHead className="text-white-primary font-semibold">
                {t("text_name")}
              </TableHead>
              <TableHead className="text-white-primary font-semibold">
                {t("text_value")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validComponents.map((component, index) => (
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
