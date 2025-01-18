"use client";
import { TransactionsTable } from "@/components/TransactionsTable";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { startOfMonth } from "date-fns";
import { useState } from "react";

// export const metadata = {
//   title: "Transactions",
//   description: "A web page which contains all the transactions",
// };
function TransactionsPage() {
  const [date, setDate] = useState({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  return (
    <div className="flex flex-col items-center gap-5">
      <header className="w-full flex flex-wrap gap-3 justify-between px-8 py-10 border-b-2 bg-card">
        <h1 className="text-3xl text-bold">Transaction History</h1>
        <DatePickerWithRange date={date} setDate={setDate} />
      </header>
      <TransactionsTable from={date.from} to={date.to} />
    </div>
  );
}

export default TransactionsPage;
