import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ProductSpecifications({ components, t }) {
  const validComponents = components.filter(
    (component) => component.value && component.value.trim() !== "",
  );

  if (validComponents.length === 0) {
    return <></>;
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-[1.5em]">
          {t("text_specifications")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-black-primary hover:bg-black-primary">
              <TableHead className="text-white-primary text-[1em] border-t-black-primary border-l-black-primary">
                {t("text_name")}
              </TableHead>
              <TableHead className="text-white-primary text-[1em] border-t-black-primary border-r-black-primary">
                {t("text_value")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validComponents.map((component, index) => (
              <TableRow
                key={component.valueId}
                className={
                  index % 2 === 0 ? "bg-white-primary" : "bg-blue-tertiary hover:bg-blue-tertiary"
                }
              >
                <TableCell className="text-[1em] w-1/3 text-center">
                  {component.name}
                </TableCell>
                <TableCell className="text-[1em] w-2/3 text-center">
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
