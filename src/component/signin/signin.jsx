import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signin.css";
import Spinner from "../spinner/spinner";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { GlobalState } from "../../App";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email is not valid!!")
    .required("Email is required!"),
  password: yup.string().min(6).max(24).required("Password is required"),
});
import { LuEye, LuEyeOff, LuLock, LuMail, LuArrowRight } from "react-icons/lu";

export default function SignIn() {
  const [inputClass, setInputClass] = useState(["form-input"]);
  const [passwordClass, setPasswordClass] = useState(["form-input"]);
  const [forgot, setForgot] = useState(false);
  const [oAuth, setOAuth] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { setSigninToken, loading, setLoading, setAuth, err, setErr } =
    useContext(GlobalState);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setForgot(false);
  //     setOAuth(false);
  //   }, 2000);
  // }, [forgot, oAuth]);
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
      setInputClass(["form-input", "validate"]);
      setPasswordClass(["form-input"]);
      console.log(inputClass.join(" "));
    }

    if (errors.password) {
      setErr(errors.password.message);
      setPasswordClass(["form-input", "validate"]);
      setInputClass(["form-input"]);
      console.log(inputClass);
    }

    if (!errors.password || !errors.email) {
      // setInputClass(["form-input"]);
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

  const signin = async (e) => {
    console.log(email, password);
    console.log(e);
    setLoading(true);
    try {
      const res = await fetch(
        "https://prisus-backend.onrender.com/api/auth/signin",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(`${data.message}, ${res.status}`);
      }
      console.log(data);
      setSigninToken(data.token);
      navigate("/dashboard");
      localStorage.setItem("auth", true);
      setAuth(true);
    } catch (error) {
      console.log(error);
      setErr(`⚠ ${error.message}, Try Again Later`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <section className="signin-section-original">
        <div className="signin-container signin-top">
          <div className="signin-card">
            <div className="signin-header">
              <h2>Welcome back</h2>

              <p>
                Sign in to continue to your <span>Prisus AI</span> account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(signin)} noValidate>
              {/* Email */}
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

              {/* Forgot password */}
              <div className="forgot-wrapper">
                <Link
                  onClick={() => {
                    setErr("This Feature is not yet available");
                    // navigate("/signin");
                  }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign in */}
              <button className="signin-button" type="submit">
                <span>Sign in</span>
                <LuArrowRight size={20} />
              </button>
            </form>

            {/* Divider */}
            <div className="divider">
              <span></span>
              <p>or continue with</p>
              <span></span>
            </div>

            {/* Google */}
            <button
              className="social-button"
              onClick={() => {
                setErr("This Feature is not yet available");
              }}
            >
              <div className="google-icon">G</div>
              <span>Continue with Google</span>
            </button>

            {/* Signup */}
            <div className="signup-text">
              <span>Don't have an account?</span>
              <Link to="/signup">Sign up</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
