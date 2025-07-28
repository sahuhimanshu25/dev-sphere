"use client"

import { useState } from "react"
import Layout from "../components/Layout"
import ChatSidebar from "../components/ChatSidebar"
import ChatWindow from "../components/ChatWindow"
import { chatUsers } from "../lib/dummyData"

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(chatUsers[0])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = chatUsers.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex">
        <ChatSidebar
          users={filteredUsers}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <ChatWindow user={selectedUser} />
      </div>
    </Layout>
  )
}
