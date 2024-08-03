"use client";
import Image from 'next/image';
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import styles from './style.css'


function SignupPage() {
  const router = useRouter();
  const [user, setUser]= React.useState({
    email: "",
    password: "",
    username: "",
  })
  const [buttonDisabled,SetButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSignup = async (event) => {
    event.preventDefault(); 
    try{
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("signup success", response.data);
      router.push("/login")

    }
    catch(error){
      console.log(error);

    }finally{
      setLoading(false);
    }

  }

  useEffect(()=>{
    if(user.email.length >0 && user.password.length>0 && user.username.length>0){
      SetButtonDisabled(false);
    }
    else{
      SetButtonDisabled(true);

    }
  },[user])
  return (
<div className="d-flex align-items-center justify-content-center vh-100 bg-blue">
  <div className="container">
  <div className="img-div">
      <Image
        src="/logo.png"
        alt="Logo"
        layout="fill"
        objectFit="contain"
        objectPosition="center"
      />
    </div>
    <div className="my-auto">
      <form>
        <h5 className="text-center">{loading ? "processing" : "Signup"}</h5>
        <div className="form-group">
          <label htmlFor="name">Username</label>
          <input
            type="text"
            id="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dob">Email Address</label>
          <input
            type="email"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="form-control"
            name="dob"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Password</label>
          <input
            type="password"
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="form-control"
            name="email"
          />
        </div>
        <div className="form-group">
          <button
            onClick={onSignup}
            type="submit"
            className="btn btn-primary w-100"
            disabled={buttonDisabled}
          >
            {buttonDisabled ? "No Signup" : "Signup"}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

  )
}

export default SignupPage