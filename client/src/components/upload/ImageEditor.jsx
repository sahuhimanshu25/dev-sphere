"use client"

import { useState, useRef, useEffect } from "react"
import { ImageEditor as ImageEditorClass } from "@/utils/imageEditor"

const FILTER_PRESETS = [
  { name: "original", label: "Original" },
  { name: "grayscale", label: "Grayscale" },
  { name: "sepia", label: "Sepia" },
  { name: "vintage", label: "Vintage" },
  { name: "cool", label: "Cool" },
  { name: "warm", label: "Warm" },
  { name: "dramatic", label: "Dramatic" },
  { name: "soft", label: "Soft" },
  { name: "vibrant", label: "Vibrant" },
  { name: "noir", label: "Noir" },
  { name: "sunset", label: "Sunset" },
  { name: "ocean", label: "Ocean" },
]

export default function ImageEditor({ file, onSave, onCancel }) {
  const canvasRef = useRef(null)
  const editorRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("filters")
  const [selectedFilter, setSelectedFilter] = useState("original")
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 1,
  })
  const [cropMode, setCropMode] = useState(false)
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  useEffect(() => {
    initializeEditor()
  }, [file])

  const initializeEditor = async () => {
    try {
      setLoading(true)
      editorRef.current = new ImageEditorClass()
      const canvas = await editorRef.current.loadImage(file)

      if (canvasRef.current) {
        const displayCanvas = canvasRef.current
        displayCanvas.width = canvas.width
        displayCanvas.height = canvas.height
        const ctx = displayCanvas.getContext("2d")
        ctx.drawImage(canvas, 0, 0)
      }

      updateHistoryButtons()
      setLoading(false)
    } catch (error) {
      console.error("Failed to load image:", error)
      setLoading(false)
    }
  }

  const updateHistoryButtons = () => {
    if (editorRef.current) {
      setCanUndo(editorRef.current.historyIndex > 0)
      setCanRedo(editorRef.current.historyIndex < editorRef.current.history.length - 1)
    }
  }

  const updateCanvas = () => {
    if (editorRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      ctx.drawImage(editorRef.current.canvas, 0, 0)
      updateHistoryButtons()
    }
  }

  const handleFilterChange = (filterName) => {
    if (editorRef.current) {
      editorRef.current.applyFilter(filterName)
      setSelectedFilter(filterName)
      updateCanvas()
    }
  }

  const handleAdjustmentChange = (type, value) => {
    if (!editorRef.current) return

    const newAdjustments = { ...adjustments, [type]: value }
    setAdjustments(newAdjustments)

    // Reset to original and apply all adjustments
    editorRef.current.reset()

    if (newAdjustments.brightness !== 0) {
      editorRef.current.adjustBrightness(newAdjustments.brightness)
    }
    if (newAdjustments.contrast !== 0) {
      editorRef.current.adjustContrast(newAdjustments.contrast)
    }
    if (newAdjustments.saturation !== 1) {
      editorRef.current.adjustSaturation(newAdjustments.saturation)
    }

    updateCanvas()
  }

  const handleRotate = (degrees) => {
    if (editorRef.current) {
      editorRef.current.rotate(degrees)

      // Update canvas dimensions
      canvasRef.current.width = editorRef.current.canvas.width
      canvasRef.current.height = editorRef.current.canvas.height

      updateCanvas()
    }
  }

  const handleFlip = (direction) => {
    if (editorRef.current) {
      editorRef.current.flip(direction)
      updateCanvas()
    }
  }

  const handleCrop = () => {
    if (editorRef.current && cropArea.width > 0 && cropArea.height > 0) {
      editorRef.current.crop(cropArea.x, cropArea.y, cropArea.width, cropArea.height)

      // Update canvas dimensions
      canvasRef.current.width = cropArea.width
      canvasRef.current.height = cropArea.height

      updateCanvas()
      setCropMode(false)
      setCropArea({ x: 0, y: 0, width: 0, height: 0 })
    }
  }

  const handleUndo = () => {
    if (editorRef.current && editorRef.current.undo()) {
      updateCanvas()
    }
  }

  const handleRedo = () => {
    if (editorRef.current && editorRef.current.redo()) {
      updateCanvas()
    }
  }

  const handleReset = () => {
    if (editorRef.current) {
      editorRef.current.reset()
      setSelectedFilter("original")
      setAdjustments({ brightness: 0, contrast: 0, saturation: 1 })
      updateCanvas()
    }
  }

  const handleSave = async () => {
    if (editorRef.current) {
      try {
        const blob = await editorRef.current.exportImage("image/png", 0.9)
        const editedFile = new File([blob], file.name, { type: "image/png" })
        onSave(editedFile)
      } catch (error) {
        console.error("Failed to save image:", error)
      }
    }
  }

  const handleDownload = async () => {
    if (editorRef.current) {
      try {
        const blob = await editorRef.current.exportImage("image/png", 0.9)
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `edited_${file.name}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error("Failed to download image:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4">Loading image editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Image Editor</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Undo
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Redo
            </button>
            <button onClick={handleReset} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 bg-gray-900 p-4 overflow-y-auto">
            {/* Tabs */}
            <div className="flex space-x-2 mb-4">
              {["filters", "adjust", "transform"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded text-sm font-medium capitalize ${
                    activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Filters Tab */}
            {activeTab === "filters" && (
              <div className="space-y-2">
                <h3 className="text-white font-medium mb-3">Filter Presets</h3>
                <div className="grid grid-cols-2 gap-2">
                  {FILTER_PRESETS.map((filter) => (
                    <button
                      key={filter.name}
                      onClick={() => handleFilterChange(filter.name)}
                      className={`p-2 rounded text-sm ${
                        selectedFilter === filter.name
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Adjustments Tab */}
            {activeTab === "adjust" && (
              <div className="space-y-4">
                <h3 className="text-white font-medium mb-3">Manual Adjustments</h3>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Brightness: {adjustments.brightness}</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.brightness}
                    onChange={(e) => handleAdjustmentChange("brightness", Number.parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Contrast: {adjustments.contrast}</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.contrast}
                    onChange={(e) => handleAdjustmentChange("contrast", Number.parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Saturation: {adjustments.saturation.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={adjustments.saturation}
                    onChange={(e) => handleAdjustmentChange("saturation", Number.parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Transform Tab */}
            {activeTab === "transform" && (
              <div className="space-y-4">
                <h3 className="text-white font-medium mb-3">Transform</h3>

                <div>
                  <h4 className="text-gray-300 text-sm mb-2">Rotate</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRotate(-90)}
                      className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                    >
                      ↺ 90°
                    </button>
                    <button
                      onClick={() => handleRotate(90)}
                      className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                    >
                      ↻ 90°
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-gray-300 text-sm mb-2">Flip</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleFlip("horizontal")}
                      className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                    >
                      ↔ Horizontal
                    </button>
                    <button
                      onClick={() => handleFlip("vertical")}
                      className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                    >
                      ↕ Vertical
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-gray-300 text-sm mb-2">Crop</h4>
                  <button
                    onClick={() => setCropMode(!cropMode)}
                    className={`px-3 py-2 rounded text-sm ${
                      cropMode ? "bg-red-600 text-white" : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    {cropMode ? "Cancel Crop" : "Enable Crop"}
                  </button>
                  {cropMode && (
                    <button
                      onClick={handleCrop}
                      className="ml-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Apply Crop
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center bg-gray-700 p-4">
            <div className="relative max-w-full max-h-full">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full border border-gray-600 rounded"
                style={{ maxHeight: "calc(100vh - 200px)" }}
              />
              {cropMode && (
                <div className="absolute inset-0 cursor-crosshair">{/* Crop overlay would be implemented here */}</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <button onClick={handleDownload} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
              Download
            </button>
          </div>
          <div className="flex space-x-2">
            <button onClick={onCancel} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
