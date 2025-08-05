"use client"
import { BiImport } from "react-icons/bi"

const InputConsole = ({ currentInput, setCurrentInput, getFile }) => {
  return (
    <div className="bg-transparent flex flex-col h-full">
      {/* Header */}
      <div className="glass-effect h-16 shadow-lg px-4 z-20 text-xl font-bold flex items-center justify-between text-white">
        <span>Input:</span>
        <label
          htmlFor="inputfile"
          className="text-white text-lg cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
        >
          <input
            type="file"
            accept="*"
            id="inputfile"
            onChange={(e) => getFile(e, setCurrentInput)}
            className="hidden"
          />
          <BiImport className="text-white text-xl" />
          Import Input
        </label>
      </div>

      {/* Text Area */}
      <textarea
        onChange={(e) => setCurrentInput(e.target.value)}
        value={currentInput}
        className="flex-grow resize-none border-0 outline-none p-1 pt-2 text-lg min-h-[250px] bg-transparent border border-primary text-white placeholder-gray-400 shadow-primary focus:border-primary focus:ring-1 focus:ring-primary"
        placeholder="Enter your input here..."
      />
    </div>
  )
}

export default InputConsole
