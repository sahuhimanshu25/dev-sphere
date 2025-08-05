"use client"
import { useContext } from "react"
import { ModalContext } from "../../context/ModalContext"
import { Plus, Code, Sparkles } from "lucide-react"

const LeftComponent = () => {
  const { openModal } = useContext(ModalContext)

  return (
    <div className="flex-1 p-8 flex justify-center items-center">
      <div className="flex flex-col items-center text-center max-w-lg">
        {/* Clean logo design */}
        <div className="relative mb-8">
          <div className="w-80 h-48 glass-card rounded-3xl p-8 flex items-center justify-center">
            <div className="text-6xl font-bold">
              <span className="text-white">Dev</span>
              <span className="text-gradient">Sphere</span>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="mb-12 space-y-4">
          <div className="text-2xl text-gray-300 font-light tracking-wide">
            <span className="text-gradient-accent">Code.</span> <span className="text-gradient">Compile.</span>{" "}
            <span className="text-gradient-accent">Debug.</span>
          </div>
          <p className="text-gray-400 text-lg">Your ultimate coding playground awaits</p>
        </div>

        {/* Clean CTA Button */}
        <button
          className="group relative px-8 py-4 bg-gradient-primary text-white rounded-2xl font-semibold text-lg transition-all duration-500 hover:scale-110 hover:shadow-glow-lg overflow-hidden"
          onClick={() =>
            openModal({
              show: true,
              modalType: 3,
              identifiers: { folderId: "", cardId: "" },
            })
          }
        >
          <span className="relative z-10 flex items-center space-x-3">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Create New Playground</span>
            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </span>

          {/* Subtle hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>

        {/* Clean feature highlights */}
        <div className="mt-12 grid grid-cols-3 gap-6">
          {[
            { icon: Code, label: "Multi-Language" },
            { icon: Sparkles, label: "AI-Powered" },
            { icon: Plus, label: "Collaborative" },
          ].map((feature, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 group">
              <div className="p-3 glass-card rounded-xl group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-5 h-5 text-primary-400" />
              </div>
              <span className="text-xs text-gray-400 font-medium">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeftComponent
