import React, { useContext } from 'react';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';
import Modal from '../../components/Modal';
import { ModalContext } from '../../context/ModalContext';
import './indexP.css';

const Home = () => {
  const { isOpenModal } = useContext(ModalContext);

  return (
    <div className="home-container">
      <LeftComponent className="left-component" />
      <div className="sep"></div>
      <RightComponent className="right-component" />
      {isOpenModal.show && <Modal className="modal-component" />}
    </div>
  );
};
export default Home;
