import { NextResponse } from "next/server"
import { writeFile, mkdir, unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB for avatars
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const userId = formData.get("userId") // In a real app, get from auth

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed for avatars." },
        { status: 400 },
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size for avatars is 5MB." }, { status: 400 })
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads", "avatars")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const filename = `avatar_${userId || "user"}_${timestamp}.${extension}`
    const filepath = join(uploadDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return success response with file URL
    const fileUrl = `/uploads/avatars/${filename}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      isAvatar: true,
    })
  } catch (error) {
    console.error("Avatar upload error:", error)
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // In a real app, you would fetch the user's current avatar from the database
    // For now, just return a placeholder response
    return NextResponse.json({
      success: true,
      message: "Avatar endpoint is working",
      userId,
    })
  } catch (error) {
    console.error("GET avatar error:", error)
    return NextResponse.json({ error: "Failed to get avatar" }, { status: 500 })
  }
}

// Handle avatar deletion
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")
    const userId = searchParams.get("userId")

    if (!filename) {
      return NextResponse.json({ error: "No filename provided" }, { status: 400 })
    }

    // In a real app, verify that the user owns this avatar
    const filepath = join(process.cwd(), "public", "uploads", "avatars", filename)

    if (existsSync(filepath)) {
      await unlink(filepath)
      return NextResponse.json({
        success: true,
        message: "Avatar deleted successfully",
      })
    } else {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Delete avatar error:", error)
    return NextResponse.json({ error: "Failed to delete avatar" }, { status: 500 })
  }
}
