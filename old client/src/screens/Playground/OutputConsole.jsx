"use client"

import { BiExport } from "react-icons/bi"
import "./OutputConsole.css"

const OutputConsole = ({ currentOutput, isRunning = false, onClear }) => {
  return (
    <div className="modern-output-console">
      <div className="modern-console-header">
        <span className="modern-console-title">Program Output</span>
        <div className="modern-console-actions">
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(currentOutput || "")}`}
            download="output.txt"
            className="modern-export-link"
          >
            <BiExport className="modern-export-icon" />
            <span>Export Output</span>
          </a>
          {onClear && (
            <button className="modern-clear-btn" onClick={onClear} title="Clear Output Indicator">
              Clear
            </button>
          )}
        </div>
      </div>
      <div className="modern-console-output-area">
        <pre className="modern-output-content">
          {isRunning ? (
            <div className="modern-running-indicator">
              <div className="modern-loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>Executing code...</span>
            </div>
          ) : (
            currentOutput || "No output yet. Run your code to see results here."
          )}
        </pre>
      </div>
    </div>
  )
}

export default OutputConsole
