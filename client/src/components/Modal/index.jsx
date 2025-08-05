"use client"
import { useContext, useState } from "react"
import { ModalContext } from "../../context/ModalContext"
import { PlaygroundContext } from "../../context/PlaygroundContext"
import { X } from "lucide-react"

const Modal = () => {
  const { isOpenModal, closeModal } = useContext(ModalContext)
  const { addFolder, addPlayground, addPlaygroundAndFolder, editFolderTitle, editPlaygroundTitle, folders } =
    useContext(PlaygroundContext)

  const [folderTitle, setFolderTitle] = useState("")
  const [playgroundTitle, setPlaygroundTitle] = useState("")
  const [language, setLanguage] = useState("cpp")

  const languageOptions = [
    { value: "cpp", label: "C++" },
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()

    switch (isOpenModal.modalType) {
      case 1: // Create new folder
        if (folderTitle.trim()) {
          addFolder(folderTitle)
          setFolderTitle("")
          closeModal()
        }
        break

      case 2: // Create new playground in existing folder
        if (playgroundTitle.trim()) {
          addPlayground(isOpenModal.identifiers.folderId, playgroundTitle, language)
          setPlaygroundTitle("")
          setLanguage("cpp")
          closeModal()
        }
        break

      case 3: // Create new playground with folder
        if (folderTitle.trim() && playgroundTitle.trim()) {
          addPlaygroundAndFolder(folderTitle, playgroundTitle, language)
          setFolderTitle("")
          setPlaygroundTitle("")
          setLanguage("cpp")
          closeModal()
        }
        break

      case 4: // Edit folder title
        if (folderTitle.trim()) {
          editFolderTitle(isOpenModal.identifiers.folderId, folderTitle)
          setFolderTitle("")
          closeModal()
        }
        break

      case 5: // Edit playground title
        if (playgroundTitle.trim()) {
          editPlaygroundTitle(isOpenModal.identifiers.folderId, isOpenModal.identifiers.cardId, playgroundTitle)
          setPlaygroundTitle("")
          closeModal()
        }
        break

      default:
        closeModal()
    }
  }

  const handleClose = () => {
    setFolderTitle("")
    setPlaygroundTitle("")
    setLanguage("cpp")
    closeModal()
  }

  const getModalContent = () => {
    switch (isOpenModal.modalType) {
      case 1:
        return {
          title: "Create New Folder",
          fields: (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Folder Name</label>
                <input
                  type="text"
                  value={folderTitle}
                  onChange={(e) => setFolderTitle(e.target.value)}
                  placeholder="Enter folder name"
                  className="w-full px-4 py-2 bg-dark-card border border-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>
          ),
        }

      case 2:
        return {
          title: "Create New Playground",
          fields: (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Playground Name</label>
                <input
                  type="text"
                  value={playgroundTitle}
                  onChange={(e) => setPlaygroundTitle(e.target.value)}
                  placeholder="Enter playground name"
                  className="w-full px-4 py-2 bg-dark-card border border-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 bg-dark-card border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-dark-card">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ),
        }

      case 3:
        return {
          title: "Create New Playground",
          fields: (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Folder Name</label>
                <input
                  type="text"
                  value={folderTitle}
                  onChange={(e) => setFolderTitle(e.target.value)}
                  placeholder="Enter folder name"
                  className="w-full px-4 py-2 bg-dark-card border border-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Playground Name</label>
                <input
                  type="text"
                  value={playgroundTitle}
                  onChange={(e) => setPlaygroundTitle(e.target.value)}
                  placeholder="Enter playground name"
                  className="w-full px-4 py-2 bg-dark-card border border-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 bg-dark-card border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-dark-card">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ),
        }

      case 4:
        return {
          title: "Edit Folder",
          fields: (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Folder Name</label>
                <input
                  type="text"
                  value={folderTitle}
                  onChange={(e) => setFolderTitle(e.target.value)}
                  placeholder={folders[isOpenModal.identifiers.folderId]?.title || "Enter new folder name"}
                  className="w-full px-4 py-2 bg-dark-card border border-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>
          ),
        }

      case 5:
        return {
          title: "Edit Playground",
          fields: (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Playground Name</label>
                <input
                  type="text"
                  value={playgroundTitle}
                  onChange={(e) => setPlaygroundTitle(e.target.value)}
                  placeholder={
                    folders[isOpenModal.identifiers.folderId]?.playgrounds[isOpenModal.identifiers.cardId]?.title ||
                    "Enter new playground name"
                  }
                  className="w-full px-4 py-2 bg-dark-card border border-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>
          ),
        }

      case 6:
        return {
          title: "Running Code...",
          fields: (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-gray-300">Please wait while your code is being executed...</p>
            </div>
          ),
          hideButtons: true,
        }

      default:
        return {
          title: "Modal",
          fields: <div>Unknown modal type</div>,
        }
    }
  }

  const modalContent = getModalContent()

  if (!isOpenModal.show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-light border border-primary/30 rounded-xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/20">
          <h2 className="text-xl font-semibold text-white">{modalContent.title}</h2>
          {isOpenModal.modalType !== 6 && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-primary/20"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">{modalContent.fields}</div>

          {/* Footer */}
          {!modalContent.hideButtons && (
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-primary/20">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors duration-200 font-medium"
              >
                {isOpenModal.modalType === 4 || isOpenModal.modalType === 5 ? "Update" : "Create"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Modal
