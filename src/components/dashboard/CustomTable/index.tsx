"use client"
import React, { useState } from "react";
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
    onRowClick?: (row: T, index: number) => void; // <-- Added prop
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
    onRowClick, // <-- Added prop
}: CustomTableProps<T>) {
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
    const startIdx = (page - 1) * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    const pageData = data.slice(startIdx, endIdx);

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));
    const handlePage = (p: number) => setPage(p);

    // For "1 Page" dropdown (not implemented, just static for now)
    const pageDropdown = (
        <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>1 Page</span>
            <svg width="12" height="12" className="ml-1" viewBox="0 0 20 20" fill="none">
                <path d="M5 8L10 13L15 8" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );

    // Pagination numbers with ellipsis
    const pageNumbers = getPageNumbers(page, totalPages);

    return (
        <>
            <div className="rounded-xl border border-[#ECEFF3] overflow-hidden">
                <Table>
                    {caption && <TableCaption>{caption}</TableCaption>}
                    <TableHeader className="bg-[#ECEFF3] py-1 w-full">
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={col.key as string} className={col.className}>
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="w-full">
                        {pageData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    No data found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pageData.map((row, i) => (
                                <TableRow
                                    key={row.id ?? i}
                                    onClick={onRowClick ? (e) => { 
                                        // Prevent row click if the click originated from a button or link inside the row
                                        if (
                                            (e.target as HTMLElement).closest("button, a, [role=button]")
                                        ) return;
                                        onRowClick(row, startIdx + i);
                                    } : undefined}
                                    className={onRowClick ? "cursor-pointer hover:bg-[#F5F6FA] transition-colors" : undefined}
                                >
                                    {columns.map((col) => (
                                        <TableCell key={col.key as string} className={(col.className ? col.className + " " : "")}>
                                            {col.render
                                                ? col.render(row)
                                                : row[col.key as keyof T]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    {showFooter && (
                        <TableFooter>
                            {renderFooterRow ? (
                                renderFooterRow(pageData)
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} />
                                </TableRow>
                            )}
                        </TableFooter>
                    )}
                </Table>
            </div>

            {/* Pagination Controls - styled like the image */}
            <div className="flex items-center justify-between mt-4 px-2">
                {/* Left: Page Dropdown and total */}
                <div className="flex items-center gap-2">
                    {pageDropdown}
                    <span className="text-xs text-gray-400 ml-2">of {totalPages}</span>
                </div>
                {/* Right: Pagination */}
                <div className="flex items-center gap-1 text-xs">
                    <button
                        onClick={handlePrev}
                        disabled={page === 1}
                        className="px-2 py-1 rounded transition border border-transparent text-gray-400 hover:text-gray-700 disabled:opacity-50"
                        style={{ minWidth: 32 }}
                    >
                        Prev
                    </button>
                    {pageNumbers.map((num, idx) =>
                        num === "..." ? (
                            <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-400 select-none">...</span>
                        ) : (
                            <button
                                key={num}
                                onClick={() => handlePage(num as number)}
                                className={`px-2 py-1 rounded transition border ${
                                    page === num
                                        ? "bg-[#F5F6FA] border-[#ECEFF3] text-gray-900 font-semibold"
                                        : "border-transparent text-gray-700 hover:bg-[#F5F6FA]"
                                }`}
                                style={{ minWidth: 32 }}
                                disabled={page === num}
                            >
                                {num}
                            </button>
                        )
                    )}
                    <button
                        onClick={handleNext}
                        disabled={page === totalPages}
                        className="px-2 py-1 rounded transition border border-transparent text-gray-400 hover:text-gray-700 disabled:opacity-50"
                        style={{ minWidth: 32 }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}

export default CustomTable;