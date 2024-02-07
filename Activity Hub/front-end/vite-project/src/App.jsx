// import './App.css'
import Contact  from './Test'
import PostCard from './Components/PostCard'
import PrimarySearchAppBar from './Components/NavBar'
import EventUpload from './Components/EventUpload'

import {Route, Routes} from "react-router-dom"

function App() {
  return (
    <>
      <Routes>
        <Route index element = {<PrimarySearchAppBar/>} />
      </Routes>
      <div>
        <Contact/>
      </div>

    </>
  )
}

export default App
