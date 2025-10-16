import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions"; // مهم عشان ال config
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
    title: "Dashboard - Your Company",
    description: "Dashboard for your business management",
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // ⬅️ check session on server
    const session = await getServerSession(authOptions);

    const locale = await getLocale();

    // Check if session exists and if user has a role other than "employee"
    // Since 'role' is not a property on the default Session type, we need to access it from session.user
    if (
        !session ||
        !session.user ||
        (session.user as { role?: string }).role !== "client"
    ) {
        redirect(`/${locale}/auth/login`); // لو مش عامل login يرجع على صفحة login
    }

    return (
        <>
            {children}
        </>
    );
}
