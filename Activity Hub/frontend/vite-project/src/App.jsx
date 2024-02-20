import './App.css'
import NavBar from './Components/NavBar'
import {Route, Routes} from "react-router-dom"
import EventDetails from './Components/EventDetails'
import Events from './Components/Events'
import EventForm from './Components/CommonButton/EventForm'
import { Container } from '@mui/material'
import NewUserModal from './Components/Modals/NewUserModal'

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
          <Route path="/user/signUp" element={<NewUserModal />}></Route>
          <Route path="/user/signIn" element={<NewUserModal open = {true} />}></Route>
        </Routes>
      </Container>
    </div>
      
        
    </>
  )
}

export default App
