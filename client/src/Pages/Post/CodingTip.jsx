"use client"

import { useState, useEffect } from "react"
import { FaCode, FaLightbulb } from "react-icons/fa"
import "./CodingTip.css"

function CodingTip() {
  const [currentTip, setCurrentTip] = useState(0)

  const codingTips = [
    {
      title: "Clean Code",
      tip: "Write code as if the person who ends up maintaining it is a violent psychopath who knows where you live.",
      author: "Martin Fowler",
    },
    {
      title: "DRY Principle",
      tip: "Don't Repeat Yourself. Every piece of knowledge must have a single, unambiguous representation within a system.",
      author: "Andy Hunt",
    },
    {
      title: "Debugging",
      tip: "If debugging is the process of removing bugs, then programming must be the process of putting them in.",
      author: "Edsger Dijkstra",
    },
    {
      title: "Code Comments",
      tip: "Code tells you how, comments tell you why. Write comments that explain the reasoning behind your decisions.",
      author: "Jeff Atwood",
    },
    {
      title: "Performance",
      tip: "Premature optimization is the root of all evil. Focus on writing clear, correct code first.",
      author: "Donald Knuth",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % codingTips.length)
    }, 10000) // Change tip every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % codingTips.length)
  }

  return (
    <div className="coding-tip-card">
      <div className="tip-header">
        <div className="tip-icon">
          <FaLightbulb />
        </div>
        <h3>Coding Tip of the Day</h3>

      </div>

      <div className="tip-content">
        <div className="tip-category">
          <FaCode />
          <span>{codingTips[currentTip].title}</span>
        </div>

        <p className="tip-text">{codingTips[currentTip].tip}</p>

        <div className="tip-author">— {codingTips[currentTip].author}</div>
      </div>

      <div className="tip-indicators">
        {codingTips.map((_, index) => (
          <div
            key={index}
            className={`indicator ${index === currentTip ? "active" : ""}`}
            onClick={() => setCurrentTip(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default CodingTip
