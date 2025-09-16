"use client"
import React, { useState, useMemo, useRef } from "react";
import CustomTable from "@/components/dashboard/CustomTable";
import { ArrowLeft, Download, Ellipsis, Plus, Search, SquarePen, Trash, Loader2, Printer } from "lucide-react";
// Chadcn UI components
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge";
import { hasPermission } from "@/utils/permissions";
import { useSession } from "next-auth/react";
import api from "@/lib/axiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import CreateFindingForm from "./CreateForm";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";


const statusOptions = [
    { value: "all", label: "All" },
    { value: "Completed", label: "Completed" },
    { value: "Rejected", label: "Rejected" },
    { value: "Open", label: "Open" },
];

export interface Evidence {
    id: number;
    description: string | null;
    file: string;
    uploaded_at: string;
}

export interface ScanFinding {
    id: number;
    scan: number;
    title: string;
    description: string;
    steps_to_reproduce: string;
    impact: string;
    severity: "critical" | "high" | "medium" | "low";
    status: "open" | "closed" | "pending" | "finished";
    evidences: Evidence[];
    created_at: string;
    updated_at: string;
}

const deleteFinding = async (id: number) => {
    await api.delete(`/scan/findings/${id}/`);
};

const fetchFindings = async (scanId: string) => {
    const res = await api.get(`/scan/findings/?scan=${scanId}`);
    return res.data || [];
};

const FindingsList = ({ findings, scanId }: { findings: ScanFinding[], scanId: string }) => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editFinding, setEditFinding] = useState<ScanFinding | null>(null);
    const [viewFinding, setViewFinding] = useState<ScanFinding | null>(null);
    const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
    const { data: session } = useSession();
    const [isExporting, setIsExporting] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef, pageStyle: printPageStyle });

    const deleteMutation = useMutation({
        mutationFn: deleteFinding,
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            // Optionally: show error message
            console.error(error);
        }
    });

    const { isLoading, refetch, isFetching } = useQuery({
        queryKey: ['scan-findings', scanId],
        queryFn: () => fetchFindings(scanId),
        initialData: { results: findings } // Use the passed findings as initial data
    });


    // Filtered and sorted data
    const filteredData = useMemo(() => {
        let data = findings;
        if (search.trim() !== "") {
            const lower = search.toLowerCase();
            data = data.filter((row) => row.title.toLowerCase().includes(lower));
        }
        if (status !== "all") {
            data = data.filter((row) => row.status === status);
        }
        return data;
    }, [search, status, findings]);

    // CSV helper
    function csvEscape(value: unknown) {
        if (value === null || value === undefined) return "";
        const str = String(value).replace(/"/g, '""');
        return `"${str}"`;
    }

    function handleExportCsv() {
        try {
            setIsExporting(true);
            if (!filteredData?.length) return;
            const headers = [
                "ID",
                "Title",
                "Severity",
                "Status",
                "Evidences Count",
                "Created At"
            ];
            const rows = filteredData.map(r => [
                r.id,
                r.title,
                r.severity,
                r.status,
                r.evidences?.length || 0,
                new Date(r.created_at).toISOString()
            ].map(csvEscape).join(','));
            const csv = [headers.map(csvEscape).join(','), ...rows].join('\r\n');
            const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const now = new Date();
            a.href = url;
            a.download = `findings_${scanId}_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } finally {
            setIsExporting(false);
        }
    }

    const columns = [
        {
            key: "id",
            header: "ID",
            render: (row: ScanFinding) => (
                <p>
                    #{row.id}
                </p>
            ),
        },
        {
            key: "title",
            header: "Title",
            render: (row: ScanFinding) => (
                <p>
                    {row.title.split(" ").slice(0, 7).join(" ")}
                    {row.title.split(" ")?.length > 7 ? "..." : ""}
                </p>
            ),
        },
        {
            key: "severity",
            header: "Severity",
            render: (row: ScanFinding) => (
                <Badge withDot variant={
                    row.severity === "critical" ? "failed" :
                        row.severity === "high" ? "failed" :
                            row.severity === "medium" ? "pending" : "success"
                }>{row.severity}</Badge>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (row: ScanFinding) => (
                <Badge withDot variant={row.status === "open" ? "pending" : "success"}>{row.status}</Badge>
            ),
        },
        {
            key: "evidences",
            header: "Evidences",
            render: (row: ScanFinding) => row.evidences?.length
        },
        {
            key: "created_at",
            header: "Created",
            render: (row: ScanFinding) => new Date(row.created_at).toLocaleString()
        },
        {
            key: "actions",
            header: "Actions",
            render: (row: ScanFinding) => (
                <Popover>
                    <PopoverTrigger className="border-0"><Ellipsis size={20} /></PopoverTrigger>
                    <PopoverContent className="flex flex-col items-start p-2" align="end">
                        {hasPermission(session, "change_organization") && <Button
                            variant="ghost"
                            className="rounded-lg w-full justify-start"
                            onClick={() => {
                                setEditFinding(row);
                                setIsModalOpen(true);
                            }}
                        >
                            <SquarePen size={18} /> Edit Finding
                        </Button>}
                        <Button
                            variant="ghost"
                            className="rounded-lg w-full justify-start"
                            onClick={() => { setViewFinding(row); setIsViewSheetOpen(true); }}
                        >
                            <Download size={18} /> Export Report
                        </Button>
                        {/* <Button variant="ghost" className="rounded-lg w-full justify-start"><Ban size={18} /> Block</Button> */}
                        {hasPermission(session, "delete_organization") && <Button variant="ghost" className="rounded-lg w-full justify-start" onClick={() => deleteMutation.mutate(row.id)}
                            disabled={deleteMutation.isPending}
                        >
                            <Trash size={18} /> Delete
                        </Button>}
                    </PopoverContent>
                </Popover>
            ),
        }
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="grid grid-cols-2 gap-2 items-center">
                    <Input
                        placeholder="Search payments..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<Search size={20} />}
                        iconPosition="right"
                    />
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions?.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleExportCsv}
                        disabled={!filteredData?.length || isLoading || isFetching || isExporting}
                        className="whitespace-nowrap border-primary text-primary hover:bg-primary hover:text-white flex items-center gap-2"
                    >
                        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        {isExporting ? 'Exporting...' : 'Export CSV'}
                    </Button>
                    <Sheet open={isModalOpen}>
                        <SheetTrigger asChild onClick={() => { setEditFinding(null); setIsModalOpen(true); }}>
                            <Button variant={"primary"} size="lg"><Plus size={20} />  Create Finding</Button>
                        </SheetTrigger>
                        <SheetContent showCloseButton={false}>
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-4">
                                    <ArrowLeft size={20} onClick={() => { setIsModalOpen(false); setEditFinding(null); }} />  {editFinding ? 'Edit Finding' : 'Create Finding'}
                                </SheetTitle>
                            </SheetHeader>
                            <CreateFindingForm finding={editFinding} setIsModalOpen={setIsModalOpen} scanId={scanId} refetch={() => { refetch(); setEditFinding(null); }} />
                        </SheetContent>
                    </Sheet>
                    <Sheet open={isViewSheetOpen} onOpenChange={(open) => { if (!open) { setIsViewSheetOpen(false); setViewFinding(null); } }}>
                        {/* Hidden trigger not needed since we open programmatically */}
                        <SheetContent showCloseButton={false} side="right" className="w-full sm:max-w-[520px] overflow-y-auto">
                            <SheetHeader >
                                <SheetTitle className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                        <ArrowLeft size={20} className="cursor-pointer" onClick={() => { setIsViewSheetOpen(false); setViewFinding(null); }} />
                                        {viewFinding ? `Finding ID: ${viewFinding.id}` : 'Finding'}
                                    </div>
                                    {viewFinding && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="whitespace-nowrap border-primary text-primary hover:bg-primary hover:text-white flex items-center gap-2"
                                            onClick={()=>reactToPrintFn?.()}
                                        >
                                            <Printer size={14} /> Export Report PDF
                                        </Button>
                                    )}
                                </SheetTitle>
                            </SheetHeader>
                            {viewFinding && (
                                <div className="py-4 space-y-6 print-findings-container" ref={contentRef} style={{
                                    scrollbarWidth: 'none',
                                    scrollbarColor: '#0D0D12 #fff',
                                }}>
                                    <div className="flex items-center gap-3">
                                        <Badge withDot variant={
                                            viewFinding.severity === 'critical' ? 'failed' :
                                                viewFinding.severity === 'high' ? 'failed' :
                                                    viewFinding.severity === 'medium' ? 'pending' : 'success'
                                        }>{viewFinding.severity}</Badge>
                                        <Badge variant={viewFinding.status === 'open' ? 'pending' : 'success'} withDot>{viewFinding.status}</Badge>
                                    </div>
                                    <h2 className="text-xl font-bold print:mb-2">{viewFinding.title}</h2>
                                    <div className="print-meta hidden print:block text-xs text-muted-foreground">
                                        <div>ID: {viewFinding.id}</div>
                                        <div>Severity: {viewFinding.severity} | Status: {viewFinding.status}</div>
                                        <div>Generated: {new Date().toLocaleString()}</div>
                                    </div>
                                    <section className="space-y-2">
                                        <h3 className="font-bold text-lg text-[#36394A] print-section-title">Description</h3>
                                        <p className="text-sm whitespace-pre-line break-words">{viewFinding.description || '—'}</p>
                                    </section>
                                    <section className="space-y-2">
                                        <h3 className="font-bold text-lg text-[#36394A] print-section-title">Steps to reproduce</h3>
                                        <div className="text-sm whitespace-pre-line break-words">
                                            {viewFinding.steps_to_reproduce
                                                ? <ol className="list-decimal ml-4 space-y-1">{viewFinding.steps_to_reproduce.split('\n').map((s, i) => (<li key={i}>{s}</li>))}</ol>
                                                : '—'}
                                        </div>
                                    </section>
                                    <section className="space-y-2">
                                        <h3 className="font-bold text-lg text-[#36394A] print-section-title">Impact</h3>
                                        <p className="text-sm whitespace-pre-line break-words">{viewFinding.impact || '—'}</p>
                                    </section>
                                    <section className="space-y-2">
                                        <h3 className="font-bold text-lg text-[#36394A] print-section-title">Evidence / screenshots</h3>
                                        <div className="space-y-6">
                                            {viewFinding.evidences?.length ? viewFinding.evidences.map(ev => (
                                                <div key={ev.id} className="print-evidence text-xs flex flex-col gap-2">
                                                    <Image src={ev.file} alt={ev.description || 'Evidence'} width={1000} height={600} className="w-full h-auto rounded-md overflow-hidden border border-border bg-white" />
                                                    <div className="flex flex-wrap gap-4 w-full text-[11px]">
                                                        <span className="font-medium">{ev.description || 'Evidence'}</span>
                                                        <span className="text-muted-foreground">Uploaded: {new Date(ev.uploaded_at).toLocaleString()}</span>
                                                        <span className="text-muted-foreground break-all">File: {ev.file}</span>
                                                    </div>
                                                </div>
                                            )) : <p className="text-sm text-muted-foreground">No evidences.</p>}
                                        </div>
                                    </section>
                                    <section className="space-y-2 text-xs text-muted-foreground">
                                        <div>Created: {new Date(viewFinding.created_at).toLocaleString()}</div>
                                        <div>Updated: {new Date(viewFinding.updated_at).toLocaleString()}</div>
                                    </section>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            <CustomTable data={filteredData} columns={columns} loading={isLoading} />
        </div>
    );
};

export default FindingsList;

// Print styles injected by react-to-print pageStyle
const printPageStyle = `
 @page { size: A4 portrait; margin: 16mm; }
 body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background:#ffffff; font-family: system-ui, Arial, sans-serif; }
 .print-findings-container { color:#111827; font-size:11pt; }
 .print-findings-container h2 { font-size:20pt; }
 .print-section-title { page-break-after: avoid; border-bottom:1px solid #e5e7eb; padding-bottom:4px; }
 .print-meta { margin-top:-4px; margin-bottom:8px; }
 .print-evidence { page-break-inside: avoid; }
 .print-evidence img { page-break-inside: avoid; background:#fafafa; }
 ol { margin:0; padding-left:18px; }
 .no-print { display:none !important; }
`;

// // Helper to export single finding as PDF
// async function exportSingleFindingPdf(f: ScanFinding) {
//     try {
//         const jsPDFModule = await import('jspdf');
//         const { jsPDF } = jsPDFModule;
//         const doc = new jsPDF({ unit: 'pt', format: 'a4' });
//         const pageWidth = doc.internal.pageSize.getWidth();
//         const margin = 40;
//         let y = margin;

//         const addWrappedText = (text: string, fontSize = 10, lineHeight = 14, bold = false) => {
//             if (!text) return;
//             doc.setFont('helvetica', bold ? 'bold' : 'normal');
//             doc.setFontSize(fontSize);
//             const maxWidth = pageWidth - margin * 2;
//             const lines = doc.splitTextToSize(text, maxWidth);
//             lines.forEach((line: string) => {
//                 if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
//                     doc.addPage();
//                     y = margin;
//                 }
//                 doc.text(line, margin, y);
//                 y += lineHeight;
//             });
//             y += 4; // spacing after paragraph
//         };

//         // Header
//         doc.setFont('helvetica', 'bold');
//         doc.setFontSize(16);
//         doc.text(`Finding #${f.id}: ${f.title}`, margin, y);
//         y += 24;

//         doc.setFontSize(10);
//         doc.setFont('helvetica', 'normal');
//         doc.text(`Severity: ${f.severity}`, margin, y);
//         doc.text(`Status: ${f.status}`, margin + 140, y);
//         y += 16;
//         doc.text(`Created: ${new Date(f.created_at).toLocaleString()}`, margin, y);
//         y += 14;
//         doc.text(`Updated: ${new Date(f.updated_at).toLocaleString()}`, margin, y);
//         y += 20;

//         // Sections
//         const section = (title: string, body: string) => {
//             doc.setFont('helvetica', 'bold');
//             doc.setFontSize(12);
//             if (y + 20 > doc.internal.pageSize.getHeight() - margin) {
//                 doc.addPage();
//                 y = margin;
//             }
//             doc.text(title, margin, y);
//             y += 18;
//             doc.setFont('helvetica', 'normal');
//             addWrappedText(body || '—');
//             y += 4;
//         };

//         section('Description', f.description);
//         section('Steps to Reproduce', f.steps_to_reproduce);
//         section('Impact', f.impact);

//         // Evidences
//         doc.setFont('helvetica', 'bold');
//         doc.setFontSize(12);
//         if (y + 20 > doc.internal.pageSize.getHeight() - margin) {
//             doc.addPage();
//             y = margin;
//         }
//         doc.text(`Evidences (${f.evidences?.length || 0})`, margin, y);
//         y += 18;
//         doc.setFont('helvetica', 'normal');
//         if (!f.evidences?.length) {
//             addWrappedText('No evidences.');
//         } else {
//             for (const ev of f.evidences) {
//                 try {
//                     const dataUrl = await fetchImageAsDataURL(ev.file);
//                     if (!dataUrl) {
//                         addWrappedText(`(Unable to load evidence image: ${ev.file})`);
//                         continue;
//                     }
//                     const imgProps = (doc as unknown as { getImageProperties: (d: string) => { width: number; height: number; fileType?: string } }).getImageProperties(dataUrl);
//                     const maxImgWidth = pageWidth - margin * 2;
//                     const scale = Math.min(1, maxImgWidth / imgProps.width);
//                     const displayWidth = imgProps.width * scale;
//                     const displayHeight = imgProps.height * scale;
//                     if (y + displayHeight + 40 > doc.internal.pageSize.getHeight() - margin) {
//                         doc.addPage();
//                         y = margin;
//                     }
//                     // Determine format from data URL header
//                     const formatMatch = /^data:image\/(png|jpeg|jpg)/i.exec(dataUrl);
//                     const format = formatMatch ? (formatMatch[1] === 'jpg' ? 'JPEG' : formatMatch[1].toUpperCase()) : 'PNG';
//                     doc.addImage(dataUrl, format, margin, y, displayWidth, displayHeight);
//                     y += displayHeight + 6;
//                     addWrappedText(`Description: ${ev.description || '—'}`);
//                     addWrappedText(`Uploaded: ${new Date(ev.uploaded_at).toLocaleString()}`);
//                     y += 6;
//                 } catch {
//                     addWrappedText(`(Failed to embed evidence image: ${ev.file})`);
//                 }
//             }
//         }

//         doc.save(`finding_${f.id}.pdf`);
//     } catch {
//         console.error('Export single finding PDF failed');
//     }
// }

// // Fetch image and convert to data URL with CORS handling
// async function fetchImageAsDataURL(originalUrl: string): Promise<string | null> {
//     // Try https first, then fallback to original (maybe http)
//     const candidateUrls = Array.from(new Set([
//         originalUrl.startsWith('http://') ? originalUrl.replace('http://', 'https://') : originalUrl,
//         originalUrl
//     ]));

//     const session = await getSession();
//     const authHeader = session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {};

//     for (const urlRaw of candidateUrls) {
//         try {
//             let url = urlRaw;
//             if (url.startsWith('/')) url = `https://api.qowa.ai${url}`;
//             const res = await api.get(url, {
//                 responseType: 'blob',
//                 headers: {
//                     Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
//                 }
//             });
//             const blob: Blob = res.data;
//             if (!blob.type.startsWith('image/')) continue;
//             const dataUrl = await new Promise<string>((resolve, reject) => {
//                 const reader = new FileReader();
//                 reader.onload = () => resolve(reader.result as string);
//                 reader.onerror = reject;
//                 reader.readAsDataURL(blob);
//             });
//             return dataUrl;
//         } catch {
//             // try next candidate
//         }
//     }

//     // Canvas fallback (may fail if no CORS)
//     try {
//         const img = new window.Image();
//         img.crossOrigin = 'anonymous';
//         img.src = originalUrl;
//         await new Promise((resolve, reject) => {
//             img.onload = resolve;
//             img.onerror = reject;
//         });
//         const canvas = document.createElement('canvas');
//         canvas.width = img.naturalWidth;
//         canvas.height = img.naturalHeight;
//         const ctx = canvas.getContext('2d');
//         if (!ctx) return null;
//         ctx.drawImage(img, 0, 0);
//         return canvas.toDataURL('image/png');
//     } catch {
//         return null;
//     }
// }