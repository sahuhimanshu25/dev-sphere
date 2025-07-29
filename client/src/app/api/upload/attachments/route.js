import { NextResponse } from "next/server"
import { writeFile, mkdir, unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB for attachments
const ALLOWED_TYPES = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  // Archives
  "application/zip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  // Audio/Video
  "audio/mpeg",
  "audio/wav",
  "video/mp4",
  "video/avi",
  "video/mov",
]

// Security: File type validation based on file signature (magic numbers)
const FILE_SIGNATURES = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e],
  "application/pdf": [0x25, 0x50, 0x44, 0x46],
  "application/zip": [0x50, 0x4b, 0x03, 0x04],
}

function validateFileSignature(buffer, mimeType) {
  const signature = FILE_SIGNATURES[mimeType]
  if (!signature) return true // Skip validation for unknown types

  for (let i = 0; i < signature.length; i++) {
    if (buffer[i] !== signature[i]) {
      return false
    }
  }
  return true
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const category = formData.get("category") || "general"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 50MB." }, { status: 400 })
    }

    // Convert file to buffer for signature validation
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate file signature for security
    if (!validateFileSignature(buffer, file.type)) {
      return NextResponse.json({ error: "File signature does not match declared type" }, { status: 400 })
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads", "attachments", category)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split(".").pop()
    const filename = `${timestamp}_${randomString}.${extension}`
    const filepath = join(uploadDir, filename)

    // Save file
    await writeFile(filepath, buffer)

    // Return success response with file URL
    const fileUrl = `/uploads/attachments/${category}/${filename}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      category,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Attachment upload error:", error)
    return NextResponse.json({ error: "Failed to upload attachment" }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    // In a real app, you would fetch attachments from the database
    return NextResponse.json({
      success: true,
      message: "Attachments endpoint is working",
      category,
    })
  } catch (error) {
    console.error("GET attachments error:", error)
    return NextResponse.json({ error: "Failed to get attachments" }, { status: 500 })
  }
}

// Handle attachment deletion
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")
    const category = searchParams.get("category") || "general"

    if (!filename) {
      return NextResponse.json({ error: "No filename provided" }, { status: 400 })
    }

    const filepath = join(process.cwd(), "public", "uploads", "attachments", category, filename)

    if (existsSync(filepath)) {
      await unlink(filepath)
      return NextResponse.json({
        success: true,
        message: "Attachment deleted successfully",
      })
    } else {
      return NextResponse.json({ error: "Attachment not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Delete attachment error:", error)
    return NextResponse.json({ error: "Failed to delete attachment" }, { status: 500 })
  }
}
