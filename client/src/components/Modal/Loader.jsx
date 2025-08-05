"use client"

const Loader = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
      </div>
    </div>
  )
}

export default Loader
