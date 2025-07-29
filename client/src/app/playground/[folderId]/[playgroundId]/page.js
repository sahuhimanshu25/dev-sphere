"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { savePlayground, setCurrentPlayground } from "@/store/slices/playgroundSlice"
import { openModal } from "@/store/slices/modalSlice"
import Sidebar from "@/components/navigation/Sidebar"
import CodeEditor from "@/components/playground/CodeEditor"
import OutputConsole from "@/components/playground/OutputConsole"
import InputConsole from "@/components/playground/InputConsole"
import PlaygroundNavbar from "@/components/playground/PlaygroundNavbar"
import Loader from "@/components/ui/Loader"
import Modal from "@/components/ui/Modal"

const PlaygroundPage = () => {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch()

  const { folderId, playgroundId } = params
  const { folders } = useSelector((state) => state.playground)
  const { isAuthorized } = useSelector((state) => state.auth)
  const { isOpen } = useSelector((state) => state.modal)

  const [isLoading, setIsLoading] = useState(true)
  const [currentCode, setCurrentCode] = useState("")
  const [currentLanguage, setCurrentLanguage] = useState("javascript")
  const [output, setOutput] = useState("")
  const [input, setInput] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  const playground = folders[folderId]?.playgrounds[playgroundId]
  const folder = folders[folderId]

  useEffect(() => {
    if (!isAuthorized) {
      router.push("/login")
      return
    }

    if (!playground) {
      router.push("/compile")
      return
    }

    // Initialize playground data
    setCurrentCode(playground.code)
    setCurrentLanguage(playground.language)

    dispatch(
      setCurrentPlayground({
        folderId,
        playgroundId,
        playground,
      }),
    )

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isAuthorized, playground, router, dispatch, folderId, playgroundId])

  const handleCodeChange = (newCode) => {
    setCurrentCode(newCode)
    // Auto-save after 2 seconds of inactivity
    const timeoutId = setTimeout(() => {
      dispatch(
        savePlayground({
          folderId,
          playgroundId,
          code: newCode,
          language: currentLanguage,
        }),
      )
    }, 2000)

    return () => clearTimeout(timeoutId)
  }

  const handleLanguageChange = (newLanguage) => {
    setCurrentLanguage(newLanguage)
    dispatch(
      savePlayground({
        folderId,
        playgroundId,
        code: currentCode,
        language: newLanguage,
      }),
    )
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    setOutput("")

    // Show loading modal
    dispatch(
      openModal({
        modalType: 6,
        identifiers: { folderId, cardId: playgroundId },
      }),
    )

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/compiler/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: currentLanguage,
          code: currentCode,
          input: input,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setOutput(result.output || "Code executed successfully!")
      } else {
        setOutput(result.error || "An error occurred while running the code")
      }
    } catch (error) {
      setOutput("Network error: Unable to connect to the compiler service")
    } finally {
      setIsRunning(false)
      // Close loading modal
      setTimeout(() => {
        dispatch(openModal({ modalType: null, identifiers: {} }))
      }, 500)
    }
  }

  if (isLoading) {
    return <Loader fullScreen text="Loading playground..." />
  }

  if (!playground) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Playground not found</h1>
          <button onClick={() => router.push("/compile")} className="btn-futuristic">
            Go back to compiler
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar />

      <div className="lg:ml-64 flex flex-col h-screen">
        {/* Navbar */}
        <PlaygroundNavbar
          playground={playground}
          folder={folder}
          language={currentLanguage}
          onLanguageChange={handleLanguageChange}
          onRunCode={handleRunCode}
          isRunning={isRunning}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Panel - Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col min-h-0"
          >
            <CodeEditor code={currentCode} language={currentLanguage} onChange={handleCodeChange} />
          </motion.div>

          {/* Right Panel - Input/Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-96 flex flex-col border-l border-white/10"
          >
            {/* Input Console */}
            <div className="flex-1 min-h-0">
              <InputConsole input={input} onChange={setInput} />
            </div>

            {/* Output Console */}
            <div className="flex-1 min-h-0">
              <OutputConsole output={output} isRunning={isRunning} language={currentLanguage} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && <Modal />}
    </div>
  )
}

export default PlaygroundPage
