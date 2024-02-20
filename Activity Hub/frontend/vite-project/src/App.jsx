import './App.css'
import NavBar from './Components/NavBar'
import {Route, Routes} from "react-router-dom"
import EventDetails from './Components/EventDetails'
import Events from './Components/Events'
import EventForm from './Components/CommonButton/EventForm'
import { Container } from '@mui/material'

function App() {
  return (
    <>
    <div>
      <NavBar />
      <Container sx = {{marginTop: 5}}>
        <Routes>
          <Route index element={<Events />} />
          <Route path="/eventDetails/:id" element={<EventDetails />} />
          <Route path="/events/new" element={<EventForm />}></Route>
        </Routes>
      </Container>
    </div>
      
        
    </>
  )
}

export default App
