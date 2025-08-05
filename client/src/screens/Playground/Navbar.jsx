"use client"
import { useRouter } from "next/navigation"

const Navbar = ({ isFullScreen }) => {
  const router = useRouter()

  return (
    <div
      className={`h-18 flex items-center justify-center transition-all duration-300 ease-in-out glass-effect ${isFullScreen ? "h-0" : ""}`}
    >
      <button
        className="bg-transparent border-none flex items-center justify-center gap-4 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <h1 className="text-3xl font-normal text-primary flex items-center justify-center gap-1">
          <span className="font-bold ml-2 text-white">Dev</span>
          <span>Sphere</span>
        </h1>
      </button>
    </div>
  )
}

export default Navbar
