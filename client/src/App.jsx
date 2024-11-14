import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Chat from "./Pages/Chat/Chat.jsx";
import "./App.css";
import Login from "./Pages/Login/Login";
import axios from "axios";
import { UserProfile } from "./Pages/UserProfile/UserProfile.jsx";
import Home from "./screens/Home";
import Playground from "./screens/Playground";
import Error404 from "./screens/Error404";
import { GlobalStyle } from "./styles/global.js";
import ModalProvider from "./context/ModalContext";
import PlaygroundProvider from "./context/PlaygroundContext";
import MainHome from "./components/MainHome.jsx";
import Post from "./Pages/Post/Post.jsx";
import Feed from "./Pages/Post/Feed.jsx";
import MainNavbar from "./components/Navbar/MainNavbar.jsx";
import AddFriend from "./Pages/AddFriend/addFriend.jsx";
import GroupChat from "./Pages/GroupChat/GroupChat.jsx";
import { useSelector } from "react-redux";

axios.defaults.withCredentials = true;

function Logout() {
  axios.get("http://localhost:3000/user/logout")
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
      <MainNavbar />
      <GlobalStyle />
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route
          path="/compile"
          element={
            <PlaygroundProvider>
              <ModalProvider>
                <Home />
              </ModalProvider>
            </PlaygroundProvider>
          }
        />
        <Route
          path="/playground/:folderId/:playgroundId"
          element={
            <PlaygroundProvider>
              <ModalProvider>
                <Playground />
              </ModalProvider>
            </PlaygroundProvider>
          }
        />
        <Route path="/" element={<MainHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={userData ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/post" element={userData ? <Feed /> : <Navigate to="/login" />} />
        <Route path="/addChat" element={userData ? <AddFriend /> : <Navigate to="/login" />} />
        <Route path="/myProfile" element={userData ? <UserProfile /> : <Navigate to="/login" />} />
        <Route path="/logout" element={userData ? <Logout /> : <Navigate to="/login" />} />
        <Route path="/community" element={userData ? <GroupChat /> : <Navigate to="/login" />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default App;
