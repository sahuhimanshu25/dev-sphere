import React, { useContext } from 'react';
import { IoTrashOutline } from 'react-icons/io5';
import { BiEditAlt } from 'react-icons/bi';
import { FcOpenedFolder } from 'react-icons/fc';
import logo from '../../assets/logo-small.png';
import { ModalContext } from '../../context/ModalContext';
import { PlaygroundContext } from '../../context/PlaygroundContext';
import { useNavigate } from 'react-router-dom';
import './rightComponent.css';

const RightComponent = () => {
  const navigate = useNavigate();
  const { openModal } = useContext(ModalContext);
  const { folders, deleteFolder, deleteCard } = useContext(PlaygroundContext);

  return (
    <div className="right-container">
      <div className="right-header">
        <h3 className="right-title">
         <span> My </span> <span>Playground</span>
        </h3>
        <button
          className="right-add-folder-button"
          onClick={() =>
            openModal({
              show: true,
              modalType: 1,
              identifiers: { folderId: '', cardId: '' },
            })
          }
        >
          <span>+ New Folder</span> 
        </button>
      </div>
      <div className='folder-cont-main'>
      {Object.entries(folders).map(([folderId, folder]) => (
        <div className="folder-container" key={folderId}>
          <div className="folder-header">
            <h4 className="folder-title">
              <FcOpenedFolder /> {folder.title}
            </h4>
            <div className="folder-actions">
              <IoTrashOutline
                className="folder-delete-icon"
                onClick={() => deleteFolder(folderId)}
              />
              <BiEditAlt
                className="folder-edit-icon"
                onClick={() =>
                  openModal({
                    show: true,
                    modalType: 4,
                    identifiers: { folderId: folderId, cardId: '' },
                  })
                }
              />
              <button
                className="folder-create-button"
                onClick={() =>
                  openModal({
                    show: true,
                    modalType: 2,
                    identifiers: { folderId: folderId, cardId: '' },
                  })
                }
              >
                <span>+</span> New Playground
              </button>
            </div>
          </div>

          <div className="playground-list">
            {Object.entries(folder.playgrounds).map(([playgroundId, playground]) => (
              <div
                className="playground-item"
                key={playgroundId}
                onClick={() => navigate(`/playground/${folderId}/${playgroundId}`)}
              >
                <div className="playground-content">
                  <img className="playground-logo" src={logo} alt="Playground Logo" />
                  <div className="playground-details">
                    <p>{playground.title}</p>
                    <p>Language: {playground.language}</p>
                  </div>
                </div>
                <div className="playground-actions">
                  <IoTrashOutline
                    className="playground-delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCard(folderId, playgroundId);
                    }}
                  />
                  <BiEditAlt
                    className="playground-edit-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal({
                        show: true,
                        modalType: 5,
                        identifiers: { folderId: folderId, cardId: playgroundId },
                      });
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
  );
};

export default RightComponent;
