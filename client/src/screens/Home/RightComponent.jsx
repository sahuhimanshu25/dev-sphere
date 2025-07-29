"use client"
import { useContext } from "react"
import { useRouter } from "next/navigation"
import { IoTrashOutline } from "react-icons/io5"
import { BiEditAlt } from "react-icons/bi"
import { FcOpenedFolder } from "react-icons/fc"
import Image from "next/image"
import { ModalContext } from "../../context/ModalContext"
import { PlaygroundContext } from "../../context/PlaygroundContext"

const RightComponent = () => {
  const router = useRouter()
  const { openModal } = useContext(ModalContext)
  const { folders, deleteFolder, deleteCard } = useContext(PlaygroundContext)

  return (
    <div className="flex-[2] p-5 bg-transparent text-white rounded-2xl">
      <div className="flex justify-between items-end mb-5 pt-2.5 pb-2.5 sticky top-0">
        <h3 className="text-2xl text-primary font-medium tracking-wide">
          <span className="text-white/60">My </span>
          <span className="font-bold">Playground</span>
        </h3>
        <button
          className="relative inline-block px-6 py-3 border-none text-base bg-inherit rounded-full font-semibold text-white border-2 border-primary/40 cursor-pointer overflow-hidden transition-all duration-600 cubic-bezier-[0.23,1,0.320,1] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2 before:w-5 before:h-5 before:bg-primary before:rounded-full before:opacity-0 before:transition-all before:duration-800 before:cubic-bezier-[0.23,1,0.320,1] before:z-0 hover:shadow-[0px_0px_8px_rgba(166,154,255,0.3),4px_0_18px_rgba(0,0,0,0)] hover:text-white active:scale-95 hover:before:w-[150px] hover:before:h-[150px] hover:before:opacity-100"
          onClick={() =>
            openModal({
              show: true,
              modalType: 1,
              identifiers: { folderId: "", cardId: "" },
            })
          }
        >
          <span className="relative z-10">+ New Folder</span>
        </button>
      </div>

      <div className="h-[550px] overflow-y-auto">
        {Object.entries(folders).map(([folderId, folder]) => (
          <div className="mb-5" key={folderId}>
            <div className="flex justify-between items-center mb-2.5">
              <h4 className="text-xl flex items-center tracking-wide">
                <FcOpenedFolder className="mr-2" /> {folder.title}
              </h4>
              <div className="flex gap-2.5">
                <IoTrashOutline
                  className="text-red-400 cursor-pointer hover:text-red-300"
                  onClick={() => deleteFolder(folderId)}
                />
                <BiEditAlt
                  className="text-blue-400 cursor-pointer hover:text-blue-300"
                  onClick={() =>
                    openModal({
                      show: true,
                      modalType: 4,
                      identifiers: { folderId: folderId, cardId: "" },
                    })
                  }
                />
                <button
                  className="bg-transparent text-gray-100 border-none px-1 py-1 border border-primary rounded-3xl cursor-pointer text-sm"
                  onClick={() =>
                    openModal({
                      show: true,
                      modalType: 2,
                      identifiers: { folderId: folderId, cardId: "" },
                    })
                  }
                >
                  <span>+</span> New Playground
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {Object.entries(folder.playgrounds).map(([playgroundId, playground]) => (
                <div
                  className="flex justify-between bg-dark-card rounded-md p-2.5 w-[calc(50%-10px)] cursor-pointer transition-colors duration-300 hover:bg-dark-hover"
                  key={playgroundId}
                  onClick={() => router.push(`/playground/${folderId}/${playgroundId}`)}
                >
                  <div className="flex items-center">
                    <Image src="/logo-small.png" alt="Playground Logo" width={40} height={40} className="mr-2.5" />
                    <div>
                      <p className="text-white">{playground.title}</p>
                      <p className="text-gray-400 text-sm">Language: {playground.language}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <IoTrashOutline
                      className="text-red-400 cursor-pointer hover:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteCard(folderId, playgroundId)
                      }}
                    />
                    <BiEditAlt
                      className="text-blue-400 cursor-pointer hover:text-blue-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        openModal({
                          show: true,
                          modalType: 5,
                          identifiers: { folderId: folderId, cardId: playgroundId },
                        })
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RightComponent
