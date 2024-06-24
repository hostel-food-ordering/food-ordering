import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);

  const navigationLinks = [
    ["/", "Home"],
    ["/tech", "Tech"],
    ["/cult", "Cult"],
    ["/sports", "Sports"],
    ["/mess", "Mess"],
    ["/council", "Council"],
  ];

  return (
    <div className="bg-gray-200 py-3 flex flex-col sm:flex-row justify-between items-center">
      <div className="flex justify-between w-full sm:w-auto">
        <span className="text-3xl font-bold tracking-tight">
          <Link to="/">Food Booking</Link>
        </span>
        <div
          className="sm:hidden text-3xl cursor-pointer"
          onClick={() => setToggleMenu(!toggleMenu)}
        >
          &#9776;
        </div>
      </div>
      <div>
        <div
          className={`flex flex-col justify-center items-center sm:flex sm:flex-row text-xl gap-5 ${
            toggleMenu ? "flex" : "hidden"
          }`}
        >
          <Link to="#">Categories</Link>
          <Link to="#">Cart</Link>
          <Link to="#">Account</Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
