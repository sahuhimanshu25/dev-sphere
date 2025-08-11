 

import { useState, useEffect, useRef } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { githubDark, githubLight } from "@uiw/codemirror-theme-github"
import { bespin } from "@uiw/codemirror-theme-bespin"
import { duotoneDark, duotoneLight } from "@uiw/codemirror-theme-duotone"
import { dracula } from "@uiw/codemirror-theme-dracula"
import { xcodeDark, xcodeLight } from "@uiw/codemirror-theme-xcode"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { okaidia } from "@uiw/codemirror-theme-okaidia"
import { cpp } from "@codemirror/lang-cpp"
import { java } from "@codemirror/lang-java"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { indentUnit } from "@codemirror/language"
import { EditorState } from "@codemirror/state"
import { BiPlay, BiTerminal, BiCode, BiStop } from "react-icons/bi"
import { MdDragIndicator } from "react-icons/md"
import InputConsole from "./InputConsole"
import OutputConsole from "./OutputConsole"
import "./CodeEditor.css"

const CodeEditor = ({
  currentLanguage,
  currentTheme,
  currentCode,
  setCurrentCode,
  currentInput,
  setCurrentInput,
  currentOutput,
  runCode,
  getFile,
  isRunning = false,
}) => {
  const [theme, setTheme] = useState(githubDark)
  const [language, setLanguage] = useState(javascript)
  const [consoleHeight, setConsoleHeight] = useState(200)
  const [isDragging, setIsDragging] = useState(false)
  const [showConsole, setShowConsole] = useState(true)
  const [activeConsoleTab, setActiveConsoleTab] = useState("input") // "input" or "output"
  const [hasOutput, setHasOutput] = useState(false)
  const containerRef = useRef(null)
  const dragRef = useRef(null)

  useEffect(() => {
    if (currentLanguage === "cpp") setLanguage(cpp)
    if (currentLanguage === "java") setLanguage(java)
    if (currentLanguage === "javascript") setLanguage(javascript)
    if (currentLanguage === "python") setLanguage(python)
  }, [currentLanguage])

  useEffect(() => {
    if (currentTheme === "githubDark") setTheme(githubDark)
    if (currentTheme === "githubLight") setTheme(githubLight)
    if (currentTheme === "bespin") setTheme(bespin)
    if (currentTheme === "duotoneDark") setTheme(duotoneDark)
    if (currentTheme === "duotoneLight") setTheme(duotoneLight)
    if (currentTheme === "dracula") setTheme(dracula)
    if (currentTheme === "xcodeDark") setTheme(xcodeDark)
    if (currentTheme === "xcodeLight") setTheme(xcodeLight)
    if (currentTheme === "vscodeDark") setTheme(vscodeDark)
    if (currentTheme === "okaidia") setTheme(okaidia)
  }, [currentTheme])

  // Auto-switch to output tab when output is received
  useEffect(() => {
    if (currentOutput && currentOutput.trim() !== "") {
      setHasOutput(true)
      setActiveConsoleTab("output")
    }
  }, [currentOutput])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const newHeight = containerRect.bottom - e.clientY
    const minHeight = 100
    const maxHeight = containerRect.height - 200

    setConsoleHeight(Math.min(Math.max(newHeight, minHeight), maxHeight))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging])

  const toggleConsole = () => {
    setShowConsole(!showConsole)
  }

  const handleRunCode = async () => {
    setHasOutput(false)
    setActiveConsoleTab("input") // Reset to input tab when starting new run
    await runCode()
  }

  const switchToInputTab = () => {
    setActiveConsoleTab("input")
  }

  const switchToOutputTab = () => {
    setActiveConsoleTab("output")
  }

  const clearOutput = () => {
    setHasOutput(false)
    // Note: We don't clear currentOutput here as it's managed by parent
  }

  const clearInput = () => {
    setCurrentInput("")
  }

  return (
    <div className="ultra-modern-editor" ref={containerRef}>
      {/* Main Editor Area */}
      <div className="editor-main-area" style={{ height: showConsole ? `calc(100% - ${consoleHeight}px)` : "100%" }}>
        <div className="editor-header">
          <div className="editor-tabs">
            <div className="editor-tab active">
              <BiCode className="tab-icon" />
              <span>
                main.
                {currentLanguage === "cpp"
                  ? "cpp"
                  : currentLanguage === "java"
                    ? "java"
                    : currentLanguage === "python"
                      ? "py"
                      : "js"}
              </span>
              <div className="tab-close">×</div>
            </div>
          </div>
          <div className="editor-actions">
            <button
              className={`action-btn ${isRunning ? "running" : ""}`}
              onClick={handleRunCode}
              disabled={isRunning}
              title={isRunning ? "Running..." : "Run Code"}
            >
              {isRunning ? <BiStop className="spin" /> : <BiPlay />}
            </button>
            <button className="action-btn" onClick={toggleConsole} title="Toggle Console">
              <BiTerminal />
            </button>
          </div>
        </div>

        <div className="code-editor-area">
          <CodeMirror
            value={currentCode}
            height="100%"
            theme={theme}
            extensions={[
              language,
              indentUnit.of("    "),
              EditorState.tabSize.of(4),
              EditorState.changeFilter.of(() => true),
            ]}
            onChange={(value) => setCurrentCode(value)}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightSpecialChars: true,
              history: true,
              foldGutter: true,
              drawSelection: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              syntaxHighlighting: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              defaultKeymap: true,
              searchKeymap: true,
              historyKeymap: true,
              foldKeymap: true,
              completionKeymap: true,
              lintKeymap: true,
            }}
          />
        </div>
      </div>

      {/* Draggable Console Panel */}
      {showConsole && (
        <>
          <div
            className={`console-dragger ${isDragging ? "dragging" : ""}`}
            onMouseDown={handleMouseDown}
            ref={dragRef}
          >
            <div className="dragger-handle">
              <MdDragIndicator />
            </div>
            <div className="console-tabs">
              <div className={`console-tab ${activeConsoleTab === "input" ? "active" : ""}`} onClick={switchToInputTab}>
                Input
              </div>
              <div
                className={`console-tab ${activeConsoleTab === "output" ? "active" : ""} ${hasOutput ? "has-output" : ""}`}
                onClick={switchToOutputTab}
              >
                Output
                {hasOutput && <div className="output-indicator"></div>}
              </div>
            </div>
          </div>

          <div className="console-panel" style={{ height: `${consoleHeight}px` }}>
            {activeConsoleTab === "input" ? (
              <InputConsole
                currentInput={currentInput}
                setCurrentInput={setCurrentInput}
                getFile={getFile}
                onClear={clearInput}
              />
            ) : (
              <OutputConsole currentOutput={currentOutput} isRunning={isRunning} onClear={clearOutput} />
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default CodeEditor
