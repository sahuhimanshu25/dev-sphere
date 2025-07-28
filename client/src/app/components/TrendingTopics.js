"use client"

export default function TrendingTopics({ topics }) {
  return (
    <div className="space-y-3">
      {topics.map((topic, index) => (
        <div
          key={topic.id}
          className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <div className="text-gray-400 font-bold text-sm">#{index + 1}</div>
            <div>
              <p className="font-medium text-white group-hover:text-blue-400 transition-colors">{topic.name}</p>
              <p className="text-xs text-gray-400">{topic.posts.toLocaleString()} posts</p>
            </div>
          </div>
          <div className="text-2xl">{topic.emoji}</div>
        </div>
      ))}
    </div>
  )
}
