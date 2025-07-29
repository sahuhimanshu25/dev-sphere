"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { FiMonitor, FiCopy, FiCheck, FiX, FiDownload } from "react-icons/fi"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import toast from "react-hot-toast"

const OutputConsole = ({ output, isRunning, language }) => {
  const [copied, setCopied] = useState(false)
  const [outputType, setOutputType] = useState("text") // text, error, success
  const outputRef = useRef(null)

  useEffect(() => {
    // Auto-scroll to bottom when new output arrives
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }

    // Determine output type based on content
    if (output.toLowerCase().includes("error") || output.toLowerCase().includes("exception")) {
      setOutputType("error")
    } else if (output && !output.toLowerCase().includes("error")) {
      setOutputType("success")
    } else {
      setOutputType("text")
    }
  }, [output])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      toast.success("Output copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy output")
    }
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([output], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `output_${Date.now()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success("Output downloaded!")
  }

  const getStatusIcon = () => {
    if (isRunning) {
      return <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
    }

    switch (outputType) {
      case "error":
        return <FiX className="text-red-400" size={16} />
      case "success":
        return <FiCheck className="text-green-400" size={16} />
      default:
        return <FiMonitor className="text-blue-400" size={16} />
    }
  }

  const getStatusColor = () => {
    switch (outputType) {
      case "error":
        return "border-red-500/30 bg-red-500/5"
      case "success":
        return "border-green-500/30 bg-green-500/5"
      default:
        return "border-blue-500/30 bg-blue-500/5"
    }
  }

  return (
    <motion.div
      className="h-full flex flex-col bg-gray-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 glass">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <h3 className="text-sm font-medium text-gray-300">{isRunning ? "Running..." : "Output"}</h3>
          {output && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                outputType === "error"
                  ? "bg-red-500/20 text-red-300"
                  : outputType === "success"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-blue-500/20 text-blue-300"
              }`}
            >
              {outputType === "error" ? "Error" : outputType === "success" ? "Success" : "Output"}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            onClick={handleCopy}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!output || isRunning}
          >
            {copied ? <FiCheck size={14} className="text-green-400" /> : <FiCopy size={14} />}
          </motion.button>

          <motion.button
            className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            onClick={handleDownload}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!output || isRunning}
          >
            <FiDownload size={14} />
          </motion.button>
        </div>
      </div>

      {/* Output Area */}
      <div className="flex-1 overflow-hidden">
        {isRunning ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="loading-dots mb-4">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <p className="text-gray-400">Executing your code...</p>
            </div>
          </div>
        ) : output ? (
          <div ref={outputRef} className={`h-full overflow-auto p-4 border-l-4 ${getStatusColor()}`}>
            {outputType === "error" ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-3">
                  <FiX className="text-red-400" size={16} />
                  <span className="text-red-300 font-medium">Execution Error</span>
                </div>
                <pre className="text-red-200 text-sm font-mono whitespace-pre-wrap break-words">{output}</pre>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-3">
                  <FiCheck className="text-green-400" size={16} />
                  <span className="text-green-300 font-medium">Program Output</span>
                </div>
                <SyntaxHighlighter
                  language="text"
                  style={oneDark}
                  customStyle={{
                    background: "transparent",
                    padding: 0,
                    margin: 0,
                    fontSize: "14px",
                  }}
                  wrapLongLines
                >
                  {output}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <FiMonitor size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No output yet</p>
              <p className="text-gray-500 text-sm">Run your code to see the output here</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/10 bg-gray-800/30">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            {isRunning
              ? "Code is running..."
              : output
                ? `Output ready • ${output.split("\n").length} lines`
                : "Ready to execute"}
          </span>
          {output && <span>{output.length} characters</span>}
        </div>
      </div>
    </motion.div>
  )
}

export default OutputConsole
