import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

export default function Navbar() {
  const { isLoggedIn } = useAppContext();

  const [toggleMenu, setToggleMenu] = useState<boolean>(false);

  const navigationLinks = isLoggedIn
    ? [
        ["/categories", "Catergories"],
        ["/cart", "Cart"],
        ["/account", "Account"],
      ]
    : [
        ["/categories", "Catergories"],
        ["/cart", "Cart"],
        ["/sign-in", "Sign In"],
      ];

  const navbarRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full">
      <div
        style={{
          height: toggleMenu ? navbarRef.current?.scrollHeight + "px" : "60px",
        }}
      ></div>
      <div className="py-2"></div>
      <div className="fixed z-50 top-0 left-0 w-full bg-white border-b border-slate-800">
        <div
          className={
            "max-w-screen-xl m-auto p-3 flex flex-col sm:flex-row justify-between items-center overflow-hidden transition-[max-height] "
          }
          ref={navbarRef}
          style={{
            maxHeight: toggleMenu
              ? navbarRef.current?.scrollHeight + "px"
              : "60px",
          }}
        >
          <div className="flex items-center justify-between w-full sm:w-auto">
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
              className={`flex flex-col justify-center items-center sm:flex sm:flex-row text-xl gap-5 mt-2 sm:mt-0`}
            >
              {navigationLinks.map((link, index) => {
                return (
                  <Link
                    to={link[0]}
                    key={index}
                    onClick={() => setToggleMenu(false)}
                  >
                    {link[1]}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
