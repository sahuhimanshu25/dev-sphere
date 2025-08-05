"use client"
import { createContext, useState, useEffect } from "react"

// Generate a simple UUID function since we don't have the uuid package
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const PlaygroundContext = createContext()

export const languageMap = {
  cpp: {
    id: 54,
    defaultCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}`,
  },
  java: {
    id: 62,
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
  },
  python: {
    id: 71,
    defaultCode: `print("Hello World!")`,
  },
  javascript: {
    id: 63,
    defaultCode: `console.log("Hello World!");`,
  },
}

const PlaygroundProvider = ({ children }) => {
  const initialItems = {
    [generateId()]: {
      title: "DSA",
      playgrounds: {
        [generateId()]: {
          title: "Stack Implementation",
          language: "cpp",
          code: languageMap["cpp"].defaultCode,
        },
        [generateId()]: {
          title: "Binary Search",
          language: "java",
          code: languageMap["java"].defaultCode,
        },
      },
    },
    [generateId()]: {
      title: "Web Dev",
      playgrounds: {
        [generateId()]: {
          title: "React Component",
          language: "javascript",
          code: languageMap["javascript"].defaultCode,
        },
      },
    },
  }

  const [folders, setFolders] = useState(() => {
    if (typeof window !== "undefined") {
      const localData = localStorage.getItem("playgrounds-data")
      return localData ? JSON.parse(localData) : initialItems
    }
    return initialItems
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("playgrounds-data", JSON.stringify(folders))
    }
  }, [folders])

  const deleteFolder = (folderId) => {
    setFolders((oldState) => {
      const newState = { ...oldState }
      delete newState[folderId]
      return newState
    })
  }

  const deleteCard = (folderId, cardId) => {
    setFolders((oldState) => {
      const newState = { ...oldState }
      delete newState[folderId].playgrounds[cardId]
      return newState
    })
  }

  const addFolder = (folderName) => {
    setFolders((oldState) => {
      const newState = { ...oldState }
      newState[generateId()] = {
        title: folderName,
        playgrounds: {},
      }
      return newState
    })
  }

  const addPlayground = (folderId, playgroundName, language) => {
    setFolders((oldState) => {
      const newState = { ...oldState }
      newState[folderId].playgrounds[generateId()] = {
        title: playgroundName,
        language: language,
        code: languageMap[language].defaultCode,
      }
      return newState
    })
  }

  const addPlaygroundAndFolder = (folderName, playgroundName, cardLanguage) => {
    setFolders((oldState) => {
      const newState = { ...oldState }
      const newFolderId = generateId()
      newState[newFolderId] = {
        title: folderName,
        playgrounds: {
          [generateId()]: {
            title: playgroundName,
            language: cardLanguage,
            code: languageMap[cardLanguage].defaultCode,
          },
        },
      }
      return newState
    })
  }

  const editFolderTitle = (folderId, folderName) => {
    setFolders((oldState) => {
      const newState = { ...oldState }
      newState[folderId].title = folderName
      return newState
    })
  }

  const editPlaygroundTitle = (folderId, cardId, playgroundName) => {
    setFolders((oldState) => {
      const newState = { ...oldState }
      newState[folderId].playgrounds[cardId].title = playgroundName
      return newState
    })
  }

  const savePlayground = (folderId, cardId, newCode, newLanguage) => {
    setFolders((oldState) => {
      const newState = { ...oldState }
      newState[folderId].playgrounds[cardId].code = newCode
      newState[folderId].playgrounds[cardId].language = newLanguage
      return newState
    })
  }

  const PlaygroundFeatures = {
    folders,
    deleteFolder,
    deleteCard,
    addFolder,
    addPlayground,
    addPlaygroundAndFolder,
    editFolderTitle,
    editPlaygroundTitle,
    savePlayground,
  }

  return <PlaygroundContext.Provider value={PlaygroundFeatures}>{children}</PlaygroundContext.Provider>
}

export default PlaygroundProvider
