"use client"

import { BiImport } from "react-icons/bi"
import "./InputConsole.css"

const InputConsole = ({ currentInput, setCurrentInput, getFile, onClear }) => {
  return (
    <div className="modern-input-console">
      <div className="modern-console-header">
        <span className="modern-console-title">Program Input</span>
        <div className="modern-console-actions">
          <label htmlFor="inputfile" className="modern-import-label">
            <input type="file" accept="." id="inputfile" onChange={(e) => getFile(e, setCurrentInput)} />
            <BiImport className="modern-import-icon" /> Import Input
          </label>
          {onClear && (
            <button className="modern-clear-btn" onClick={onClear} title="Clear Input">
              Clear
            </button>
          )}
        </div>
      </div>
      <textarea
        className="modern-console-textarea"
        onChange={(e) => setCurrentInput(e.target.value)}
        value={currentInput}
        placeholder="Enter your input here..."
      />
    </div>
  )
}

export default InputConsole
