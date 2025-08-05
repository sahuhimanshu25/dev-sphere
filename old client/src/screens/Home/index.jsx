"use client"

import { useContext } from "react"
import LeftComponent from "./LeftComponent"
import RightComponent from "./RightComponent"
import Modal from "../../components/Modal"
import { ModalContext } from "../../context/ModalContext"
import "./indexP.css"

const Home = () => {
  const { isOpenModal } = useContext(ModalContext)

  return (
    <div className="modern-home-container">
      <div className="home-content-grid">
        <LeftComponent className="left-section" />
        <div className="modern-separator">
          <div className="separator-line"></div>
          <div className="separator-glow"></div>
          <div className="separator-pulse"></div>
        </div>
        <RightComponent className="right-section" />
      </div>
      {isOpenModal.show && <Modal className="modal-overlay" />}
    </div>
  )
}

export default Home
