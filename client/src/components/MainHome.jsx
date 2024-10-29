import React from 'react';
import { Link } from 'react-router-dom';

const MainHome = () => {
  return (
    <div>
      <Link to="/compile">Compiler</Link>
      <br/>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default MainHome;