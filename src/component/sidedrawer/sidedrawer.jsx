import React from "react";
import "./sidedrawer.css";
import { MdCancel } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { GlobalState } from "../../App";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  LuHouse,
  LuUpload,
  LuDatabase,
  LuFile,
  LuLogOut,
} from "react-icons/lu";
import { FaQuestion, FaInfo } from "react-icons/fa6";
export default function Sidedrawer(props) {
  const { auth, setAuth, userName, setSigninToken, signinToken, err, setErr } =
    useContext(GlobalState);

  useEffect(() => {
    localStorage.getItem("auth") === "true" ? setAuth(true) : setAuth(false);
  }, []);

  const logout = async () => {
    try {
      let res = await fetch(
        "https://prisus-backend.onrender.com/api/auth/logout",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${signinToken}`,
          },
        },
      );

      if (res.status === 401) {
        const refreshRes = await fetch(
          "https://prisus-backend.onrender.com/api/auth/refresh",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        console.log(refreshRes);
        const refreshData = await refreshRes.json();
        if (!res?.ok) {
          throw new Error(`Something went wrong, Status code ${res?.status}`);
        }
        setSigninToken(refreshData.token);
        // Retry original request with new token
        res = await fetch(
          "https://prisus-backend.onrender.com/api/auth/logout",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${refreshData?.token}`,
              "Content-Type": "application/json",
            },
          },
        );
      }

      const data = await res.json();
      if (!res.ok) {
        setSigninToken(null);
      }

      setErr(data.message);
      console.log(data);
      localStorage.removeItem("auth");
      setAuth(false);
      navigate("/");
    } catch (error) {
      setErr(error.message);
    }
  };

  const navigate = useNavigate();
  return (
    <div className={props.classes}>
      <div>
        <div className="second-logo">
          {auth && (
            <div className="profile-nav-container">
              <p
                onClick={() => {
                  navigate("/userpage");
                }}
                className="letter"
              >
                {userName?.slice(0, 1).toUpperCase() || "A"}
              </p>
              <p
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/userpage");
                }}
                className="profile-nav-name"
              >
                Amaize Abraham
              </p>
            </div>
          )}

          {/* <MdCancel
            size={30}
            color="white"
            onClick={props.toggle}
            style={{ cursor: "pointer" }}
          /> */}
        </div>

        <div className="nav-link-container-2">
          <ul className="navlinks-container-2">
            <li
              className="navlinks-2"
              onClick={() => {
                props.toggle();
                navigate("/");
              }}
            >
              <LuHouse color="#9857ff" size={25} />
              <Link to="/">Home</Link>
            </li>
            <li
              className="navlinks-2"
              onClick={() => {
                props.toggle();
                navigate("/about");
              }}
            >
              <FaInfo color="#9857ff" size={25} />
              <Link to="about">About</Link>
            </li>

            {auth && (
              <>
                {" "}
                <li
                  className="navlinks-2"
                  onClick={() => {
                    props.toggle();
                    navigate("/Upload");
                  }}
                >
                  <LuUpload color="#9857ff" size={25} />
                  <Link className="hey" to="upload">
                    Generate
                  </Link>
                </li>
                <li
                  className="navlinks-2"
                  onClick={() => {
                    props.toggle();
                    navigate("/Dashboard");
                  }}
                >
                  <LuDatabase color="#9857ff" size={25} />
                  <Link to="/Dashboard">Dashboard</Link>
                </li>
                <li
                  className="navlinks-2"
                  onClick={() => {
                    props.toggle();
                    navigate("/sessions");
                  }}
                >
                  <FaQuestion color="#9857ff" size={25} />
                  <Link to="/sessions">Sessions</Link>
                </li>
              </>
            )}
            {!auth && (
              <li
                className="navlinks-2"
                onClick={() => {
                  props.toggle();
                  navigate("/signin");
                }}
              >
                <NavLink to="/signin" className="signin-2">
                  Sign in
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        {auth && (
          <p
            className="logout-button"
            onClick={() => {
              logout();
              props.toggle();
            }}
          >
            <LuLogOut style={{ marginRight: ".61rem" }} />
            Logout
          </p>
        )}
      </div>
    </div>
  );
}
