 

import { useContext } from "react"
import {
  NewFolder,
  NewPlayground,
  NewPlaygroundAndFolder,
  EditFolder,
  EditPlaygroundTitle,
  Loading,
} from "./ModalTypes"
import { ModalContext } from "../context/ModalContext"
import "./Modal.css"

export const Header = ({ children }) => <div className="modal-header">{children}</div>

export const CloseButton = ({ onClick, children }) => (
  <button className="modal-close-button" onClick={onClick}>
    {children}
  </button>
)

export const Input = ({ children }) => <div className="modal-input-section">{children}</div>

const Modal = () => {
  const { isOpenModal } = useContext(ModalContext)
  const { modalType } = isOpenModal

  // ModalTypes
  // 1: New Folder
  // 2: New Playground
  // 3: New Playground and Folder
  // 4: Rename Folder
  // 5: Rename Playground

  return (
    <div className="modal-container">
      <div className="modal-backdrop" />
      <div className="modal-content">
        {modalType === 1 && <NewFolder />}
        {modalType === 2 && <NewPlayground />}
        {modalType === 3 && <NewPlaygroundAndFolder />}
        {modalType === 4 && <EditFolder />}
        {modalType === 5 && <EditPlaygroundTitle />}
        {modalType === 6 && <Loading />}
      </div>
    </div>
  )
}

export default Modal
