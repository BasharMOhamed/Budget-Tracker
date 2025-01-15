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
import { useCallback, useMemo, useState } from "react";
import CountUp from "react-countup";
import { getFormatterForCurrency } from "@/lib/helpers";
import { Separator } from "./ui/separator";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import { useIsMobile } from "@/hooks/use-mobile";

const allMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function History({ userSettings }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("January");
  const historyQuery = useQuery({
    queryKey: ["yearHistory", year],
    queryFn: () =>
      fetch(`/api/History/year?year=${year}`).then((res) => res.json()),
  });

  const monthHistoryQuery = useQuery({
    queryKey: ["monthHistory", year, month],
    queryFn: () =>
      fetch(`/api/History/month?year=${year}&month=${month}`).then((res) =>
        res.json()
      ),
  });

  const formatter = useMemo(() => {
    return getFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const yearData = useMemo(() => {
    if (!historyQuery.data) return [];
    return allMonths.map((month) => {
      const result = historyQuery.data.find((m) => m.month === month);
      return result ? result : { month, income: 0, expense: 0 };
    });
  }, [historyQuery.data]);
  return (
    <div className="w-4/5 mb-1">
      <h2 className="text-3xl font-bold mb-1">History</h2>
      <Card className="p-6">
        <Tabs defaultValue="year">
          <div className="flex justify-between flex-wrap">
            <div className="flex flex-wrap gap-3">
              <TabsList>
                <TabsTrigger value="year">Year</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
              <div className="flex flex-wrap gap-2">
                <Select defaultValue={year} onValueChange={setYear}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={year}>{year}</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue={month} onValueChange={setMonth}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {allMonths.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
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
              <SkeletonWrapper isLoading={monthHistoryQuery.isFetching}>
                <CustomBarChart
                  data={monthHistoryQuery.data || []}
                  xAxisKey="day"
                  barKeys={["income", "expense"]}
                  colors={["#10b081", "#ef4444"]}
                  formatter={formatter}
                />
              </SkeletonWrapper>
            </TabsContent>
            <TabsContent value="year">
              <SkeletonWrapper isLoading={historyQuery.isFetching}>
                <CustomBarChart
                  data={yearData}
                  xAxisKey="month"
                  barKeys={["income", "expense"]}
                  colors={["#10b081", "#ef4444"]}
                  formatter={formatter}
                />
              </SkeletonWrapper>
            </TabsContent>
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
    const { income, expense } = payload[0].payload;
    console.log(payload);
    return (
      <div className="rounded-xl w-[200px] bg-background px-2 p-2">
        <h3 className="text-lg font-bold">{label}</h3>
        <TooltipRow
          bgColor="emerald"
          value={income}
          label="Income"
          formatter={formatter}
        />
        <TooltipRow
          bgColor="red"
          value={expense}
          label="Expense"
          formatter={formatter}
        />
        <Separator />
        <TooltipRow
          bgColor="violet"
          value={income - expense}
          label="Balance"
          formatter={formatter}
        />
      </div>
    );
  }
}

function TooltipRow({ bgColor, value, label, formatter }) {
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

function CustomBarChart({ data, xAxisKey, barKeys, colors, formatter }) {
  const isMobile = useIsMobile();
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barCategoryGap={5}>
        <CartesianGrid strokeDasharray="5 5" opacity={0.1} />
        <XAxis dataKey={xAxisKey} tick={isMobile ? false : { fontSize: 13 }} />
        <YAxis fontSize={10} />
        <Tooltip
          cursor={{ opacity: 0.1 }}
          content={<CustomeToolTip formatter={formatter} />}
        />
        {barKeys.map((key, index) => (
          <Bar key={key} dataKey={key} fill={colors[index]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
