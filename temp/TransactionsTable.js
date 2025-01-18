import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import React, { useMemo, useState } from "react";
import { DataTableColumnHeader } from "./ui/DataTableColumnHeader";
import { Download, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DeleteTransactionDialog from "./DeleteTransactionDialog";
import { DataTableFacetedFilter } from "./ui/data-table-faceted-filter";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { DataTableViewOptions } from "./ui/DataTableViewOprions";
import { getFormatterForCurrency } from "@/lib/helpers";
const csvConfig = mkConfig({ useKeysAsHeaders: true });
export const getColumns = (currency) => [
  {
    accessorKey: "category",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Category"} />;
    },
    cell: ({ row }) => (
      <div className="flex gap-2">
        {row.original.categoryType}
        <div>{row.original.category}</div>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Description"} />;
    },
    cell: ({ row }) => (
      <span className="capitalize">{row.original.description}</span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.date}</span>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Type"} />;
    },
    cell: ({ row }) => (
      <div
        className={`${
          row.original.type === "income"
            ? "text-emerald-500 bg-emerald-400/10"
            : "text-red-500 bg-red-400/10"
        } p-1 rounded-lg text-center`}
      >
        {row.original.type}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Amount"} />;
    },
    cell: ({ row }) => (
      <span>
        {getFormatterForCurrency(currency).format(row.original.amount)}
      </span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <RowActions transaction={row.original} />,
  },
];

export function TransactionsTable({ from, to }) {
  const userSettings = useQuery({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/userSettings").then((res) => res.json()),
  });

  const transactionsQuery = useQuery({
    queryKey: ["Transactions", from, to],
    queryFn: () =>
      fetch(`/api/transactions?from=${from}&to=${to}`).then((res) =>
        res.json()
      ),
  });

  const data = transactionsQuery.data;
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);

  const columns = useMemo(() => {
    if (!userSettings.data) return [];
    return getColumns(userSettings.data.currency);
  }, [userSettings.data]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const categoriesOptions = useMemo(() => {
    const categoriesMap = new Map();
    transactionsQuery.data?.forEach((transaction) => {
      if (!categoriesMap.has(transaction.category)) {
        categoriesMap.set(transaction.category, {
          value: transaction.category,
          label: `${transaction.categoryType} ${transaction.category}`,
        });
      }
    });
    return Array.from(categoriesMap.values());
  }, [transactionsQuery.data || []]);
  // Loading state
  if (transactionsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (transactionsQuery.isError) {
    return <div>Error fetching data</div>;
  }
  return (
    <div className="w-4/5 flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex flex-wrap gap-2">
          {table.getColumn("category") && (
            <DataTableFacetedFilter
              column={table.getColumn("category")}
              title={"Category"}
              options={categoriesOptions}
            />
          )}
          {table.getColumn("type") && (
            <DataTableFacetedFilter
              column={table.getColumn("type")}
              title={"Type"}
              options={[
                {
                  value: "income",
                  label: "Income",
                },
                {
                  value: "expense",
                  label: "Expense",
                },
              ]}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant="outline"
            onClick={() => {
              const data = table.getFilteredRowModel().rows.map((row) => {
                return {
                  category: `${row.original.categoryType} ${row.original.category}`,
                  description: row.original.description,
                  type: row.original.type,
                  amount: row.original.amount,
                  date: row.original.date,
                };
              });
              const csv = generateCsv(csvConfig)(data);
              download(csvConfig)(csv);
            }}
          >
            <Download />
            Export CSV
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
function RowActions({ transaction }) {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <>
      <DeleteTransactionDialog
        open={openDialog}
        setOpen={setOpenDialog}
        transactionId={transaction.id}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" className="p-0 h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setOpenDialog((prev) => !prev)}>
            <Trash />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
