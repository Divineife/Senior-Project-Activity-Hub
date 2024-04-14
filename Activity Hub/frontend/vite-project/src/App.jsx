import "./App.css";
import NavBar from "./Components/NavBar";
import { Route, Routes } from "react-router-dom";
import EventDetails from "./Components/EventDetails";
import Events from "./Components/Events";
import UpdateEvent from "./Components/UpdateEvent";
import EventForm from "./Components/CommonButton/EventForm";
import Grid from "@mui/material/Unstable_Grid2";
import NewUserModal from "./Components/Modals/NewUserModal";
import { NavBarContext } from "./Components/context";
import NavBarProvider from "./Components/NavBarProvider";

function App() {
  return (
    <NavBarProvider>
      <NavBar />
      <Grid sx={{ padding: 5, paddingRight: 2 }}>
        <Routes>
          <Route index element={<Events />} />
          <Route path="/eventDetails/:id" element={<EventDetails />} />
          <Route path="/events/new" element={<EventForm />}></Route>
          <Route path="/user/signUp" element={<NewUserModal />}></Route>
          <Route path="/editEvent/:event_id" element={<UpdateEvent />} />
          <Route
            path="/user/signIn"
            element={<NewUserModal open={true} />}
          ></Route>
        </Routes>
      </Grid>
    </NavBarProvider>
  );
}

export default App;
