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
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTable<T extends { [key: string]: any }>({
    columns,
    data,
    caption,
    rowsPerPage = 5,
    showFooter = false,
    renderFooterRow,
}: CustomTableProps<T>) {
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIdx = (page - 1) * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    const pageData = data.slice(startIdx, endIdx);

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

    return (
        <div>
            <Table className="rounded-xl border border-[#ECEFF3] overflow-hidden">
                {caption && <TableCaption>{caption}</TableCaption>}
                <TableHeader className="bg-[#ECEFF3] py-1">
                    <TableRow>
                        {columns.map((col) => (
                            <TableHead key={col.key as string} className={col.className + " text-center"}>
                                {col.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pageData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center">
                                No data found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        pageData.map((row, i) => (
                            <TableRow key={row.id ?? i}>
                                {columns.map((col) => (
                                    <TableCell key={col.key as string} className={(col.className ? col.className + " " : "") + "text-center"}>
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
            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4">
                <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default CustomTable;