import { Urbanist } from "next/font/google";
import { notFound } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";

import ModalProvider from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";
import { CrispProvider } from "@/components/crisp-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import "./globals.css";

const font = Urbanist({ subsets: ["latin"] });

export const metadata = {
  title: "Store",
  description: "Store - The place for all your purchases.",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ClerkProvider
        signInUrl={locale === "vi" ? "/vi/sign-in" : "/sign-in"}
        signUpUrl={locale === "vi" ? "/vi/sign-up" : "/sign-up"}
      >
        <html lang={locale}>
          <body className={font.className} suppressHydrationWarning={true}>
            <CrispProvider />
            <ToastProvider />
            <ModalProvider />
            <Navbar />
            <div className="pt-16">{children}</div>
            <Footer />
          </body>
        </html>
      </ClerkProvider>
    </NextIntlClientProvider>
  );
}
