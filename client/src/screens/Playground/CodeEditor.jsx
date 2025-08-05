"use client"
import { useState, useEffect } from "react"
import CodeMirror from "@uiw/react-codemirror"
// Themes
import { githubDark, githubLight } from "@uiw/codemirror-theme-github"
import { bespin } from "@uiw/codemirror-theme-bespin"
import { duotoneDark, duotoneLight } from "@uiw/codemirror-theme-duotone"
import { dracula } from "@uiw/codemirror-theme-dracula"
import { xcodeDark, xcodeLight } from "@uiw/codemirror-theme-xcode"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { okaidia } from "@uiw/codemirror-theme-okaidia"
// Languages
import { cpp } from "@codemirror/lang-cpp"
import { java } from "@codemirror/lang-java"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
// Configuration
import { indentUnit } from "@codemirror/language"
import { EditorState } from "@codemirror/state"

const CodeEditor = ({ currentLanguage, currentTheme, currentCode, setCurrentCode }) => {
  const [theme, setTheme] = useState(githubDark)
  const [language, setLanguage] = useState(javascript)

  useEffect(() => {
    switch (currentLanguage) {
      case "cpp":
        setLanguage(cpp)
        break
      case "java":
        setLanguage(java)
        break
      case "javascript":
        setLanguage(javascript)
        break
      case "python":
        setLanguage(python)
        break
      default:
        setLanguage(javascript)
    }
  }, [currentLanguage])

  useEffect(() => {
    switch (currentTheme) {
      case "githubDark":
        setTheme(githubDark)
        break
      case "githubLight":
        setTheme(githubLight)
        break
      case "bespin":
        setTheme(bespin)
        break
      case "duotoneDark":
        setTheme(duotoneDark)
        break
      case "duotoneLight":
        setTheme(duotoneLight)
        break
      case "dracula":
        setTheme(dracula)
        break
      case "xcodeDark":
        setTheme(xcodeDark)
        break
      case "xcodeLight":
        setTheme(xcodeLight)
        break
      case "vscodeDark":
        setTheme(vscodeDark)
        break
      case "okaidia":
        setTheme(okaidia)
        break
      default:
        setTheme(githubDark)
    }
  }, [currentTheme])

  return (
    <div className="h-full w-full">
      <CodeMirror
        value={currentCode}
        height="100%"
        theme={theme}
        extensions={[
          language,
          indentUnit.of("        "),
          EditorState.tabSize.of(8),
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
  )
}

export default CodeEditor
