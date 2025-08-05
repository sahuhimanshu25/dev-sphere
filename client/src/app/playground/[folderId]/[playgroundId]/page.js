"use client"
import { useSelector } from "react-redux"
import { redirect } from "next/navigation"
import Playground from "../../../../screens/Playground"
import ModalProvider from "../../../../context/ModalContext"
import PlaygroundProvider from "../../../../context/PlaygroundContext"

export default function PlaygroundPage() {
  const { userData } = useSelector((state) => state.user)

  if (!userData) {
    redirect("/login")
  }

  return (
    <PlaygroundProvider>
      <ModalProvider>
        <Playground />
      </ModalProvider>
    </PlaygroundProvider>
  )
}
