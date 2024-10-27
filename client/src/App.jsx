import { useState } from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import Chat from './Pages/Chat/Chat.jsx'
import './App.css'
import Login from './Pages/Login/Login'
import axios from 'axios'
axios.defaults.withCredentials = true;

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      <Toaster position='bottom-right' toastOptions={{duration:2000}}/>
      <Toaster position='bottom-right' toastOptions={{duration:2000}}/>
        <Routes>
          <Route path='/login' element={<Login/>} />
          <Route path='/chat' element={<Chat/>} />
        </Routes>

      </Router>
      
    </>
  )
}

export default App
