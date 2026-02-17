import { ClerkProvider } from "@clerk/nextjs";
import { Geist_Mono, Pacifico, Poppins } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/ReduxProvider";
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`
            ${geistMono.variable}
            ${pacifico.variable}
            ${poppins.variable}
            font-sans antialiased
          `}
        >
          <ReduxProvider>
            {children}
            <div id="modal-root" />
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
