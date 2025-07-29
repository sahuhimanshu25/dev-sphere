"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { Typewriter } from "react-simple-typewriter"
import { FiCode, FiUsers, FiMessageCircle, FiZap, FiGithub, FiTwitter, FiLinkedin, FiArrowRight } from "react-icons/fi"
import Sidebar from "../components/navigation/Sidebar"

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { isAuthorized } = useSelector((state) => state.auth)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      icon: FiCode,
      title: "Online Compiler",
      description: "Write, compile, and run code in multiple programming languages with our powerful online IDE.",
      color: "from-purple-500 to-blue-500",
    },
    {
      icon: FiUsers,
      title: "Developer Community",
      description: "Connect with fellow developers, share knowledge, and collaborate on exciting projects.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FiMessageCircle,
      title: "Real-time Chat",
      description: "Communicate instantly with other developers through our integrated chat system.",
      color: "from-cyan-500 to-green-500",
    },
    {
      icon: FiZap,
      title: "Lightning Fast",
      description: "Experience blazing-fast compilation and execution with our optimized infrastructure.",
      color: "from-green-500 to-yellow-500",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">DevSphere</h1>
          <p className="text-gray-300 mb-8">Welcome to DevSphere</p>
          <div className="spinner w-8 h-8 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Sidebar />

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-6xl md:text-8xl font-bold mb-6">
                <span className="gradient-text">Dev</span>
                <span className="text-white">Sphere</span>
              </h1>
              <div className="text-xl md:text-2xl text-gray-300 mb-8 h-16">
                <Typewriter
                  words={[
                    "Code. Compile. Debug.",
                    "Connect. Collaborate. Create.",
                    "Build the future together.",
                    "Your coding journey starts here.",
                  ]}
                  loop={0}
                  cursor
                  cursorStyle="_"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <motion.button
                className="btn-futuristic text-lg px-8 py-4 flex items-center justify-center space-x-2"
                onClick={() => router.push(isAuthorized ? "/compile" : "/login")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiCode size={20} />
                <span>Start Coding</span>
                <FiArrowRight size={16} />
              </motion.button>

              <motion.button
                className="glass rounded-xl px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
                onClick={() => router.push("/community")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiUsers size={20} />
                <span>Join Community</span>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {[
                { number: "10K+", label: "Developers" },
                { number: "50K+", label: "Code Executions" },
                { number: "24/7", label: "Support" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="glass rounded-2xl p-6 text-center"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="gradient-text">Powerful Features</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Everything you need to code, collaborate, and create amazing projects
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="glass rounded-2xl p-8 card-hover group"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="glass rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to <span className="gradient-text">Start Coding?</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of developers who are already using DevSphere to build amazing projects
              </p>
              <motion.button
                className="btn-futuristic text-xl px-12 py-6 flex items-center justify-center space-x-3 mx-auto"
                onClick={() => router.push(isAuthorized ? "/compile" : "/register")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiCode size={24} />
                <span>{isAuthorized ? "Go to Compiler" : "Get Started Free"}</span>
                <FiArrowRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-6 md:mb-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <FiCode className="text-white" size={20} />
                </div>
                <div>
                  <span className="text-xl font-bold gradient-text">DevSphere</span>
                  <p className="text-sm text-gray-400">Code. Compile. Debug.</p>
                </div>
              </div>

              <div className="flex space-x-6">
                {[
                  { icon: FiGithub, href: "#" },
                  { icon: FiTwitter, href: "#" },
                  { icon: FiLinkedin, href: "#" },
                ].map((social, index) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon size={20} className="text-gray-400" />
                    </motion.a>
                  )
                })}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
              <p>&copy; 2024 DevSphere. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default HomePage
