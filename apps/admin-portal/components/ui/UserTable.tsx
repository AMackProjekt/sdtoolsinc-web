"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Edit,
  Eye,
  UserX,
  UserCheck,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { format } from "date-fns";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string | null;
  avatar?: string;
  createdAt?: string;
};

export type UserTableProps = {
  users: User[];
  loading?: boolean;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onViewDetails: (user: User) => void;
  className?: string;
};

export function UserTable({
  users,
  loading = false,
  onEdit,
  onToggleStatus,
  onViewDetails,
  className,
}: UserTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Define columns
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-border bg-panel text-brand focus:ring-brand focus:ring-offset-0 cursor-pointer"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-border bg-panel text-brand focus:ring-brand focus:ring-offset-0 cursor-pointer"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            aria-label={`Select ${row.original.name}`}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "avatar",
        header: "Avatar",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand2 text-white text-sm font-bold">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-2 hover:text-brand transition-colors"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Name
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="w-4 h-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronsUpDown className="w-4 h-4 opacity-50" />
              )}
            </button>
          );
        },
        cell: ({ row }) => (
          <div className="font-semibold text-text">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-2 hover:text-brand transition-colors"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Email
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="w-4 h-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronsUpDown className="w-4 h-4 opacity-50" />
              )}
            </button>
          );
        },
        cell: ({ row }) => (
          <div className="text-muted">{row.getValue("email")}</div>
        ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-2 hover:text-brand transition-colors"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Role
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="w-4 h-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronsUpDown className="w-4 h-4 opacity-50" />
              )}
            </button>
          );
        },
        cell: ({ row }) => {
          const role = row.getValue("role") as string;
          return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-brand/20 text-brand border border-brand/30">
              {role}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-2 hover:text-brand transition-colors"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Status
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="w-4 h-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronsUpDown className="w-4 h-4 opacity-50" />
              )}
            </button>
          );
        },
        cell: ({ row }) => {
          const status = row.getValue("status") as "active" | "inactive";
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider",
                status === "active"
                  ? "bg-success/20 text-success border border-success/30"
                  : "bg-muted/20 text-muted border border-muted/30"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  status === "active" ? "bg-success" : "bg-muted"
                )}
              />
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "lastLogin",
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-2 hover:text-brand transition-colors"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Last Login
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="w-4 h-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronsUpDown className="w-4 h-4 opacity-50" />
              )}
            </button>
          );
        },
        cell: ({ row }) => {
          const lastLogin = row.getValue("lastLogin") as string | null;
          return (
            <div className="text-muted text-sm">
              {lastLogin ? format(new Date(lastLogin), "MMM dd, yyyy HH:mm") : "Never"}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewDetails(user)}
                className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand/10 transition-all"
                aria-label="View details"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(user)}
                className="p-2 rounded-lg text-muted hover:text-brand2 hover:bg-brand2/10 transition-all"
                aria-label="Edit user"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggleStatus(user)}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  user.status === "active"
                    ? "text-muted hover:text-danger hover:bg-danger/10"
                    : "text-muted hover:text-success hover:bg-success/10"
                )}
                aria-label={user.status === "active" ? "Deactivate" : "Activate"}
              >
                {user.status === "active" ? (
                  <UserX className="w-4 h-4" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [onEdit, onToggleStatus, onViewDetails]
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Loading skeleton
  if (loading) {
    return (
      <div className={cn("rounded-xl glass border border-border overflow-hidden", className)}>
        <div className="p-6 space-y-4">
          {/* Header skeleton */}
          <div className="h-10 bg-glass rounded-lg animate-pulse" />
          
          {/* Table skeleton */}
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-glass rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (users.length === 0 && !globalFilter) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn("rounded-xl glass border border-border p-12", className)}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-glass border border-border">
            <Users className="w-10 h-10 text-muted" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text mb-2">No users found</h3>
            <p className="text-muted max-w-md">
              There are no users in the system yet. Start by adding your first user.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn("rounded-xl glass border border-border overflow-hidden", className)}
    >
      {/* Search & Actions Bar */}
      <div className="p-4 border-b border-border bg-panel/50">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search users..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all"
            />
          </div>
          
          <AnimatePresence>
            {selectedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand/10 border border-brand/30"
              >
                <span className="text-sm font-semibold text-brand">
                  {selectedCount} selected
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-panel/50 border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <Search className="w-8 h-8 text-muted" />
                      <p className="text-muted">No results found for "{globalFilter}"</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.02,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={cn(
                      "hover:bg-glass transition-colors",
                      row.getIsSelected() && "bg-brand/5"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border bg-panel/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted">
            <span>
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{" "}
              of {table.getFilteredRowModel().rows.length} results
            </span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-lg text-muted hover:text-text hover:bg-glass disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="First page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-lg text-muted hover:text-text hover:bg-glass disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-glass border border-border">
              <span className="text-sm font-semibold text-text">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-lg text-muted hover:text-text hover:bg-glass disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-lg text-muted hover:text-text hover:bg-glass disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Last page"
            >
              <ChevronsRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
