import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Chat from "./Pages/Chat/Chat.jsx";
import "./App.css";
import Login from "./Pages/Login/Login";
import axios from "axios";
import  UserProfile  from "./Pages/UserProfile/UserProfile.jsx";
import Home from "./screens/Home";
import Playground from "./screens/Playground";
import Error404 from "./screens/Error404";
import { GlobalStyle } from "./styles/global.js";
import ModalProvider from "./context/ModalContext";
import PlaygroundProvider from "./context/PlaygroundContext";
import MainHome from "./components/MainHome.jsx";
import Post from "./Pages/Post/Post.jsx";
import Feed from "./Pages/Post/Feed.jsx";
import Sidebar from "./components/Navbar/Sidebar.jsx";
import AddFriend from "./Pages/AddFriend/AddFriend.jsx";
import GroupChat from "./Pages/GroupChat/GroupChat.jsx";
import { useSelector } from "react-redux";
import Profile from "./Pages/OthersProfile/Profile.jsx"
import EditProfile from "./Pages/UserProfile/EditProfile/EditProfile.jsx";
import { ToastContainer } from 'react-toastify';
import RegisterPage from "./Pages/Register/Register.jsx";
axios.defaults.withCredentials = true;

function Logout() {
  axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/user/logout`)
    .then(() => {
      window.location.href = "/login";
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
  return null;
}

function App() {
  const [count, setCount] = useState(0);
  const { userData } = useSelector((state) => state.user);

  return (
    <Router>
      <Sidebar />
      <GlobalStyle />
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route
          path="/compile"
          element={
            userData?
            <PlaygroundProvider>
              <ModalProvider>
                <Home />
              </ModalProvider>
            </PlaygroundProvider>:<Navigate to={'/login'} />
          }
        />
        <Route
          path="/playground/:folderId/:playgroundId"
          element={
            userData?<PlaygroundProvider>
            <ModalProvider>
              <Playground />
            </ModalProvider>
          </PlaygroundProvider>:<Navigate to={'/login'} />
          }
        />
        {/* <ToastContainer /> */}
        <Route path="/" element={<MainHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={userData ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/post" element={<Feed />} />
        <Route path="/addChat" element={userData ? <AddFriend /> : <Navigate to="/login" />} />
        <Route path="/myProfile" element={userData ? <UserProfile /> : <Navigate to="/login" />} />
        <Route path="/logout" element={userData ? <Logout /> : <Navigate to="/login" />} />
        <Route path="/community" element={userData ? <GroupChat /> : <Navigate to="/login" />} />
        <Route path="/user/user-details" element={<Profile/>} />
        <Route path="/user/Edit-profile" element={<EditProfile/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default App;