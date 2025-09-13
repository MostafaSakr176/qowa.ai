"use client"
import React, { useState, useRef } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type Column<T> = {
    key: keyof T | string;
    header: React.ReactNode;
    className?: string;
    render?: (row: T) => React.ReactNode;
};

type CustomTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    caption?: string;
    rowsPerPage?: number;
    showFooter?: boolean;
    renderFooterRow?: (pageData: T[]) => React.ReactNode;
    onRowClick?: (row: T, index: number) => void;
    // NEW (server-side pagination)
    serverSidePagination?: boolean;
    page?: number;             // controlled current page (1-based)
    pageSize?: number;         // page size (if not provided falls back to rowsPerPage or data.length)
    totalCount?: number;       // total items on server
    onPageChange?: (page: number) => void;
    loading?: boolean;
};

// Helper for page range with ellipsis
function getPageNumbers(current: number, total: number) {
    const delta = 2;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let last: number | undefined = undefined;

    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
            range.push(i);
        }
    }

    for (let i = 0; i < range.length; i++) {
        if (last !== undefined) {
            if ((range[i] as number) - last === 2) {
                rangeWithDots.push(last + 1);
            } else if ((range[i] as number) - last > 2) {
                rangeWithDots.push("...");
            }
        }
        rangeWithDots.push(range[i]);
        last = range[i] as number;
    }

    return rangeWithDots;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTable<T extends { [key: string]: any }>({
    columns,
    data,
    caption,
    rowsPerPage = 10,
    showFooter = false,
    renderFooterRow,
    onRowClick,
    serverSidePagination = false,
    page: controlledPage,
    pageSize,
    totalCount,
    onPageChange,
    loading = false,
}: CustomTableProps<T>) {
    // Internal page state only when NOT server-side
    const [internalPage, setInternalPage] = useState(1);

    // NEW: keep initial (stable) server page size so last short page does not change totalPages
    const initialServerPageSizeRef = useRef<number | null>(null);
    if (serverSidePagination) {
        if (initialServerPageSizeRef.current === null) {
            // Latch first non-zero size (prefer explicit prop, fallback to rowsPerPage, then data.length)
            const firstSize = (pageSize && pageSize > 0)
                ? pageSize
                : (rowsPerPage || 10);
            initialServerPageSizeRef.current = firstSize;
        }
    }

    // Effective current page
    const effectivePage = serverSidePagination ? (controlledPage || 1) : internalPage;

    // CHANGED: use latched size for server mode
    const effectivePageSize = serverSidePagination
        ? (initialServerPageSizeRef.current || pageSize || rowsPerPage || 10)
        : rowsPerPage;

    // Total items & total pages
    const totalItems = serverSidePagination
        ? (totalCount ?? 0)
        : data.length;

    const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));


    // Slice only for client-side pagination
    const startIdx = (effectivePage - 1) * effectivePageSize;
    const endIdx = startIdx + effectivePageSize;
    const pageData = serverSidePagination ? data : data.slice(startIdx, endIdx);

    const changePage = (p: number) => {
        if (p < 1 || p > totalPages) return;
        if (serverSidePagination) {
            onPageChange && onPageChange(p);
        } else {
            setInternalPage(p);
        }
    };
    const handlePrev = () => changePage(effectivePage - 1);
    const handleNext = () => changePage(effectivePage + 1);
    const handlePage = (p: number) => changePage(p);

    const pageNumbers = getPageNumbers(effectivePage, totalPages);

    const pageDropdown = (
        <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>{data.length} / page</span>
        </div>
    );

    return (
        <>
            <div className="rounded-xl border border-[#ECEFF3] overflow-hidden">
                <Table>
                    {caption && <TableCaption>{caption}</TableCaption>}
                    <TableHeader className="bg-[#ECEFF3] py-1 w-full">
                        <TableRow>
                            {columns.map(col => (
                                <TableHead key={col.key as string} className={col.className}>
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="w-full">
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
                                </TableCell>
                            </TableRow>
                        ) : pageData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <div className="py-6 text-center text-sm text-muted-foreground">No data found.</div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            pageData.map((row, i) => (
                                <TableRow
                                    key={i}
                                    onClick={onRowClick ? (e) => {
                                        if ((e.target as HTMLElement).closest("button, a, [role=button]")) return;
                                        onRowClick(row, serverSidePagination ? i : startIdx + i);
                                    } : undefined}
                                    className={onRowClick ? "cursor-pointer hover:bg-[#F5F6FA] transition-colors" : undefined}
                                >
                                    {columns.map(col => (
                                        <TableCell key={col.key as string} className={col.className ? col.className + " " : ""}>
                                            {col.render ? col.render(row) : row[col.key as keyof T]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    {showFooter && (
                        <TableFooter>
                            {renderFooterRow
                                ? renderFooterRow(pageData)
                                : <TableRow><TableCell colSpan={columns.length} /></TableRow>
                            }
                        </TableFooter>
                    )}
                </Table>
            </div>

            <div className="flex items-center justify-between mt-4 px-2">
                <div className="flex items-center gap-2">
                    {pageDropdown}
                    <span className="text-xs text-gray-400 ml-2">
                        Page {effectivePage} of {totalPages}
                        {serverSidePagination && typeof totalCount === "number" && (
                            <span className="ml-2 text-gray-500">({totalItems} items)</span>
                        )}
                        {loading && <span className="ml-2 text-xs">Updating...</span>}
                    </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                    <button
                        onClick={handlePrev}
                        disabled={effectivePage === 1 || loading}
                        className="px-2 py-1 rounded transition border border-transparent text-gray-400 hover:text-gray-700 disabled:opacity-50"
                        style={{ minWidth: 32 }}
                    >Prev</button>
                    {pageNumbers.map((num, idx) =>
                        num === "..." ? (
                            <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-400 select-none">...</span>
                        ) : (
                            <button
                                key={num}
                                onClick={() => handlePage(num as number)}
                                className={`px-2 py-1 rounded transition border ${
                                    effectivePage === num
                                        ? "bg-[#F5F6FA] border-[#ECEFF3] text-gray-900 font-semibold"
                                        : "border-transparent text-gray-700 hover:bg-[#F5F6FA]"
                                }`}
                                style={{ minWidth: 32 }}
                                disabled={effectivePage === num || loading}
                            >{num}</button>
                        )
                    )}
                    <button
                        onClick={handleNext}
                        disabled={effectivePage === totalPages || loading}
                        className="px-2 py-1 rounded transition border border-transparent text-gray-400 hover:text-gray-700 disabled:opacity-50"
                        style={{ minWidth: 32 }}
                    >Next</button>
                </div>
            </div>
        </>
    );
}

export default CustomTable;