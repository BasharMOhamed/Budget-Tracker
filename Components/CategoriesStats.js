import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import { useCallback, useMemo } from "react";
import { getFormatterForCurrency } from "@/lib/helpers";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

export default function CategoriesStats({ to, from, userSettings }) {
  const statsQuery = useQuery({
    queryKey: ["overview", "stats", "categories", to, from],
    queryFn: () =>
      fetch(`/api/stats/categories?from=${from}&to=${to}`).then((res) =>
        res.json()
      ),
  });
  const formatter = useMemo(() => {
    return getFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);
  //   const byIncome = statsQuery.data.map()
  return (
    <div className="w-4/5 flex gap-3">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        {statsQuery.data && (
          <CategoriesCard
            formatter={formatter}
            type="income"
            data={statsQuery.data}
          />
        )}
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        {statsQuery.data && (
          <CategoriesCard
            formatter={formatter}
            type="expense"
            data={statsQuery.data}
          />
        )}
      </SkeletonWrapper>
    </div>
  );
}

function CategoriesCard({ formatter, type, data }) {
  //   const formatFn = useCallback(
  //     (value) => {
  //       return formatter.format(value);
  //     },
  //     [formatter]
  //   );
  console.log("Data: ", data);
  const filteredData = data.filter((t) => t.type === type);
  //   const filteredData = [];
  const total = filteredData.reduce((acc, el) => acc + el._sum.amount, 0);
  return (
    <Card className="w-full col-span-6">
      <CardHeader>
        <CardTitle className="text-center text-muted-foreground ">
          {type === "income" ? "Incomes by category" : "Expenses by category"}
        </CardTitle>
      </CardHeader>
      <div className="flex flex-col gap-3 pb-4">
        {filteredData.length === 0 && (
          <div className="flex flex-col justify-center items-center">
            No data for the selected period
            <p className="text-muted-foreground">
              Try selecting a different period or try adding new {type}s
            </p>
          </div>
        )}
        {filteredData.length > 0 &&
          filteredData.map((item) => {
            const amount = item._sum.amount || 0;
            const percentage = (amount / total) * 100;
            console.log(amount, total);
            return (
              <div key={item.category} className="flex flex-col px-4 gap-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{item.categoryType}</span>
                    <span className="text-sm">{item.category}</span>
                    <span className="text-muted-foreground text-sm">
                      ({percentage.toFixed(2)}%)
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatter.format(amount)}
                  </span>
                </div>
                <Progress
                  value={percentage}
                  indicator={
                    type === "income" ? "bg-emerald-500" : "bg-red-500"
                  }
                />
              </div>
            );
          })}
      </div>
    </Card>
  );
}
