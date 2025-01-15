import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "./ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { useCallback, useMemo } from "react";
import CountUp from "react-countup";
import { getFormatterForCurrency } from "@/lib/helpers";

const data = [
  {
    name: "Jan",
    Income: 4000,
    Expense: 2400,
  },
  {
    name: "Feb",
    Income: 3000,
    Expense: 1398,
  },
  {
    name: "Mar",
    Income: 2000,
    Expense: 9800,
  },
  {
    name: "Apr",
    Income: 2780,
    Expense: 3908,
  },
  {
    name: "May",
    Income: 1890,
    Expense: 4800,
  },
  {
    name: "Jun",
    Income: 2390,
    Expense: 3800,
  },
  {
    name: "Jul",
    Income: 3490,
    Expense: 4300,
  },
  {
    name: "Aug",
    Income: 2000,
    Expense: 9800,
  },
  {
    name: "Sep",
    Income: 2780,
    Expense: 3908,
  },
  {
    name: "Oct",
    Income: 1890,
    Expense: 4800,
  },
  {
    name: "Nov",
    Income: 2390,
    Expense: 3800,
  },
  {
    name: "Dec",
    Income: 3490,
    Expense: 4300,
  },
];

export default function History({ userSettings }) {
  const formatter = useMemo(() => {
    return getFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);
  return (
    <div className="w-4/5">
      <h2 className="text-3xl font-bold mb-1">History</h2>
      <Card className="p-6">
        <Tabs defaultValue="month">
          <div className="flex justify-between flex-wrap">
            <div className="flex flex-wrap gap-3">
              <TabsList>
                <TabsTrigger value="year">Year</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
              <div className="flex flex-wrap gap-2">
                <Select defaultValue="2025">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="Jan">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jan">January</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <BadgeComponent title={"Income"} color={"emerald"} />
              <BadgeComponent title={"Expense"} color={"red"} />
            </div>
          </div>
          <Card className="mt-4">
            <TabsContent value="month">
              <ResponsiveContainer width={"100%"} height={300}>
                <BarChart height={300} data={data} barCategoryGap={5}>
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    cursor={{ opacity: 0.1 }}
                    content={<CustomeToolTip formatter={formatter} />}
                  />
                  <Bar dataKey="Income" fill="#10b081" />
                  <Bar dataKey="Expense" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="year">This is the Year History.</TabsContent>
          </Card>
        </Tabs>
      </Card>
    </div>
  );
}

function BadgeComponent({ title, color }) {
  return (
    <Badge variant={"outline"} className="py-3 flex gap-2">
      <div className={`bg-${color}-500 w-4 h-4 rounded-full`}></div>
      <h3>{title}</h3>
    </Badge>
  );
}

function CustomeToolTip({ active, payload, label, formatter }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl w-[200px] bg-background px-2">
        <TooltipRow
          bgColor="emerald"
          textColor=""
          value={500}
          label="Income"
          formatter={formatter}
        />
        <TooltipRow
          bgColor="red"
          textColor=""
          value={200}
          label="Expense"
          formatter={formatter}
        />
        <TooltipRow
          bgColor="violet"
          textColor=""
          value={500 - 200}
          label="Balance"
          formatter={formatter}
        />
      </div>
    );
  }
}

function TooltipRow({ bgColor, textColor, value, label, formatter }) {
  const formatFn = useCallback(
    (value) => {
      return formatter.format(value);
    },
    [formatter]
  );
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-full bg-${bgColor}-500`}></div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <CountUp
        preserveValue
        duration={0.8}
        end={value}
        decimals={0}
        formattingFn={formatFn}
        className={`text-xs text-${bgColor}-500`}
      />
    </div>
  );
}
