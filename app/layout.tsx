import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/Toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WhatsAppProvider } from "@/contexts/WhatsAppModalContext";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: {
    default: "CC7 Computers | Best Laptops & Repairs in Awka & Onitsha",
    template: "%s | CC7 Computers"
  },
  description: "Nigerian tech retail vibe. Quality Laptops, Fast Repairs & Best Prices in Awka & Onitsha.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://cc7computers.example")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className="font-poppins bg-light dark:bg-[#0b1220] text-dark dark:text-light antialiased">
        <AuthProvider>
          <CartProvider>
            <WhatsAppProvider>
              <ThemeProvider>
                <Navbar />
                <main className="min-h-screen">{children}</main>
                <Footer />
                <Toaster />
              </ThemeProvider>
            </WhatsAppProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
