import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "../signin/signin.css";
import "./signup.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { GlobalState } from "../../App";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email is not valid!!")
    .required("Email is required!"),
  name: yup.string().required("Full name is required!"),
  password: yup.string().min(6).max(24).required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match!!")
    .required("Please, confirm your password"),
});
import {
  LuEye,
  LuEyeOff,
  LuLock,
  LuMail,
  LuArrowRight,
  LuUser,
} from "react-icons/lu";

export default function Signup() {
  const [inputClass, setInputClass] = useState(["form-input"]);
  const [passwordClass, setPasswordClass] = useState(["form-input"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (errors.email) {
      setErr(errors.email.message);
    }

    if (errors.password) {
      setErr(errors.password.message);
    }

    if (errors.confirmPassword) {
      setErr(errors.confirmPassword.message);
    }

    if (errors.name) {
      setErr(errors.name.message);
    }
  }, [errors]);

  useEffect(() => {
    const allSection = document.querySelectorAll(".select");

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        console.log(entries);
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("animation");
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    allSection.forEach((section) => sectionObserver.observe(section));
    return () => sectionObserver.disconnect();
  }, []);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { setSigninToken, loading, setLoading, setAuth, err, setErr } =
    useContext(GlobalState);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const signup = async (e) => {
    setLoading(true);
    console.log(e);
    try {
      const res = await fetch(
        "https://prisus-backend.onrender.com/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            password: password,
            email: email,
            confirmPassword: confirmPassword,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(`${data.message}, ${res.status}`);
      }

      console.log(data);
      setSigninToken(data.token);
      navigate("/userPage");
    } catch (error) {
      setErr(error.message + " " + ", " + "Try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <section className="signin-section-original">
        <div className="signin-container">
          {/* Login Card */}

          <div className="signin-card signup-down">
            <div className="signin-header">
              <h2>
                Sign up for <span>Prisus AI</span>.
              </h2>

              <p>Join the future of learning and productivity.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(signup)} noValidate>
              {/* Email */}

              <div className="form-group">
                <label htmlFor="name">Full Name</label>

                <div
                  className={
                    errors.name ? "input-wrapper validate" : "input-wrapper"
                  }
                >
                  <LuUser size={20} />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    required
                    {...register("name", {
                      onChange: (e) => {
                        setName(e.currentTarget.value);
                        console.log(errors);
                      },
                    })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email address</label>

                <div
                  className={
                    errors.email ? "input-wrapper validate" : "input-wrapper"
                  }
                >
                  <LuMail size={20} />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    {...register("email", {
                      onChange: (e) => {
                        setEmail(e.currentTarget.value);
                        console.log(errors);
                      },
                    })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Password</label>

                <div
                  className={
                    errors.password ? "input-wrapper validate" : "input-wrapper"
                  }
                >
                  <LuLock size={20} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    {...register("password", {
                      onChange: (e) => {
                        setPassword(e.currentTarget.value);
                        console.log(errors);
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <LuEyeOff size={19} />
                    ) : (
                      <LuEye size={19} />
                    )}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>

                <div
                  className={
                    errors.confirmPassword
                      ? "input-wrapper validate"
                      : "input-wrapper"
                  }
                >
                  <LuLock size={20} />
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your Password"
                    required
                    name="confirmPassword"
                    {...register("confirmPassword", {
                      onChange: (e) => {
                        setConfirmPassword(e.currentTarget.value);
                        console.log(errors);
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <LuEyeOff size={19} />
                    ) : (
                      <LuEye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign in */}
              <button className="signin-button" type="submit">
                <span>Create Account</span>
                <LuArrowRight size={20} />
              </button>
            </form>

            {/* Divider */}
            <div className="divider">
              <span></span>
              <p>or continue with</p>
              <span></span>
            </div>

            <button
              className="social-button"
              onClick={() => {
                setErr("This Feature is not yet available");
              }}
            >
              <div className="google-icon">G</div>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
