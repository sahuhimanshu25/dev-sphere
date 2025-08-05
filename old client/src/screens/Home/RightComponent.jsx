"use client"

import { useContext, useState } from "react"
import { IoTrashOutline, IoFolderOpen, IoAdd } from "react-icons/io5"
import { BiEditAlt, BiPlay } from "react-icons/bi"
import { FcOpenedFolder } from "react-icons/fc"
import { VscCode } from "react-icons/vsc"
import logo from "../../assets/logo-small.png"
import { ModalContext } from "../../context/ModalContext"
import { PlaygroundContext } from "../../context/PlaygroundContext"
import { useNavigate } from "react-router-dom"
import "./rightComponent.css"

const RightComponent = () => {
  const navigate = useNavigate()
  const { openModal } = useContext(ModalContext)
  const { folders, deleteFolder, deleteCard } = useContext(PlaygroundContext)
  const [expandedFolders, setExpandedFolders] = useState(() => {
    // Initialize all folders as expanded
    const initialState = {}
    Object.keys(folders).forEach((folderId) => {
      initialState[folderId] = false
    })
    return initialState
  })

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }))
  }

  const getLanguageIcon = (language) => {
    switch (language.toLowerCase()) {
      case "javascript":
        return "🟨"
      case "python":
        return "🐍"
      case "java":
        return "☕"
      case "cpp":
        return "⚙️"
      default:
        return "📄"
    }
  }

  return (
    <div className="modern-right-container">
      {/* Header Section */}
      <div className="modern-right-header">
        <div className="header-content">
          <div className="header-title-section">
            <h2 className="modern-right-title">
              <span className="title-icon">
                <VscCode />
              </span>
              <span className="title-text">
                <span className="title-my">My</span>
                <span className="title-playground">Playground</span>
              </span>
            </h2>
            <p className="header-subtitle">Organize and manage your code projects</p>
          </div>

          <button
            className="modern-add-folder-button"
            onClick={() =>
              openModal({
                show: true,
                modalType: 1,
                identifiers: { folderId: "", cardId: "" },
              })
            }
          >
            <div className="button-background">
              <div className="button-shine"></div>
            </div>
            <IoAdd className="button-icon" />
            <span className="button-text">New Folder</span>
          </button>
        </div>
      </div>

      {/* Folders Content */}
      <div className="modern-folder-container">
        {Object.entries(folders).length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <IoFolderOpen />
            </div>
            <h3>No folders yet</h3>
            <p>Create your first folder to organize your playgrounds</p>
          </div>
        ) : (
          <div className="folders-grid">
            {Object.entries(folders).map(([folderId, folder]) => (
              <div className="modern-folder-card" key={folderId}>
                <div className="folder-header">
                  <div className="folder-title-section" onClick={() => toggleFolder(folderId)}>
                    <div className="folder-icon-wrapper">
                      <FcOpenedFolder className="folder-icon" />
                      <span className="folder-count">{Object.keys(folder.playgrounds).length}</span>
                    </div>
                    <h3 className="folder-title">{folder.title}</h3>
                    <div className={`expand-icon ${expandedFolders[folderId] ? "expanded" : ""}`}>▼</div>
                  </div>

                  <div className="folder-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        openModal({
                          show: true,
                          modalType: 4,
                          identifiers: { folderId: folderId, cardId: "" },
                        })
                      }}
                      title="Edit Folder"
                    >
                      <BiEditAlt />
                    </button>

                    <button
                      className="action-btn delete-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteFolder(folderId)
                      }}
                      title="Delete Folder"
                    >
                      <IoTrashOutline />
                    </button>

                    <button
                      className="action-btn add-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        openModal({
                          show: true,
                          modalType: 2,
                          identifiers: { folderId: folderId, cardId: "" },
                        })
                      }}
                      title="Add Playground"
                    >
                      <IoAdd />
                    </button>
                  </div>
                </div>

                {/* Playground Items */}
                <div className={`playground-grid ${expandedFolders[folderId] ? "expanded" : "collapsed"}`}>
                  {Object.entries(folder.playgrounds).map(([playgroundId, playground]) => (
                    <div
                      className="modern-playground-card"
                      key={playgroundId}
                      onClick={() => navigate(`/playground/${folderId}/${playgroundId}`)}
                    >
                      <div className="playground-header">
                        <div className="playground-meta">
                          <img className="playground-logo" src={logo || "/placeholder.svg"} alt="Playground Logo" />
                          <div className="language-badge">
                            <span className="language-icon">{getLanguageIcon(playground.language)}</span>
                            <span className="language-text">{playground.language}</span>
                          </div>
                        </div>

                        <div className="playground-actions">
                          <button
                            className="playground-action-btn edit"
                            onClick={(e) => {
                              e.stopPropagation()
                              openModal({
                                show: true,
                                modalType: 5,
                                identifiers: { folderId: folderId, cardId: playgroundId },
                              })
                            }}
                            title="Edit Playground"
                          >
                            <BiEditAlt />
                          </button>

                          <button
                            className="playground-action-btn delete"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteCard(folderId, playgroundId)
                            }}
                            title="Delete Playground"
                          >
                            <IoTrashOutline />
                          </button>
                        </div>
                      </div>

                      <div className="playground-content">
                        <h4 className="playground-title">{playground.title}</h4>
                        <div className="playground-stats">
                          <span className="stat-item">
                            <VscCode className="stat-icon" />
                            Ready to code
                          </span>
                        </div>
                      </div>

                      <div className="playground-footer">
                        <div className="run-indicator">
                          <BiPlay className="run-icon" />
                          <span>Click to run</span>
                        </div>
                      </div>

                      <div className="card-glow"></div>
                    </div>
                  ))}

                  {/* Add New Playground Card */}
                  <div
                    className="add-playground-card"
                    onClick={() =>
                      openModal({
                        show: true,
                        modalType: 2,
                        identifiers: { folderId: folderId, cardId: "" },
                      })
                    }
                  >
                    <div className="add-card-content">
                      <IoAdd className="add-icon" />
                      <span>Add Playground</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RightComponent
