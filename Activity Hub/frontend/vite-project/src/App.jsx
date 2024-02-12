import './App.css'
import NavBar from './Components/NavBar'

import {Route, Routes} from "react-router-dom"
import EventDetails from './Components/EventDetails'
import Events from './Components/Events'

function App() {
  return (
    <>
        <NavBar />
        <Routes>
          <Route index element={<Events />} />
          <Route path="/eventDetails/:id" element={<EventDetails />} />
        </Routes>
    </>
  )
}

export default App
