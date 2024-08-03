// RootLayout.js
"use client";
import React, { useState, useRef } from "react";
import Cssfile from "./Cssfile";
import Jsfile from "./Scripts";
import Topbar from "./topbar";
import Sidebar from "./sidebar";
import TokenDecoder from "./Cookies";
import LogoutInactiveUser from "./LogoutInactiveUser";
import "../page.module.css";
import Rightbar from "./Rightbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import Loader from "./Loader"; // Import the Loader component
export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [sidePanelStat, setSidePanelStat] = useState(false);
  const userdata = TokenDecoder();
  const avtaar = userdata ? userdata.avatar : null;
  const userrole = userdata ? userdata.role : null;
  const buttonRef = useRef(null);
  const pathname = usePathname();
  setTimeout(() => {
    setLoading(false);
  }, 2000);
  
  return (
    <>
      {loading && <Loader />} {/* Conditionally render the loader */}
      <div
        style={{
          visibility: loading ? "hidden" : "visible",
          opacity: loading ? 0 : 1,
        }}
      >
        <Cssfile />
        <div data-sidebar="dark">
          <div id="layout-wrapper">
            <div className="relative ">
              <div className="">
                <Topbar
                  sidePanelStat={sidePanelStat}
                  setSidePanelStat={setSidePanelStat}
                  avtaar={avtaar}
                  userrole={userrole}
                  userdata={userdata}
                  buttonRef={buttonRef}
                />
              </div>
              <div>
               
                <Sidebar sidePanelStat={sidePanelStat} buttonRef={buttonRef} setSidePanelStat={setSidePanelStat} avtaar={avtaar} userrole={userrole} userdata={userdata}/>
                
              </div>
            </div>

            
            <div className={``}>
            <div className={`` }>
                <ToastContainer />
                {children}
              </div>
            </div>
            <Rightbar />
          </div>
        </div>
        <Jsfile />
      </div>
    </>
  );
}
