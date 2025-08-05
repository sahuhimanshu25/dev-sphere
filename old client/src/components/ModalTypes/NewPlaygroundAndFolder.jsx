"use client"

import { useContext, useState } from "react"
import { Header, CloseButton } from "../Modal"
import { IoCloseSharp } from "react-icons/io5"
import { ModalContext } from "../../context/ModalContext"
import { PlaygroundContext } from "../../context/PlaygroundContext"
import Select from "react-select"
import "./NewPlaygroundAndFolder.css"

const NewPlaygroundAndFolder = () => {
  const { closeModal } = useContext(ModalContext)
  const { addPlaygroundAndFolder } = useContext(PlaygroundContext)
  const languageOptions = [
    { value: "cpp", label: "cpp" },
    { value: "java", label: "java" },
    { value: "javascript", label: "javascript" },
    { value: "python", label: "python" },
  ]

  const [playgroundName, setPlaygroundName] = useState("")
  const [folderName, setFolderName] = useState("")
  const [language, setLanguage] = useState(languageOptions[0])

  const handleLanguageChange = (selectedOption) => {
    setLanguage(selectedOption)
  }

  return (
    <>
      <Header>
        <h2>Create New Playground & Create New Folder</h2>
        <CloseButton onClick={() => closeModal()}>
          <IoCloseSharp />
        </CloseButton>
      </Header>
      <div className="input-with-select-extended">
        <label>Enter Folder Name</label>
        <input type="text" onChange={(e) => setFolderName(e.target.value)} />
        <label>Enter Card Name</label>
        <input type="text" onChange={(e) => setPlaygroundName(e.target.value)} />
        <Select
          options={languageOptions}
          value={language}
          onChange={handleLanguageChange}
          styles={{
            control: (provided, state) => ({
              ...provided,
              background: "var(--glass-bg)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${state.isFocused ? "var(--primary-color)" : "var(--glass-border)"}`,
              borderRadius: "12px",
              padding: "4px 8px",
              color: "var(--text-color)",
              boxShadow: state.isFocused ? "0 0 0 3px rgba(124, 120, 235, 0.1)" : "none",
              "&:hover": {
                borderColor: "var(--primary-color)",
              },
            }),
            menu: (provided) => ({
              ...provided,
              background: "var(--glass-bg)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--glass-border)",
              borderRadius: "12px",
              boxShadow: "0 8px 32px var(--shadow-dark)",
              zIndex: 9999,
            }),
            option: (provided, state) => ({
              ...provided,
              background: state.isSelected
                ? "var(--primary-color)"
                : state.isFocused
                  ? "rgba(124, 120, 235, 0.1)"
                  : "transparent",
              color: state.isSelected ? "white" : "var(--text-color)",
              "&:hover": {
                background: "rgba(124, 120, 235, 0.2)",
              },
            }),
            singleValue: (provided) => ({
              ...provided,
              color: "var(--text-color)",
            }),
            placeholder: (provided) => ({
              ...provided,
              color: "var(--text-secondary)",
            }),
          }}
        />
        <button
          onClick={() => {
            addPlaygroundAndFolder(folderName, playgroundName, language.label)
            closeModal()
          }}
        >
          {" "}
          Create Playground{" "}
        </button>
      </div>
    </>
  )
}

export default NewPlaygroundAndFolder
