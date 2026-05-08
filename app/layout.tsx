import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Cormorant_Garamond } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Film Journal",
  description: "A photo and film photography journal built with Next.js.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("fj_session")?.value === "active";
  const userName = cookieStore.get("fj_user_name")?.value || null;
  const userRole = cookieStore.get("fj_user_role")?.value || null;

  return (
    <html lang="zh-CN" className={`h-full antialiased ${cormorant.variable}`}>
      <body className="min-h-full bg-background text-foreground">
        <div className="flex min-h-full flex-col">
          <SiteHeader isLoggedIn={isLoggedIn} userName={userName} userRole={userRole} />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
