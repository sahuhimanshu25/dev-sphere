// File upload utilities and validation
export const FILE_TYPES = {
  IMAGE: {
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    mimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  AVATAR: {
    extensions: [".jpg", ".jpeg", ".png", ".webp"],
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    maxSize: 2 * 1024 * 1024, // 2MB
  },
  DOCUMENT: {
    extensions: [".pdf", ".doc", ".docx", ".txt", ".md"],
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/markdown",
    ],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  CODE: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".cpp", ".c", ".html", ".css", ".json"],
    mimeTypes: ["text/plain", "application/javascript", "text/html", "text/css", "application/json"],
    maxSize: 1 * 1024 * 1024, // 1MB
  },
}

export const validateFile = (file, type = "IMAGE") => {
  const config = FILE_TYPES[type]
  const errors = []

  if (!file) {
    errors.push("No file selected")
    return { isValid: false, errors }
  }

  // Check file size
  if (file.size > config.maxSize) {
    errors.push(`File size must be less than ${formatFileSize(config.maxSize)}`)
  }

  // Check file type
  const fileExtension = "." + file.name.split(".").pop().toLowerCase()
  if (!config.extensions.includes(fileExtension)) {
    errors.push(`File type must be one of: ${config.extensions.join(", ")}`)
  }

  // Check MIME type
  if (!config.mimeTypes.includes(file.type)) {
    errors.push("Invalid file format")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const generateFileName = (originalName, userId, type = "file") => {
  const timestamp = Date.now()
  const extension = originalName.split(".").pop()
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_").substring(0, 50)

  return `${type}/${userId}/${timestamp}_${sanitizedName}`
}

export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("File is not an image"))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const resizeImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(resolve, file.type, quality)
    }

    img.src = URL.createObjectURL(file)
  })
}

export const cropImageToSquare = (file, size = 400) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      const { width, height } = img
      const minDimension = Math.min(width, height)

      // Calculate crop position (center crop)
      const cropX = (width - minDimension) / 2
      const cropY = (height - minDimension) / 2

      canvas.width = size
      canvas.height = size

      // Draw cropped and resized image
      ctx.drawImage(img, cropX, cropY, minDimension, minDimension, 0, 0, size, size)

      canvas.toBlob(resolve, file.type, 0.9)
    }

    img.src = URL.createObjectURL(file)
  })
}
