"use client"

import { useState } from "react"
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

export default function BatchImageEditor({ files, onSave, onCancel }) {
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedFilter, setSelectedFilter] = useState("original")
  const [quality, setQuality] = useState(90)
  const [format, setFormat] = useState("image/jpeg")
  const [processedFiles, setProcessedFiles] = useState([])

  const processBatch = async () => {
    setProcessing(true)
    setProgress(0)
    const processed = []

    for (let i = 0; i < files.length; i++) {
      try {
        const editor = new ImageEditorClass()
        await editor.loadImage(files[i])

        if (selectedFilter !== "original") {
          editor.applyFilter(selectedFilter)
        }

        const blob = await editor.exportImage(format, quality / 100)
        const processedFile = new File([blob], files[i].name, { type: format })
        processed.push(processedFile)

        setProgress(((i + 1) / files.length) * 100)
      } catch (error) {
        console.error(`Failed to process ${files[i].name}:`, error)
      }
    }

    setProcessedFiles(processed)
    setProcessing(false)
  }

  const downloadAll = () => {
    processedFiles.forEach((file, index) => {
      const url = URL.createObjectURL(file)
      const a = document.createElement("a")
      a.href = url
      a.download = `batch_${index + 1}_${file.name}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }

  const saveAll = () => {
    onSave(processedFiles)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Batch Image Editor</h2>
          <span className="text-gray-300">{files.length} images</span>
        </div>

        <div className="p-6 space-y-6">
          {/* Filter Selection */}
          <div>
            <h3 className="text-white font-medium mb-3">Select Filter</h3>
            <div className="grid grid-cols-3 gap-2">
              {FILTER_PRESETS.map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => setSelectedFilter(filter.name)}
                  disabled={processing}
                  className={`p-2 rounded text-sm ${
                    selectedFilter === filter.name
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  } disabled:opacity-50`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quality Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Quality: {quality}%</label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number.parseInt(e.target.value))}
                disabled={processing}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                disabled={processing}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
              >
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>
          </div>

          {/* Progress */}
          {processing && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Processing...</span>
                <span className="text-gray-300">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* File List */}
          <div>
            <h3 className="text-white font-medium mb-3">Files to Process</h3>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded text-sm">
                  <span className="text-gray-300 truncate">{file.name}</span>
                  <span className="text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          {processedFiles.length > 0 && (
            <div>
              <h3 className="text-white font-medium mb-3">Processed Files</h3>
              <div className="flex items-center justify-between p-3 bg-green-900 bg-opacity-50 rounded">
                <span className="text-green-300">{processedFiles.length} files processed successfully</span>
                <button
                  onClick={downloadAll}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Download All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700">
          <button
            onClick={onCancel}
            disabled={processing}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>
          <div className="flex space-x-2">
            {processedFiles.length === 0 ? (
              <button
                onClick={processBatch}
                disabled={processing}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {processing ? "Processing..." : "Process Images"}
              </button>
            ) : (
              <button onClick={saveAll} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Save All to Upload
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
