"use client"
import { useContext, useState } from "react"
import CodeEditor from "./CodeEditor"
import { BiEditAlt, BiImport, BiExport } from "react-icons/bi"
import { ModalContext } from "../../context/ModalContext"
import Select from "react-select"
import { languageMap } from "../../context/PlaygroundContext"

const EditorContainer = ({
  title,
  currentLanguage,
  setCurrentLanguage,
  currentCode,
  setCurrentCode,
  folderId,
  playgroundId,
  saveCode,
  runCode,
  getFile,
}) => {
  const { openModal } = useContext(ModalContext)

  const themeOptions = [
    { value: "githubDark", label: "GitHub Dark" },
    { value: "githubLight", label: "GitHub Light" },
    { value: "bespin", label: "Bespin" },
    { value: "duotoneDark", label: "Duotone Dark" },
    { value: "duotoneLight", label: "Duotone Light" },
    { value: "dracula", label: "Dracula" },
    { value: "xcodeDark", label: "Xcode Dark" },
    { value: "xcodeLight", label: "Xcode Light" },
    { value: "vscodeDark", label: "VS Code Dark" },
    { value: "okaidia", label: "Okaidia" },
  ]

  const languageOptions = [
    { value: "cpp", label: "C++" },
    { value: "javascript", label: "JavaScript" },
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
  ]

  const [currentTheme, setCurrentTheme] = useState({ value: "githubDark", label: "GitHub Dark" })
  const [language, setLanguage] = useState(() => {
    return languageOptions.find((option) => option.value === currentLanguage) || languageOptions[0]
  })

  const handleThemeChange = (selectedOption) => {
    setCurrentTheme(selectedOption)
  }

  const handleLanguageChange = (selectedOption) => {
    setLanguage(selectedOption)
    setCurrentLanguage(selectedOption.value)
    setCurrentCode(languageMap[selectedOption.value].defaultCode)
  }

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#333740",
      borderColor: state.isFocused ? "#7C78EB" : "rgba(124, 120, 235, 0.3)",
      color: "white",
      minHeight: "40px",
      boxShadow: state.isFocused ? "0 0 0 1px #7C78EB" : "none",
      "&:hover": {
        borderColor: "#7C78EB",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#333740",
      border: "1px solid rgba(124, 120, 235, 0.3)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#7C78EB" : state.isFocused ? "#444B54" : "#333740",
      color: "white",
      "&:hover": {
        backgroundColor: "#444B54",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9CA3AF",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
  }

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-4.5rem)]">
      {/* Upper Toolbar */}
      <div className="bg-transparent flex justify-between items-center flex-wrap gap-2 p-3 border-2 border-primary/30 mt-0.5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 mr-9 text-xl text-primary">
            <div className="flex justify-center items-center">
              <span className="text-lg tracking-wide text-primary">{title}</span>
            </div>
            <span className="cursor-pointer hover:text-primary-light transition-colors">
              <BiEditAlt
                onClick={() =>
                  openModal({
                    show: true,
                    modalType: 5,
                    identifiers: {
                      folderId: folderId,
                      cardId: playgroundId,
                    },
                  })
                }
              />
            </span>
          </div>
          <button
            className="inline-block transition-all duration-200 ease-in overflow-hidden z-10 text-white cursor-pointer rounded-full bg-transparent border border-primary text-lg tracking-wide w-32 py-2 glass-effect hover:text-white hover:border-primary relative before:content-[''] before:absolute before:left-1/2 before:transform before:-translate-x-1/2 before:scale-y-100 before:scale-x-125 before:top-full before:w-[140%] before:h-[180%] before:bg-black/5 before:rounded-full before:block before:transition-all before:duration-500 before:delay-100 before:cubic-bezier-[0.55,0,0.1,1] before:z-[-1] after:content-[''] after:absolute after:left-[55%] after:transform after:-translate-x-1/2 after:scale-y-145 after:top-[180%] after:w-[160%] after:h-[190%] after:bg-primary after:rounded-full after:block after:transition-all after:duration-500 after:delay-100 after:cubic-bezier-[0.55,0,0.1,1] after:z-[-1] hover:before:top-[-35%] hover:before:bg-primary hover:before:transform hover:before:-translate-x-1/2 hover:before:scale-y-130 hover:before:scale-x-80 hover:after:top-[-45%] hover:after:bg-primary hover:after:transform hover:after:-translate-x-1/2 hover:after:scale-y-130 hover:after:scale-x-80 active:text-gray-600"
            onClick={saveCode}
          >
            Save Code
          </button>
        </div>

        <div className="flex items-center flex-wrap gap-4">
          <div className="w-32">
            <Select
              options={languageOptions}
              value={language}
              onChange={handleLanguageChange}
              styles={customSelectStyles}
              isSearchable={false}
            />
          </div>
          <div className="w-40">
            <Select
              options={themeOptions}
              value={currentTheme}
              onChange={handleThemeChange}
              styles={customSelectStyles}
              isSearchable={false}
            />
          </div>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="h-[70.02vh] overflow-auto">
        <div className="h-full">
          <CodeEditor
            currentLanguage={currentLanguage}
            currentTheme={currentTheme.value}
            currentCode={currentCode}
            setCurrentCode={setCurrentCode}
          />
        </div>
      </div>

      {/* Lower Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-4 glass-effect">
        <label
          htmlFor="codefile"
          className="text-white text-xl border-2 border-primary px-2 py-1 rounded-2xl glass-effect cursor-pointer hover:bg-primary/20 transition-colors flex items-center gap-2"
        >
          <input type="file" accept="*" id="codefile" onChange={(e) => getFile(e, setCurrentCode)} className="hidden" />
          <BiImport /> Import Code
        </label>

        <a
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(currentCode)}`}
          download="code.txt"
          className="text-white text-xl border-2 border-primary px-2 py-1 rounded-2xl glass-effect hover:bg-primary/20 transition-colors flex items-center gap-2 no-underline"
        >
          <BiExport /> Export Code
        </a>

        <button
          className="inline-block transition-all duration-200 ease-in overflow-hidden z-10 text-white cursor-pointer rounded-full bg-transparent border border-primary text-lg tracking-wide w-32 h-10 glass-effect hover:text-white hover:border-primary relative before:content-[''] before:absolute before:left-1/2 before:transform before:-translate-x-1/2 before:scale-y-100 before:scale-x-125 before:top-full before:w-[140%] before:h-[180%] before:bg-black/5 before:rounded-full before:block before:transition-all before:duration-500 before:delay-100 before:cubic-bezier-[0.55,0,0.1,1] before:z-[-1] after:content-[''] after:absolute after:left-[55%] after:transform after:-translate-x-1/2 after:scale-y-145 after:top-[180%] after:w-[160%] after:h-[190%] after:bg-primary after:rounded-full after:block after:transition-all after:duration-500 after:delay-100 after:cubic-bezier-[0.55,0,0.1,1] after:z-[-1] hover:before:top-[-35%] hover:before:bg-primary hover:before:transform hover:before:-translate-x-1/2 hover:before:scale-y-130 hover:before:scale-x-80 hover:after:top-[-45%] hover:after:bg-primary hover:after:transform hover:after:-translate-x-1/2 hover:after:scale-y-130 hover:after:scale-x-80"
          onClick={runCode}
        >
          Run Code
        </button>
      </div>
    </div>
  )
}

export default EditorContainer
