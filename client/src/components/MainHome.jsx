"use client"
import Link from "next/link"
import { ArrowRight, Code, Users, Zap, Star, Github, Twitter } from "lucide-react"

const MainHome = () => {
  const features = [
    {
      icon: Code,
      title: "Advanced Code Editor",
      description: "Multi-language support with syntax highlighting and intelligent autocomplete",
    },
    {
      icon: Zap,
      title: "Instant Compilation",
      description: "Real-time code execution with lightning-fast compilation across multiple languages",
    },
    {
      icon: Users,
      title: "Developer Community",
      description: "Connect, collaborate, and share knowledge with developers worldwide",
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Clean background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900/20" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-4">
              <span className="text-white">Dev</span>
              <span className="text-gradient">Sphere</span>
            </h1>
            <div className="flex items-center justify-center space-x-2 text-primary-300">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
          </div>

          {/* Tagline */}
          <div className="mb-12">
            <p className="text-2xl md:text-3xl lg:text-4xl text-gray-300 mb-6 font-light leading-relaxed">
              The ultimate platform for developers to
            </p>
            <div className="text-3xl md:text-4xl lg:text-5xl font-semibold">
              <span className="text-gradient-accent">Code.</span> <span className="text-gradient">Compile.</span>{" "}
              <span className="text-gradient-accent">Connect.</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              href="/compile"
              className="group relative px-8 py-4 bg-gradient-primary text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-glow-lg overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>Start Coding</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>

            <Link
              href="/login"
              className="group px-8 py-4 glass-effect text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-glass-lg border border-white/20 hover:border-primary-400/50"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Join Community</span>
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="group glass-card rounded-2xl p-8 hover-lift card-interactive">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 p-4 rounded-2xl bg-gradient-primary/20 group-hover:bg-gradient-primary/30 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12 mb-16">
            {[
              { number: "10K+", label: "Developers" },
              { number: "50K+", label: "Code Executions" },
              { number: "25+", label: "Languages" },
              { number: "99.9%", label: "Uptime" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className="p-3 glass-effect rounded-xl hover:scale-110 transition-all duration-300 hover:shadow-glow"
            >
              <Github className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
            </a>
            <a
              href="#"
              className="p-3 glass-effect rounded-xl hover:scale-110 transition-all duration-300 hover:shadow-glow"
            >
              <Twitter className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
            </a>
          </div>
        </div>

        {/* Simple scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainHome
