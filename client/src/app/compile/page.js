"use client"
import { useSelector } from "react-redux"
import { redirect } from "next/navigation"
import Home from "../../screens/Home"
import ModalProvider from "../../context/ModalContext"
import PlaygroundProvider from "../../context/PlaygroundContext"

export default function CompilePage() {
  const { userData } = useSelector((state) => state.user)

  if (!userData) {
    redirect("/login")
  }

  return (
    <PlaygroundProvider>
      <ModalProvider>
        <Home />
      </ModalProvider>
    </PlaygroundProvider>
  )
}
