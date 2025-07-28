import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DevConnect - Developer Social Platform",
  description: "A modern social platform for developers",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
