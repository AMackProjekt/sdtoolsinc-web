'use client'

import { useState, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { LoadingSkeleton, TableSkeleton } from './LoadingSkeleton'

interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => ReactNode
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  rowActions?: (row: T) => ReactNode
  bulkActions?: ReactNode
  searchable?: boolean
  pagination?: boolean
  itemsPerPage?: number
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  rowActions,
  bulkActions,
  searchable = false,
  pagination = false,
  itemsPerPage = 10,
  className
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  // Filter data
  const filteredData = searchable && searchTerm
    ? data.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data

  // Sort data
  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]
        const modifier = sortDirection === 'asc' ? 1 : -1
        return aVal > bVal ? modifier : aVal < bVal ? -modifier : 0
      })
    : filteredData

  // Paginate data
  const totalPages = pagination ? Math.ceil(sortedData.length / itemsPerPage) : 1
  const startIndex = pagination ? (currentPage - 1) * itemsPerPage : 0
  const endIndex = pagination ? startIndex + itemsPerPage : sortedData.length
  const paginatedData = sortedData.slice(startIndex, endIndex)

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const toggleRowSelection = (index: number) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedRows(newSelected)
  }

  const toggleAllRows = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedData.map((_, i) => i)))
    }
  }

  if (loading) {
    return (
      <div className={cn('glass rounded-xl p-6', className)}>
        <TableSkeleton rows={itemsPerPage} columns={columns.length} />
      </div>
    )
  }

  return (
    <div className={cn('glass rounded-xl p-6', className)}>
      {/* Header with search and bulk actions */}
      {(searchable || bulkActions) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {searchable && (
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full sm:w-64 px-4 py-2 bg-bg border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand"
            />
          )}
          {bulkActions && selectedRows.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">{selectedRows.size} selected</span>
              {bulkActions}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {bulkActions && (
                <th className="text-left py-3 px-3 w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={toggleAllRows}
                    className="rounded border-border bg-bg"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'text-left py-3 px-3 text-muted font-medium',
                    column.sortable && 'cursor-pointer hover:text-text transition-colors select-none'
                  )}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-brand">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {rowActions && <th className="text-left py-3 px-3 text-muted font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (bulkActions ? 1 : 0) + (rowActions ? 1 : 0)} className="py-12 text-center text-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIndex * 0.02 }}
                  className={cn(
                    'border-b border-border transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-glass',
                    selectedRows.has(rowIndex) && 'bg-brand/5'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {bulkActions && (
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => toggleRowSelection(rowIndex)}
                        className="rounded border-border bg-bg"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={String(column.key)} className="py-3 px-3 text-text">
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key] ?? '—')}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      {rowActions(row)}
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t border-border">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm rounded-lg text-muted hover:bg-glass disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum
              if (totalPages <= 7) {
                pageNum = i + 1
              } else if (currentPage <= 4) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i
              } else {
                pageNum = currentPage - 3 + i
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    'px-3 py-1 text-sm rounded-lg transition-colors',
                    currentPage === pageNum
                      ? 'bg-brand text-white'
                      : 'text-muted hover:bg-glass'
                  )}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm rounded-lg text-muted hover:bg-glass disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
