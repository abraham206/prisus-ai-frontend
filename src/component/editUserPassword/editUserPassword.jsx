import React, { useState } from "react";
import "./editUserPassword.css";
import { LuX, LuLock } from "react-icons/lu";
import { GlobalState } from "../../App";
import { useContext } from "react";
// https://prisus-backend.onrender.com

export default function EditPassword(props) {
  const { signinToken, setSigninToken, err, setErr, setEditPassword } =
    useContext(GlobalState);

  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

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
    setEditPassword(false);
    try {
      if (currPass === "" || newPass === "" || confirmPass === "") {
        throw new Error("Incomplete Credentials");
      }
      let res = await fetch(
        "https://prisus-backend.onrender.com/api/edit-user-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${signinToken}`,
          },
          body: JSON.stringify({
            oldPassword: currPass,
            newPassword: newPass,
            confirmPassword: confirmPass,
          }),
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
          return;
        }
        setSigninToken(refreshData.token);
        // Retry original request with new token
        res = await fetch(
          "https://prisus-backend.onrender.com/api/edit-user-password",
          {
            method: "PATCH",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${refreshData?.token}`,
            },
            body: JSON.stringify({
              oldPassword: currPass,
              newPassword: newPass,
              confirmPassword: confirmPass,
            }),
          },
        );
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(`${data.message}, ${res.status}`);
      }

      setErr(data.message);
      setSigninToken(data.token);
      console.log(data);
    } catch (error) {
      console.log(error);
      setErr(error.message);
    }
  };

  const editHandler = async () => {};
  return (
    <main>
      <div className="edit-password-section">
        <div className="password-intro">
          <div className="password-head">
            <div className="icon-2-container">
              <LuLock color="#9857ff" className="icon-control" />
            </div>
            <div className="password-word">
              <span className="word-2-head fsz">
                <b>Change Password</b>
              </span>
              <span className="p-3 fsz-2">
                Update your password to keep your account secure
              </span>
            </div>
          </div>
          <LuX
            color="white"
            size={30}
            style={{ cursor: "pointer" }}
            onClick={props.clickevent}
          />
        </div>
        <form
          action=""
          className="password-form"
          onSubmit={(e) => {
            e.preventDefault();
            updateUser();
          }}
        >
          <div className="password-form-div">
            <label htmlFor="currPassword" className="password-label">
              Current Password:
              <br />
            </label>
            <input
              type="password"
              placeholder="Enter your current password"
              className="password-input"
              name="currPassword"
              id="currPassword"
              value={currPass}
              onChange={(e) => {
                setCurrPass(e.currentTarget.value);
              }}
            />
          </div>
          <div className="password-form-div">
            <label htmlFor="newPassword" className="password-label">
              New Password:
              <br />
            </label>
            <input
              type="password"
              placeholder="Enter your new password"
              className="password-input"
              name="newPassword"
              id="newPassword"
              value={newPass}
              onChange={(e) => {
                setNewPass(e.currentTarget.value);
              }}
            />
          </div>
          <div className="password-form-div">
            <label htmlFor="confirmNewPass" className="password-label">
              Confirm New Password:
              <br />
            </label>
            <input
              type="password"
              placeholder="Confirm your new password"
              className="password-input"
              name="confirmNewPass"
              id="confirmNewPass"
              value={confirmPass}
              onChange={(e) => {
                setConfirmPass(e.currentTarget.value);
              }}
            />
          </div>
          <button type="submit" className="password-button">
            Update Password
          </button>
        </form>
      </div>
    </main>
  );
}
