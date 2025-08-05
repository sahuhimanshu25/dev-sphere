"use client"
import { Provider } from "react-redux"
import { Store } from "../store/Store"
import { Toaster } from "react-hot-toast"
import { ToastContainer } from "react-toastify"
import Sidebar from "../components/Navbar/Sidebar"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import "react-toastify/dist/ReactToastify.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

// export const metadata = {
//   title: "DevSphere - Code, Compile, Connect",
//   description: "The ultimate platform for developers to code, compile, and connect with the community.",
//   keywords: "coding, programming, compiler, developer community, code editor",
// }

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <Provider store={Store}>
          <Sidebar />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 2000,
              style: {
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
              },
            }}
          />
          <ToastContainer />
          {children}
        </Provider>
      </body>
    </html>
  )
}
