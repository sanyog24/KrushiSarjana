import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Header from "./components/Header.jsx";
import Farmer from "./pages/FarmerDashboard.jsx";
// import Profile from "./pages/Profile.jsx";
import MarketPlace from "./pages/Marketplace.jsx";
import MyFarmerPro from "./pages/MyFarmerPro.jsx";
import UploadProduct from "./pages/UploadProduct.jsx";
import Products from "./pages/Products.jsx";
 import FarmerOrder from "./pages/FarmerOrder.jsx";
import RetailerDashboard from "./pages/RetailerDashboard.jsx";
import RetailerProducts from "./pages/RetailerProducts.jsx";
import RetailerProfile from "./pages/RetailerProfile.jsx";
import FarmerProfile from "./pages/FarmerProfile.jsx";
import CustomerProfile from "./pages/CustomerProfile.jsx"
import CustomerProduct from "./pages/CustomerProducts.jsx";
import CustomerOrder from "./pages/CustomerOrder.jsx";
import Success from "./pages/Success.jsx";
import Cancel from "./pages/Cancel.jsx";
import AlertPage from "./pages/AlertPage.jsx";
import AboutPage from './pages/AboutUs.jsx';
import PutOnRent from './pages/PutOnRent.jsx';
import BuyOnRent from './pages/BuyOnRent.jsx';
import Schemes from './pages/Schemes.jsx';

// import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";
// import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/farmer-dashboard" element={<Farmer />} />
        <Route path="/dashboard/retailer-profile" element={<RetailerProfile />} />
        <Route path="/dashboard/farmer-profile" element={<FarmerProfile />} />
        <Route path="/marketplace" element={<MarketPlace />} />
        <Route path="/MyFarmerPro" element={<MyFarmerPro />} />
        <Route path="/FarmerOrder" element={<FarmerOrder/>}/>
        <Route path="/dashboard/upload-product" element={<UploadProduct />} />
        <Route path="/dashboard/product" element={<Products />} />
        <Route path="/RetailerDashboard" element={<RetailerDashboard />} />
        <Route path="/RetailerProducts" element={<RetailerProducts />} />
        <Route path="/customer-dashboard" element={<CustomerProduct/>}/>
        <Route path="/CustomerOrder" element={<CustomerOrder/>}/>
        <Route path="/success" element={<Success/>}/>
        <Route path="/cancel" element={<Cancel/>}/>
        <Route path="/AlertPage" element={<AlertPage/>}/>
        <Route path="/customer-alert" element={<AlertPage/>}/>
        <Route path="/aboutpage" element={<AboutPage/>}/>
        <Route path="/putOnRent" element={<PutOnRent/>}/>
        <Route path="/buyOnRent" element={<BuyOnRent/>}/>
        <Route path="/Schemes" element={<Schemes/>}/>

        <Route path="/dashboard/customer-profile" element={<CustomerProfile />}/>
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;