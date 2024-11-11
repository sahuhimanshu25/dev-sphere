import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Chat from "./Pages/Chat/Chat.jsx";
import "./App.css";
import Login from "./Pages/Login/Login";
import axios from "axios";
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
axios.defaults.withCredentials = true;

function App() {
  const [count, setCount] = useState(0);

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
        <Route path="/chat" element={<Chat />} />
        <Route path="/post" element={<Feed/>} />
        <Route path="/addFriend" element={<AddFriend/>} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default App;
