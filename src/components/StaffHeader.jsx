import Navbar from "./Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Button from "./Button";
import { useEffect, useState } from "react";
import { HiMenu, HiOutlineX } from "react-icons/hi";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../services/apiLogin";
import { Avatar } from "@mui/material";

const ManagerHeader = () => {
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const Logout = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      localStorage.removeItem("user");
      localStorage.removeItem("Authorization");
    },
  });

  //* Toggle Menu at mobile view
  const [open, setOpen] = useState(false);
  function onToogleMenu() {
    if (window.innerWidth >= 768) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }
  //* When resize window, check it's innerWidth
  useEffect(() => {
    window.addEventListener("resize", onToogleMenu);
    onToogleMenu();

    return () => {
      window.removeEventListener("resize", onToogleMenu);
    };
  }, []);

  async function onLogout() {
    try {
      const res = await Logout.mutateAsync();
      if (res.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex justify-around items-center bg-orange-100 py-4">
        {/* Logo */}
        <div>
          <NavLink to="/management/coffeeShops">
            <Logo />
          </NavLink>
        </div>
        {/* Navbar */}

        <div
          className={
            "md:flex md:static absolute md:justify-between  w-full  left-0 top-12 md:w-auto md:items-center py-1 min-h-[4vh] text-center "
          }
        >
          {(open || window.innerWidth >= 768) && (
            <Navbar>
              <NavLink
                to="/management/coffeeShops"
                className="hover:opacity-50 hover:text-primary"
                style={({ isActive }) => {
                  return {
                    color: isActive ? "#B96714" : "",
                    borderBottom:
                      isActive && window.innerWidth >= 768
                        ? "2px solid #B96714"
                        : "",
                  };
                }}
              >
                Coffee Shop
              </NavLink>

              <NavLink
                to="/management/dashboard"
                className="md:hover:opacity-50 md:hover:text-primary"
                style={({ isActive }) => {
                  return {
                    color: isActive ? "#B96714" : "",
                    borderBottom:
                      isActive && window.innerWidth >= 768
                        ? "2px solid #B96714"
                        : "",
                  };
                }}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/management/cat"
                className="hover:opacity-50 hover:text-primary"
                style={({ isActive }) => {
                  return {
                    color: isActive ? "#B96714" : "",
                    borderBottom:
                      isActive && window.innerWidth >= 768
                        ? "2px solid #B96714"
                        : "",
                  };
                }}
              >
                Cat
              </NavLink>

              <NavLink
                to="/management/items"
                className="hover:opacity-50 hover:text-primary"
                style={({ isActive }) => {
                  return {
                    color: isActive ? "#B96714" : "",
                    borderBottom:
                      isActive && window.innerWidth >= 768
                        ? "2px solid #B96714"
                        : "",
                  };
                }}
              >
                Item
              </NavLink>

              <NavLink
                to="/management/staffs"
                className="hover:opacity-50 hover:text-primary"
                style={({ isActive }) => {
                  return {
                    color: isActive ? "#B96714" : "",
                    borderBottom:
                      isActive && window.innerWidth >= 768
                        ? "2px solid #B96714"
                        : "",
                  };
                }}
              >
                Staff
              </NavLink>
            </Navbar>
          )}
        </div>

        {/* Button */}
        <div className="flex items-center gap-6">
          {!user ? (
            <NavLink to="/login">
              <Button type="small">Sign in/up</Button>
            </NavLink>
          ) : (
            <div>
              Welcome, {user.username}!
              <div onClick={() => onLogout()}>
                <Button type="small">Logout</Button>
              </div>
            </div>
          )}
          <span className="md:hidden">
            {open === false ? (
              <HiMenu size="2rem" onClick={() => setOpen(true)} />
            ) : (
              <HiOutlineX size="2rem" onClick={() => setOpen(false)} />
            )}
          </span>
        </div>
        {user && (
          <NavLink to="/management/profile">
            <Avatar
              alt="Remy Sharp"
              src={user.avatar}
              sx={{ width: 56, height: 56 }}
            />
          </NavLink>
        )}
      </div>
    </>
  );
};

export default ManagerHeader;
