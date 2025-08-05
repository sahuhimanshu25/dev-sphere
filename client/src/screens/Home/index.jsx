"use client"
import { useContext } from "react"
import LeftComponent from "./LeftComponent"
import RightComponent from "./RightComponent"
import Modal from "../../components/Modal"
import { ModalContext } from "../../context/ModalContext"

const Home = () => {
  const { isOpenModal } = useContext(ModalContext)

  return (
    <div className="flex h-screen font-roboto">
      <div className="flex flex-1 h-[95vh] rounded-2xl shadow-primary border-primary bg-transparent m-4">
        <LeftComponent className="flex-1" />
        <div className="h-full w-0.5 bg-primary/40 shadow-primary" />
        <RightComponent className="flex-[2]" />
      </div>
      {isOpenModal.show && <Modal className="modal-component" />}
    </div>
  )
}

export default Home
