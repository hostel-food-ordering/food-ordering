import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import UserProfile from "./pages/Profile";
import UserCart from "./pages/UserCart";
import ShopOwner from "./pages/ShopOwner";
import AddItem from "./pages/AddItem";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/add" element={<AddItem />} />
          <Route path="/shop-owner" element={<ShopOwner />} />
          <Route path="/account" element={<UserProfile />} />
          <Route path="/cart" element={<UserCart />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
