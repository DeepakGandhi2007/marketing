"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../signup/style.css";
import RootLayout from "../layout";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";


function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, SetButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [loginStatus, setLoginStatus] = useState()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const onLogin = async (event) => {
    event.preventDefault();
    setIsLoggingIn(true)
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("login success", response.data);
      setLoginStatus(response.data)
      console.log(response.data)
      router.push("/profile");
    } catch (error) {
      console.log(error);
      setLoginStatus(error.response.data)
      
    } finally {
      setLoading(false);
            setIsLoggingIn(false)
      
    }
  };
  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      SetButtonDisabled(false);
    } else {
      SetButtonDisabled(true);
    }
  }, [user]);

  console.log(loginStatus)

  return (
    <RootLayout>
      <div className="h-screen w-full">
        <div className=" w-full flex flex-col justify-between items-start h-full bg-gradient-to-br from-[#85D6FF] via-[#0584FF] to-[#002F85]">

          <div className="w-full flex justify-start"><img src={'/login-logo.png'}  className="!ml-10 !mt-7 lg:w-[150px] mobile:w-[100px]" /></div>
          
          <form className="flex  flex-col min-w-[360px] px-7 justify-center h-[435px]   gap-4 !bg-gray-50/80">
                
                <p className={` ${loading ? 'text-xl' : 'text-xl'} tracking-tighter font-Satoshi font-[900]  !w-full !text-center`}>
                  {loading ? "Your Sales Journey Begin Here" : "Welcome Back"}
                </p>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="!text-[1.2rem]  !font-Satoshi !font-semibold">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) =>
                          setUser({ ...user, email: e.target.value })
                        }
                        className="w-full !border !border-gray-700 !bg-transparent  focus:outline-none h-12 !pl-8 !rounded-lg hover:shadow-md transition-all placeholder:text-slate-600 placeholder:font-semibold duration-300 focus:shadow-md !text-[1rem]"
                        placeholder="Enter your email"
                      />
                      <MdOutlineAlternateEmail  className="absolute text-xl left-2 top-[50%] translate-y-[-50%]"/>
                </div>
                <p className="h-5 text-red-500">{ loginStatus?.error?.includes('User') ? 'Email not found' : ''}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="!text-[1.2rem] !font-Satoshi !font-semibold">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        value={user.password}
                        onChange={(e) =>
                          setUser({ ...user, password: e.target.value })
                        }
                        className="w-full !bg-transparent  !border !border-gray-700 focus:outline-none h-12 !pl-8 !rounded-lg hover:shadow-md transition-all duration-300 focus:shadow-md placeholder:text-slate-600 placeholder:font-semibold !text-[1rem]"
                        placeholder="Enter your password"
                      />
                
                      <FaLock  className="absolute text-xl left-2 top-[50%] translate-y-[-50%]"/>
                </div>
                <p className="h-5 text-red-500">{ loginStatus?.error?.includes('password') ? 'Incorrect Password' : ''}</p>
              </div>
                
                </div>
                <div className="w-full ">
                  <button
                    onClick={onLogin}
                    type="submit"
                    className="disabled:!bg-gray-800 disabled:text-gray-500 !mt-0 !border-0 disabled:font-semibold w-full font-medium bg-black text-slate-50 !rounded-lg py-2 text-xl font-Satoshi hover:!bg-gray-900"
                    disabled={buttonDisabled}
                  >
                       {
                isLoggingIn ? <p className="!mb-0">Logging in...</p> : <p className="!mb-0">Log in</p>
                }
                  </button>
                </div>
              </form>
              
            <div className="w-full flex justify-start w-[150px] h-[35px]"> </div>
          
        </div>
      </div>
    </RootLayout>
  );
}

export default LoginPage;
