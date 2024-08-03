"use client";
import React from "react";
 
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import TokenDecoder from "./Cookies";
import {   usePathname } from "next/navigation";
import axios from "axios";
import { GoHome } from "react-icons/go";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { MdPeople } from "react-icons/md";
import { FaHandshake } from "react-icons/fa6";
 import {motion} from 'framer-motion'
import { IoGitNetworkSharp } from "react-icons/io5";
 
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaChevronDown } from "react-icons/fa";
const Sidebar = ({ sidePanelStat, setSidePanelStat,buttonRef }) => {
 
  
  const handleLogout = () => {
    axios
      .post("/api/users/logout")
      .then(() => {
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Failed to logout inactive user:", error);
      });
  };

  const userdata = TokenDecoder();
const userid = userdata ? userdata.id : null;
const userrole = userdata ? userdata.role : null;
const hidden = ['Admin', 'superAdmin', 'Operations', 'HR']
   const sideMenus = [
    {
      id: 0,
      name: "profile",
      link: "/profile",
      icon: <GoHome />,
      visibility: ["all"],
    },
    {
      id: 1,
      name: "staff",
      link: "/Staff",
      icon: <MdPeople />,
      notifications: 5,
      visibility: ["hr", "admin", "superadmin"],
    },
    {
      id: 2,
      name: "leads",
      link: "",
      icon: <IoGitNetworkSharp />,
      nested: [
        {
          name: "Community Leads",
          link: "/Community-Leads",
          visibility: [
            "admin",
            "superadmin",
            "bussinesshead",
            "pnl",
            "tl",
            "atl",
            "fos",
            "operations",
            "marketing",
          ],
        },
      ],
      visibility: [
        "marketing",
        "admin",
        "superadmin",
        "operations",
        "bussinesshead",
        "pnl",
        "tl",
        "atl",
        "fos",
      ],
    },
    {
      id: 3,
      name: "reports",
      link: "",
      icon: <HiOutlineClipboardDocumentCheck />,
      nested: [
        {
          name: "Timesheet",
          link: "/Timesheet",
          visibility: [
            "admin",
            "superadmin",
            "bussinesshead",
            "pnl",
            "tl",
            "atl",
            "fos",
            "hr"
          ],
        },
        {
          name: "Detailed progress report",
          link: "/Detailed-Progress-Report",
          visibility: [
            "admin",
            "superadmin",
            "hr",
            "bussinesshead",
            "pnl",
            "tl",
            "atl",
            "fos",
          ],
        },
      ],
      visibility: [
        "admin",
        "superadmin",
        "hr",
        "bussinesshead",
        "pnl",
        "tl",
        "atl",
        "fos",
      ],
    },
    {
      id: 4,
      name: "your deals",
      link: "",
      icon: <FaHandshake />,
      nested: [
        {
          name: "Deals Approvals",
          link: "/Your-Deals",
          visibility: [
            "admin",
            "superadmin",
            "bussinesshead",
            "pnl",
            "tl",
            "atl",
            "fos",
            "marketing",
            "operations"
          ],
        },
        {
          name: "KYC and Sanction",
          link: "/KYC-and-Sanctions",
          visibility: [
            "admin",
            "superadmin",
            "operations",
 
          ],
        },
        {
          name: "MIS",
          link: "/mis",
          visibility: ["admin", "superadmin", "finance"],
        },
      ],
      visibility: [
        "admin",
        "superadmin",
        "bussinesshead",
        "pnl",
        "tl",
        "atl",
        "fos",
        "operations",
        "marketing",
        "finance"
      ],
    },

    {
      id: 5,
      name: "Log out",
      icon: <RiLogoutCircleLine />,
      visibility: ["all"],
    },
  ];
 
 
 
  const pathname = usePathname();
 
  const path = usePathname();

  const [currIndex, setCurrentIndex] = useState(null)
  const sidehandler = (index) => {
    if (currIndex == index) { 
      setCurrentIndex(null)
    }
    else {
      setCurrentIndex(index)
    }
    if (sideMenus[index].nested) { 
      setSidePanelStat(true)
    }
    if (index == 5) { 
      handleLogout();
    }
    
  }
   const divRef = useRef(null);

  
  

  // Effect to add and remove click outside event listener
  const handleClickOutside = (event) => {
    if (
      divRef.current &&
      !divRef.current.contains(event.target) &&
      !(buttonRef.current && buttonRef.current.contains(event.target))
    ) {
      setSidePanelStat(false);
    }
  };
    
    
  // Effect to add and remove click outside event listener
  useEffect(() => {
    if (sidePanelStat) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidePanelStat]);
   
  return (
    <>
       <>
      <motion.div  
        className={`fixed   top-16  tablet:h-[calc(100vh-4rem)] mobile:h-[calc(100vh+4rem)] shadow-md bg-white  z-[9999]  ${sidePanelStat ? "w-[300px] tablet:block mobile:block " : "w-[100px] tablet:block mobile:hidden"}`}
     
       ref={divRef}
      >
        <div
          className={`flex flex-col justify-start  items-center relative h-full`}
        >
          <div
            className={`flex flex-col w-full  gap-1 ${
              sidePanelStat ? "" : "items-center"
            }`}
          >
            <div
              className={` flex w-full tablet:px-4 mobile:px-1 justify-start transition-all duration-200  ${
                sidePanelStat ? "" : ""
              }`}
            ></div>

            <div
              className={`flex flex-col items-center gap-2 tablet:px-5 mobile:px-3  w-full  ${
                sidePanelStat ? " " : ""
              }`}
            >
              {sideMenus.map((elem, index) => {
                return elem.visibility?.includes(userrole?.toLowerCase()) ||
                  elem.visibility?.includes("all") ? (
                  <Link
                    href={elem.link ? elem.link : ""}
                    className={`flex relative flex-col items-center !mb-0 text-black justify-start gap-2 w-full ${
                      elem.name == "Log out"
                        ? "hover:!bg-red-400"
                        : "hover:bg-slate-100 "
                    } rounded-md transition-all duration-200 cursor-pointer items-center  py-1 group justify-between  ${
                      pathname == elem.link  ? "bg-slate-100" : ""
                    } `}
                    onClick={() => sidehandler(index)}
                    key={index}
                  >
                    {!sidePanelStat && (
                      <div className="absolute left-[100%] capitalize group-hover:block hidden z-[999] rounded-md top-3 px-2 bg-black text-white text-nowrap">
                        {elem.name}
                      </div>
                    )}
                    <div className="flex items-center px-2 justify-between gap-2 w-full">
                      <div
                        className={`transition-all  p-2 flex justify-start items-center gap-3   duration-200  cursor-pointer rounded-lg`}
                      >
                        <p className="!mb-0 text-2xl">{elem.icon}</p>
                        <p
                          className={`!mb-0 font-Satoshi font-[500] !text-md text-nowrap !mb-0 !mt-0 capitalize ${
                            sidePanelStat ? "block " : "hidden"
                          }`}
                        >
                          {elem.name}
                        </p>
                      </div>

                      {sidePanelStat && elem.notifications && (
                        <div className="bg-[#8EE4FF] flex justify-center size-5 rounded-full items-center">
                          {elem.notifications}
                        </div>
                      )}

                      {elem.nested && <FaChevronDown />}
                    </div>

                    {sidePanelStat && currIndex
                      ? index == currIndex && sideMenus[currIndex].nested
                        ? elem.nested.map((nest, id) =>
                            nest?.visibility &&
                            nest?.visibility.includes(
                              userrole.toLowerCase()
                            ) ? (
                              <Link
                                key={id}
                                className={`w-full text-md py-2 hover:bg-slate-200 px-2 text-black ${
                                  pathname === nest.link ? "bg-slate-100" : ""
                                }`}
                                href={nest.link || ""}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <p className="!mb-0 ml-12 font-medium">
                                  {nest.name}
                                </p>
                              </Link>
                            ) : null
                          )
                        : null
                      : null}
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </>
    </>
  );
};

export default Sidebar;
