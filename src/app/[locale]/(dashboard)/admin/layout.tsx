import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getServerSession } from "next-auth/next"; // ✅ Use this for server components
import { authOptions } from "@/lib/authOptions"; // Import your auth config

export const metadata: Metadata = {
    title: "Dashboard - Your Company",
    description: "Dashboard for your business management",
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // ✅ Use getServerSession for server-side session access
    const session = await getServerSession(authOptions);

    const locale = await getLocale();

    // Check if session exists and if user has a role other than "employee"
    if (
        !session ||
        !session.user ||
        (session.user as { role?: string }).role !== "employee"
    ) {
        redirect(`/${locale}/auth/login`); // لو مش عامل login يرجع على صفحة login
    }

    return (
        <>
            {children}
        </>
    );
}
