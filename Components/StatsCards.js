import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useCallback, useEffect, useMemo } from "react";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import CountUp from "react-countup";
import { getFormatterForCurrency } from "@/lib/helpers";

export default function StatsCards({ to, from, userSettings }) {
  const statsQuery = useQuery({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(`/api/stats/balance?from=${from}&to=${to}`).then((res) =>
        res.json()
      ),
  });

  const formatter = useMemo(() => {
    return getFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);
  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  return (
    <div className="w-4/5 flex gap-3 md:flex-no-wrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          value={income}
          title="Income"
          icon={
            <TrendingUp className="h-12 w-12 rounded-lg text-emerald-500 bg-emerald-400/10 p-2" />
          }
          formatter={formatter}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          value={expense}
          title="Expense"
          icon={
            <TrendingDown className="h-12 w-12 rounded-lg text-red-500 bg-red-400/10  p-2" />
          }
          formatter={formatter}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          value={income - expense}
          title="Balance"
          icon={
            <Wallet className="h-12 w-12 rounded-lg text-violet-500 bg-violet-400/10 p-2" />
          }
          formatter={formatter}
        />
      </SkeletonWrapper>
    </div>
  );
}

function StatCard({ formatter, value, title, icon }) {
  const formatFn = useCallback(
    (value) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className="flex w-full items-center gap-3 p-4">
      {icon}
      <div className="flex flex-col gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={value}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
