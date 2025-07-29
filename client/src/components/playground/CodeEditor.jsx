"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { java } from "@codemirror/lang-java"
import { cpp } from "@codemirror/lang-cpp"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { dracula } from "@uiw/codemirror-theme-dracula"
import { okaidia } from "@uiw/codemirror-theme-okaidia"
import { FiMaximize2, FiMinimize2, FiCopy, FiCheck } from "react-icons/fi"
import toast from "react-hot-toast"

const CodeEditor = ({ code, language, onChange }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState("vscode")
  const editorRef = useRef(null)

  const getLanguageExtension = (lang) => {
    switch (lang) {
      case "javascript":
        return javascript()
      case "python":
        return python()
      case "java":
        return java()
      case "cpp":
        return cpp()
      default:
        return javascript()
    }
  }

  const getTheme = (themeName) => {
    switch (themeName) {
      case "vscode":
        return vscodeDark
      case "dracula":
        return dracula
      case "okaidia":
        return okaidia
      default:
        return vscodeDark
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success("Code copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy code")
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreen])

  return (
    <motion.div
      className={`flex flex-col bg-gray-900 ${isFullscreen ? "fixed inset-0 z-50" : "h-full"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 glass">
        <div className="flex items-center space-x-4">
          <h3 className="text-sm font-medium text-gray-300">Code Editor</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Theme Selector */}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="vscode" className="bg-gray-800">
              VS Code Dark
            </option>
            <option value="dracula" className="bg-gray-800">
              Dracula
            </option>
            <option value="okaidia" className="bg-gray-800">
              Okaidia
            </option>
          </select>

          {/* Copy Button */}
          <motion.button
            className="p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            onClick={handleCopy}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {copied ? <FiCheck size={16} className="text-green-400" /> : <FiCopy size={16} />}
          </motion.button>

          {/* Fullscreen Button */}
          <motion.button
            className="p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            onClick={toggleFullscreen}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isFullscreen ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
          </motion.button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          ref={editorRef}
          value={code}
          onChange={onChange}
          extensions={[getLanguageExtension(language)]}
          theme={getTheme(theme)}
          height="100%"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightSelectionMatches: true,
            searchKeymap: true,
          }}
          className="h-full text-sm font-mono"
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-t border-white/10 text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Language: {language.charAt(0).toUpperCase() + language.slice(1)}</span>
          <span>Lines: {code.split("\n").length}</span>
          <span>Characters: {code.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>UTF-8</span>
          <span>•</span>
          <span>LF</span>
        </div>
      </div>
    </motion.div>
  )
}

export default CodeEditor
