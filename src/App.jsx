import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./adminpages/admindashboard";
import UserManagement from "./adminpages/usermanagement";
import PropertyManagement from "./adminpages/Propertymanagement";
import HousingRegistrationAdmin from "./adminpages/Registrationmanagement";
import PropertyListings from "./adminpages/Propertylistings";
import Reports from "./adminpages/reports";
import AdminProfile from "./adminpages/Adminprofile";
import CreateAccountPage from "./adminpages/createaccount";
import LoginPage from "./adminpages/signup";


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage/>} />
        <Route path='/signup' element={<CreateAccountPage/>} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/users' element={<UserManagement/>} />
        <Route path='/properties' element={<PropertyManagement/>} />
        <Route path='/registration' element={<HousingRegistrationAdmin/>} />
        <Route path='/listings' element={<PropertyListings/>} />
         <Route path='/reports' element={<Reports/>} />
         <Route path='/profile' element={<AdminProfile />} />


        
      </Routes>
    </Router>
  );
}

export default App;