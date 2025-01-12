import { Badge } from "./ui/badge";

export default function History({ userSettings }) {
  return (
    <Badge variant={"outline"} className="py-3 flex gap-2">
      <div className="bg-emerald-500 w-5 h-5 rounded-lg"></div>
      <h3>Income</h3>
    </Badge>
  );
}
