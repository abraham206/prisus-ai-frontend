import React, { useEffect, useState } from "react";
import "./nav.css";
import Sidedrawer from "../sidedrawer/sidedrawer";
import Backdrop from "../Backdrop/Backdrop";
import DrawerToggle from "../drawerToggle/drawerToggle";
import { Outlet } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalState } from "../../App";
import { LuLogOut } from "react-icons/lu";
import EditUser from "../editData/editData";
import EditPassword from "../editUserPassword/editUserPassword";

export default function Nav() {
  const [shownav, setshownav] = useState(false);
  const {
    showEditUser,
    setShowEditUser,
    editPassword,
    setEditPassword,
    err,
    setErr,
  } = useContext(GlobalState);

  const { auth, setAuth, userName } = useContext(GlobalState);
  useEffect(() => {
    localStorage.getItem("auth") === "true" ? setAuth(true) : setAuth(false);
  }, []);

  let attachedclass = ["second-nav", "hidenav"];

  if (shownav) {
    attachedclass = ["second-nav", "shownav"];
  }

  const navigate = useNavigate();

  const sideDraw = () => {
    setshownav(true);
  };
  const toggledrawer = () => {
    setshownav(false);
    if (showEditUser) {
      setShowEditUser(false);
    }

    if (editPassword) {
      setEditPassword(false);
    }
  };

  const logoutHandler = async () => {
    setAuth(false);
    navigate("/");
  };
  let errClass = ["user-err-messg", "hidemessg"];

  if (err) {
    errClass = ["user-err-messg", "showmessg"];
  }

  useEffect(() => {
    setTimeout(() => {
      setErr(null);
    }, 4000);
  }, [err]);
  return (
    <div>
      {(shownav || showEditUser || editPassword) && (
        <Backdrop toggle={toggledrawer} />
      )}
      {showEditUser && (
        <EditUser
          clickevent={() => {
            setShowEditUser((preVal) => !preVal);
          }}
        />
      )}
      {editPassword && (
        <EditPassword
          clickevent={() => {
            setEditPassword((preVal) => !preVal);
          }}
        />
      )}

      <Sidedrawer toggle={toggledrawer} classes={attachedclass.join(" ")} />
      {/* <p className="user-err-messg">{err}</p> */}
      <p className={errClass.join(" ")}>{err}</p>

      <nav className="nav">
        <div className="nav-container">
          <div className="logo">
            <p className="logo-word">
              Prisus<span>.ai</span>
            </p>
          </div>
          <div className="nav-link-container">
            <ul className="navlinks-container">
              <li className="navlinks">
                <Link to="/">Home</Link>
              </li>
              <li className="navlinks">
                <Link to="/about">About</Link>
              </li>
              {auth && (
                <>
                  <li className="navlinks">
                    <Link to="/upload">Generate</Link>
                  </li>

                  <li className="navlinks">
                    <Link to="/Dashboard">Dashboard</Link>
                  </li>
                  <li className="navlinks">
                    <Link to="/sessions">Sessions</Link>
                  </li>
                </>
              )}

              <li className="navlinks">
                {!auth ? (
                  <Link to="/signin" className="signin">
                    Sign in
                  </Link>
                ) : null}
              </li>
            </ul>
          </div>
          {auth && (
            <div
              className="profile-firstname"
              onClick={() => {
                navigate("/userpage");
              }}
            >
              {userName?.slice(0, 1).toUpperCase() || "A"}
            </div>
          )}

          <DrawerToggle clickevent={sideDraw} />
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
