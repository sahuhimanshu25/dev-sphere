"use client"
import { createContext, useState } from "react"

export const ModalContext = createContext()

const ModalProvider = ({ children }) => {
  const [isOpenModal, setIsOpenModal] = useState({
    show: false,
    modalType: 1,
    identifiers: {
      folderId: "",
      cardId: "",
    },
  })

  const openModal = (value) => {
    setIsOpenModal(value)
  }

  const closeModal = () => {
    setIsOpenModal({
      show: false,
      modalType: 1,
      identifiers: {
        folderId: "",
        cardId: "",
      },
    })
  }

  const ModalFeatures = {
    isOpenModal,
    openModal,
    closeModal,
  }

  return <ModalContext.Provider value={ModalFeatures}>{children}</ModalContext.Provider>
}

export default ModalProvider
