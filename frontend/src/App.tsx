import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/:shop_name" element={<Shop />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
