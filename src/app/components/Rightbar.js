import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import TokenDecoder from "./Cookies";
const Rightbar = () => {
    const rightsidebar = (e) => {
        e.preventDefault();
        document.body.classList.remove("right-bar-enabled");
    };
 const userdata = TokenDecoder();
  const userrole = userdata ? userdata.role : null;
    return (
        <>
            <div className="right-bar">
                <div className="rightbar-title d-flex align-items-center px-3 py-4">
                    <h5 className="m-0 me-2">Settings</h5>
                    <a href="/" className="right-bar-toggle ms-auto" onClick={rightsidebar}>
                        <i className="mdi mdi-close noti-icon" />
                    </a>
                </div>

                <div id="sidebar-menu">
                    <ul className="metismenu list-unstyled" id="side-menu">
                        <li className="menu-title">Menu</li>
                        {
                            userrole == 'superAdmin' || userrole == 'Admin'  || userrole == 'Marketing' || userrole == 'Operations' || userrole == 'BussinessHead' || userrole == 'PNL' || userrole == 'TL' || userrole == 'FOS' || userrole == 'ATL' ? <li>
                            <Link href={'/Tags'}>
                                <i className=" ri-price-tag-3-fill"></i>
                                <span className="badge rounded-pill bg-success float-end">3</span>
                                <span>Tags</span>
                            </Link>
                        </li> : null
                        }
                        <li>
                           {
                                userrole == 'superAdmin' || userrole == 'Admin' ?  <Link href={'RolePerms'}>
                                <i className=" ri-price-tag-3-fill"></i>
                                <span className="badge rounded-pill bg-success float-end">3</span>
                                <span>Role Permissions</span>
                            </Link> : null
                           }
                        </li>
                         <li className="menu-title">Menu</li>
                       <li>
                            <Link href={'/Status/list'}>
                                <i className=" ri-price-tag-3-fill"></i>
                                <span className="badge rounded-pill bg-success float-end">3</span>
                                <span>Status</span>
                            </Link>
                        </li> 
                        <li>
                            <Link href={'/Source/list'}>
                                <i className=" ri-price-tag-3-fill"></i>
                                <span className="badge rounded-pill bg-success float-end">3</span>
                                <span>Source</span>
                            </Link>
                        </li> 
                    </ul>
                </div>

            </div>
        </>
    );
};

export default Rightbar;
