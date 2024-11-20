import React, { useContext } from 'react';
// import logo from '../../assets/logo.png';
import logo from "../../../public/bgrLogo.png"
import { ModalContext } from '../../context/ModalContext';
import './leftComponent.css';

const LeftComponent = () => {
  const { openModal } = useContext(ModalContext);
  return (
    <div className="left-container">
      <div className="left-content">
        <img className="left-logo" src={logo} alt="Logo" />
        <div className="left-subtitle">
            <span>Code. </span>
            <span>Compile. </span>
            <span>Debug.</span>
        </div>
        <button
          className="left-create-button"
          onClick={() =>
            openModal({
              show: true,
              modalType: 3,
              identifiers: { folderId: '', cardId: '' },
            })
          }
        >
          <span>+</span> Create New Playground
        </button>
      </div>
    </div>
  );
};
export default LeftComponent;
