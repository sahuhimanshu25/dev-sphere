// Image editing utilities for filters, cropping, and transformations
export class ImageEditor {
  constructor() {
    this.canvas = null
    this.ctx = null
    this.originalImageData = null
    this.currentImageData = null
    this.history = []
    this.historyIndex = -1
  }

  // Initialize canvas with image
  async loadImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        this.canvas = document.createElement("canvas")
        this.ctx = this.canvas.getContext("2d")

        this.canvas.width = img.width
        this.canvas.height = img.height

        this.ctx.imageSmoothingEnabled = true
        this.ctx.imageSmoothingQuality = "high"
        this.ctx.drawImage(img, 0, 0)

        this.originalImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        this.currentImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)

        this.saveState()
        resolve(this.canvas)
      }

      img.onerror = reject

      if (file instanceof File) {
        const reader = new FileReader()
        reader.onload = (e) => {
          img.src = e.target.result
        }
        reader.readAsDataURL(file)
      } else {
        img.src = file
      }
    })
  }

  // Save current state to history
  saveState() {
    this.historyIndex++
    this.history = this.history.slice(0, this.historyIndex)
    this.history.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height))

    // Limit history to 20 states
    if (this.history.length > 20) {
      this.history.shift()
      this.historyIndex--
    }
  }

  // Undo last action
  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--
      const imageData = this.history[this.historyIndex]
      this.ctx.putImageData(imageData, 0, 0)
      this.currentImageData = imageData
      return true
    }
    return false
  }

  // Redo last undone action
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++
      const imageData = this.history[this.historyIndex]
      this.ctx.putImageData(imageData, 0, 0)
      this.currentImageData = imageData
      return true
    }
    return false
  }

  // Apply CSS filters
  applyFilter(filterName) {
    const filters = {
      original: "none",
      grayscale: "grayscale(100%)",
      sepia: "sepia(100%)",
      vintage: "sepia(50%) contrast(120%) brightness(110%)",
      cool: "hue-rotate(180deg) saturate(120%)",
      warm: "hue-rotate(30deg) saturate(120%) brightness(110%)",
      dramatic: "contrast(150%) brightness(90%) saturate(130%)",
      soft: "blur(1px) brightness(110%) contrast(90%)",
      vibrant: "saturate(200%) contrast(120%)",
      noir: "grayscale(100%) contrast(150%) brightness(90%)",
      sunset: "hue-rotate(15deg) saturate(150%) brightness(105%)",
      ocean: "hue-rotate(200deg) saturate(130%) brightness(95%)",
    }

    const tempCanvas = document.createElement("canvas")
    const tempCtx = tempCanvas.getContext("2d")
    tempCanvas.width = this.canvas.width
    tempCanvas.height = this.canvas.height

    tempCtx.filter = filters[filterName] || "none"
    tempCtx.drawImage(this.canvas, 0, 0)

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(tempCanvas, 0, 0)

    this.saveState()
  }

  // Adjust brightness
  adjustBrightness(value) {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] + value)) // Red
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + value)) // Green
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + value)) // Blue
    }

    this.ctx.putImageData(imageData, 0, 0)
    this.saveState()
  }

  // Adjust contrast
  adjustContrast(value) {
    const factor = (259 * (value + 255)) / (255 * (259 - value))
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128))
      data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128))
      data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128))
    }

    this.ctx.putImageData(imageData, 0, 0)
    this.saveState()
  }

  // Adjust saturation
  adjustSaturation(value) {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      const gray = 0.299 * r + 0.587 * g + 0.114 * b

      data[i] = Math.min(255, Math.max(0, gray + value * (r - gray)))
      data[i + 1] = Math.min(255, Math.max(0, gray + value * (g - gray)))
      data[i + 2] = Math.min(255, Math.max(0, gray + value * (b - gray)))
    }

    this.ctx.putImageData(imageData, 0, 0)
    this.saveState()
  }

  // Rotate image
  rotate(degrees) {
    const tempCanvas = document.createElement("canvas")
    const tempCtx = tempCanvas.getContext("2d")

    if (degrees === 90 || degrees === 270) {
      tempCanvas.width = this.canvas.height
      tempCanvas.height = this.canvas.width
    } else {
      tempCanvas.width = this.canvas.width
      tempCanvas.height = this.canvas.height
    }

    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2)
    tempCtx.rotate((degrees * Math.PI) / 180)
    tempCtx.drawImage(this.canvas, -this.canvas.width / 2, -this.canvas.height / 2)

    this.canvas.width = tempCanvas.width
    this.canvas.height = tempCanvas.height
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(tempCanvas, 0, 0)

    this.saveState()
  }

  // Flip image
  flip(direction) {
    const tempCanvas = document.createElement("canvas")
    const tempCtx = tempCanvas.getContext("2d")
    tempCanvas.width = this.canvas.width
    tempCanvas.height = this.canvas.height

    tempCtx.translate(
      direction === "horizontal" ? this.canvas.width : 0,
      direction === "vertical" ? this.canvas.height : 0,
    )
    tempCtx.scale(direction === "horizontal" ? -1 : 1, direction === "vertical" ? -1 : 1)
    tempCtx.drawImage(this.canvas, 0, 0)

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(tempCanvas, 0, 0)

    this.saveState()
  }

  // Crop image
  crop(x, y, width, height) {
    const tempCanvas = document.createElement("canvas")
    const tempCtx = tempCanvas.getContext("2d")
    tempCanvas.width = width
    tempCanvas.height = height

    tempCtx.drawImage(this.canvas, x, y, width, height, 0, 0, width, height)

    this.canvas.width = width
    this.canvas.height = height
    this.ctx.clearRect(0, 0, width, height)
    this.ctx.drawImage(tempCanvas, 0, 0)

    this.saveState()
  }

  // Resize image
  resize(newWidth, newHeight) {
    const tempCanvas = document.createElement("canvas")
    const tempCtx = tempCanvas.getContext("2d")
    tempCanvas.width = newWidth
    tempCanvas.height = newHeight

    tempCtx.imageSmoothingEnabled = true
    tempCtx.imageSmoothingQuality = "high"
    tempCtx.drawImage(this.canvas, 0, 0, newWidth, newHeight)

    this.canvas.width = newWidth
    this.canvas.height = newHeight
    this.ctx.clearRect(0, 0, newWidth, newHeight)
    this.ctx.drawImage(tempCanvas, 0, 0)

    this.saveState()
  }

  // Export image as blob
  async exportImage(format = "image/png", quality = 0.9) {
    return new Promise((resolve) => {
      this.canvas.toBlob(resolve, format, quality)
    })
  }

  // Get canvas data URL
  getDataURL(format = "image/png", quality = 0.9) {
    return this.canvas.toDataURL(format, quality)
  }

  // Reset to original image
  reset() {
    this.ctx.putImageData(this.originalImageData, 0, 0)
    this.history = [this.originalImageData]
    this.historyIndex = 0
    this.saveState()
  }
}

// Utility functions
export const createImageFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject

    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export const resizeImage = (file, maxWidth, maxHeight, quality = 0.9) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      const { width, height } = img
      const ratio = Math.min(maxWidth / width, maxHeight / height)

      canvas.width = width * ratio
      canvas.height = height * ratio

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(resolve, "image/jpeg", quality)
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}
