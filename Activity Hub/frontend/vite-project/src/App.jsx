import './App.css'
import NavBar from './Components/NavBar'

import {Route, Routes} from "react-router-dom"
import EventDetails from './Components/EventDetails'
import Events from './Components/Events'
import AddEvent from './Components/AddEvent'
import CommonButton from './Components/CommonButton/CommonButton'
import { Container } from '@mui/material'

function App() {
  return (
    <>
      <NavBar />
      <Container>
        <Routes>
          <Route index element={<Events />} />
          <Route path="/eventDetails/:id" element={<EventDetails />} />
          <Route path="/events/new" element={<CommonButton />}></Route>
        </Routes>
      </Container>
        
    </>
  )
}

export default App
