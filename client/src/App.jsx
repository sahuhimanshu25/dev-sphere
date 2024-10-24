import { useState } from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'

import './App.css'
import Login from './Pages/Login/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      <Toaster position='bottom-right' toastOptions={{duration:2000}}/>
        <Routes>
          <Route path='/login' element={<Login/>} />
        </Routes>

      </Router>
      
    </>
  )
}

export default App
