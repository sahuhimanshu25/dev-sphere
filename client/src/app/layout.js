import { Inter } from "next/font/google"
import "./globals.css"
<<<<<<< HEAD
import { Providers } from "./providers"
=======
import Providers from "../components/Providers"
>>>>>>> 09c7f749f77f35c97009f99a04ac2d17a917f862

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
<<<<<<< HEAD
  title: "DevConnect - Developer Social Platform",
  description: "A modern social platform for developers",
=======
  title: "DevSphere - Code. Compile. Debug.",
  description: "A collaborative development platform for developers",
>>>>>>> 09c7f749f77f35c97009f99a04ac2d17a917f862
}

export default function RootLayout({ children }) {
  return (
<<<<<<< HEAD
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white min-h-screen`}
      >
=======
    <html lang="en">
      <body className={inter.className}>
>>>>>>> 09c7f749f77f35c97009f99a04ac2d17a917f862
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
