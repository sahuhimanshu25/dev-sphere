"use client"
import { BiExport } from "react-icons/bi"

const OutputConsole = ({ currentOutput }) => {
  return (
    <div className="bg-transparent flex flex-col h-full">
      {/* Header */}
      <div className="glass-effect h-16 shadow-lg px-4 z-20 text-xl font-bold flex items-center justify-between text-white">
        <span>Output:</span>
        <a
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(currentOutput)}`}
          download="output.txt"
          className="text-white text-lg hover:text-primary transition-colors flex items-center gap-2 no-underline"
        >
          <BiExport className="text-white text-xl" />
          <span className="text-white text-xl">Export Output</span>
        </a>
      </div>

      {/* Text Area */}
      <textarea
        value={currentOutput}
        disabled
        className="flex-grow resize-none border-0 outline-none p-1 pt-2 text-lg bg-transparent border border-primary text-white shadow-primary"
        placeholder="Output will appear here..."
      />
    </div>
  )
}

export default OutputConsole
