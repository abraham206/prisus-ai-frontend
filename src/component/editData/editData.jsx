import React, { useState, useContext } from "react";
import "./editData.css";
import { LuUser, LuLogOut, LuMail } from "react-icons/lu";
import { LuX } from "react-icons/lu";
import { FaArrowLeft } from "react-icons/fa";
import { GlobalState } from "../../App";
import { useEffect } from "react";
// https://prisus-backend.onrender.com
export default function EditUser(props) {
  const {
    name,
    setName,
    email,
    setEmail,
    signinToken,
    showEditUser,
    setShowEditUser,
    editPassword,
    setEditPassword,
    setSigninToken,
    err,
    setErr,
  } = useContext(GlobalState);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await fetch(
          "https://prisus-backend.onrender.com/api/auth/refresh",
          {
            method: "GET",
            credentials: "include",
          },
        );

        console.log(response);
        if (!response.ok) {
          setSigninToken(null);
          throw new Error(
            `Could Not get token Status Code: ${response.status}`,
          );
        }

        const data = await response.json();
        console.log(data);
        setSigninToken(data.token);
      } catch (error) {
        setSigninToken(null);
      }
    };

    refreshToken();
  }, []);

  const updateUser = async () => {
    setShowEditUser(false);

    try {
      if (name === "" || email === "") {
        throw new Error("All fields must be filled up!");
      }
      let res = await fetch(
        "https://prisus-backend.onrender.com/api/edit-user",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${signinToken}`,
          },
          body: JSON.stringify({ name: name, email: email }),
        },
      );
      if (res?.status === 401) {
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
          setSigninToken(null);
        }
        setSigninToken(refreshData.token);
        // Retry original request with new token
        res = await fetch("http://localhost:8080/api/edit-user", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshData?.token}`,
          },
          body: JSON.stringify({ name: name, email: email }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(`${data.message}, ${res.status}`);
      }

      console.log(data);
      setErr(data.message);
      // props.clickevent();
    } catch (error) {
      console.log(error);
      setErr(error.message);
    }
  };
  return (
    <main>
      <div className="edit-section">
        <div className="edit-introduction">
          <div className="edit-introduction-word">
            <FaArrowLeft size={20} color="white" />
            <div className="word-2">
              <span className="word-2-head">
                <b>Edit Profile</b>
              </span>
              <span className="p-3">Update your name and email.</span>
            </div>
          </div>
          <LuX
            size={30}
            color="white"
            onClick={props.clickevent}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="form-section">
          <form
            action=""
            className="edit-form"
            onSubmit={(e) => {
              e.preventDefault();
              updateUser();
            }}
          >
            <div className="form-input-div">
              <div className="form-input-div-container">
                <div className="icon-2-container">
                  <LuUser color="#9857ff" className="icon-control" />
                </div>
                <div className="form-details-box">
                  <span className="form-2-head">Full Name</span>
                  <span className="p-3">
                    This is the name that will be displayed on your profile
                  </span>
                </div>
              </div>
              <div className="form-2-content">
                <label className="form-2-label" htmlFor="name">
                  Full Name:
                  <br />
                </label>
                <input
                  className="form-2-input"
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.currentTarget.value);
                  }}
                />
              </div>
            </div>
            <div className="form-input-div">
              <div className="form-input-div-container">
                <div className="icon-2-container">
                  <LuMail color="#9857ff" className="icon-control" />
                </div>
                <div className="form-details-box">
                  <span className="form-2-head">Email Address</span>
                  <span className="p-3">
                    This is the name email address associated to your account
                  </span>
                </div>
              </div>
              <div className="form-2-content">
                <label className="form-2-label" htmlFor="email">
                  Email Address:
                  <br />
                </label>
                <input
                  className="form-2-input"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.currentTarget.value);
                  }}
                />
              </div>
            </div>
            <button type="submit" className="form-save">
              Save
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
