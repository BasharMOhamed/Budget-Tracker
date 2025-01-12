"use client";
import { startOfMonth } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DatePickerWithRange } from "./ui/date-range-picker";
import StatsCards from "./StatsCards";
import { useState } from "react";
import CategoriesStats from "./CategoriesStats";
import History from "./History";
export default function Overview({ userSettings }) {
  //   const [dateRange, setDateRange] = useState({
  //     from: startOfMonth(new Date()),
  //     to: new Date(),
  //   });
  const [date, setDate] = useState({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-wrap items-center justify-between py-6 w-4/5">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full items-center">
        <StatsCards from={date.from} to={date.to} userSettings={userSettings} />
        <CategoriesStats
          from={date.from}
          to={date.to}
          userSettings={userSettings}
        />
        <History />
      </div>
    </div>
  );
}
