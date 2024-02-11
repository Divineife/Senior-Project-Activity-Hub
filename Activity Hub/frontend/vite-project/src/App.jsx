// import './App.css'
import PostCard from './Components/PostCard'
import PrimarySearchAppBar from './Components/NavBar'
import EventUpload from './Components/EventUpload'
import Events from './Components/Events'

import {Route, Routes} from "react-router-dom"

function App() {
  return (
    <>
      <Routes>
        <Route index element = {<PrimarySearchAppBar/>} />
      </Routes>
      <div>
        <Events/>
      </div>

    </>
  )
}

export default App
