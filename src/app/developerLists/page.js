"use client";
import RootLayout from "@/app/components/layout";
import '@/app/components/loader.css'
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
const Developers = () => {
  const [devName, setDevName] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [devLoad, setDevLoad] = useState(false);
  const [devData, setDevData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [orgData, setOrgData] = useState([]);
  const [editInputData, setEditData] = useState();
  const [editError, setEditError] = useState(false)
  
  const addDeveloper = () => {
    if (devName) {
        setLoading(true);
      try {
        axios
          .post("/api/Developer/add", { devloperName: devName })
          .then((res) => {});
        setDevName("");
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    } else {
      setValidationError(true);
    }
  };
  

  useEffect(() => {
    setDevLoad(true);
    try {
      setDevLoad(false);
      axios.get("/api/Developer/get").then((res) => {
        setDevData(res.data.data);
        setOrgData(res.data.data);
      });
    } catch (err) {
      setDevLoad(false);
      console.log(err);
    }
  }, []);

  const editData = (index, name, id) => {
    if (editInputData) {
      if (editInputData.Developer == name) {
            return        
      } else {
        try {
          axios
            .put("/api/Developer/update", {
              id: id,
              Developer: editInputData.Developer,
            })
            .then((res) => {
              console.log(res.data.data);
            });
          setDevData((prev) =>
            prev.map((oldDev) =>
              oldDev._id == id
                ? { ...oldDev, Developer: editInputData.Developer }
                : oldDev
            )
          );
          setEditData(null);
          setEditIndex(null);
          setEditError(false)   
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
   const textRef = useRef(null);
   const inputRef = useRef(null)
   const [tableHeight, setTableHeight] = useState('auto');
   useEffect(() => {
      if (inputRef.current && textRef.current) {
        const newHeight = `calc(100vh - ${inputRef.current.clientHeight + textRef.current.clientHeight + 150}px)`;
        setTableHeight(newHeight);
      }
    }, [inputRef.current, textRef.current]);
   
   
    
  return (
    <RootLayout>
      <div className="flex justify-end w-full mt-20 !px-0">
        <div className="tablet:w-[calc(100%-100px)]  mobile:w-full h-full overflow-x-hidden">
          <div className="w-full px-4 py-4">
            <p ref={textRef} className="text-lg font-[500] !m-0 font-Satoshi w-full ">
              Developers
            </p>
            
            
            <div className={`w-full flex justify-center items-center `}>
            
              <div ref={inputRef} className={`w-[60%] flex justify-center relative items-center space-x-2`}>
                <input className={`flex-1 px-3 py-2 rounded-md `} placeholder="Enter Developer Name"
                  value={devName}
                  onChange={(e) => {
                    setDevName(e.target.value);
                    setValidationError(false);
                  }} />
                   <p
                  className={
                    "!mb-0 !ml-0 !mt-0 text-red-500 absolute -bottom-6 left-0"
                  }
                >
                  {validationError ? "Enter Name first" : ""}
                </p>
                <div   onClick={addDeveloper}
                  className={`px-3 py-2 cursor-pointer rounded-lg text-slate-100 font-Satoshi ${
                    validationError
                      ? "bg-red-400"
                      : "bg-black hover:bg-gray-900"
                  }`}>{loading ? <svg className='svgBox' viewBox="25 25 50 50">
                      <circle r="20" cy="50" cx="50"></circle>
                    </svg> : "Add Developer"}</div>
                                </div>
                                </div>
                                
            
              <div className={`w-full flex justify-center mt-8 items-center `}>
                <div className={`w-[75%] relative overflow-y-scroll shadow-md sm:rounded-lg`} style={{ height: tableHeight }}>
                        <table class="w-full   border-collapse  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead class="text-xs sticky top-0 left-0 text-gray-700 uppercase bg-gray-50  ">
                                <tr>
                                    <th scope="col" className="px-3 py-3">
                                        S No.
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Developer Name
                                    </th>
                                    <th scope="col" className="px-2 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody  >
                         
                                    {devData
                    ? devData.map((devs, index) => {
                        return (
                          <tr
                            key={index}
                            className="bg-white border-b hover:bg-gray-50  "
                          >
                            <td class="px-3 py-3"> {index+1} </td>
                          
                            <td class="px-6 py-3">
                                
                             
                              <input
                              className={`  ${editError && editIndex == index ? 'border-red-500' : ''} focus:outline-none !border capitalize px-3 py-2 disabled:!bg-transparent disabled:text-slate-800 bg-gray-200 text-black rounded-md`}
                              disabled={editIndex != index}
                              value={
                                editInputData
                                  ? editInputData._id == devs._id
                                    ? editInputData.Developer
                                    : devs.Developer
                                  : devs.Developer
                              }
                              onChange={(e) => {
                                setEditData((prev) =>
                                  prev._id == devs._id
                                    ? { ...prev, Developer: e.target.value }
                                    : prev
                                );
                                
                                setEditError(false)   
                              }
                                 
                              }
                              
                              />
                            
                              
                              
                                 
                            </td>

                           <td class="px-2 py-3">
                            {editIndex === index ? (
                              <div className={`flex items-center gap-2`}>
                                <IoMdCheckmark
                                className={`${editInputData.Developer == devs.Developer ? 'text-slate-600' : 'text-green-500' }  text-xl cursor-pointer`}
                                onClick={() => {
                                  editData(index, devs.Developer, devs._id);
                                }}
                              />
                              <IoMdClose className={"text-red-500 text-xl cursor-pointer"}   onClick={() => {
                                  setEditIndex(null)
                                  setEditData(null)
                                  setEditError(false)
                                }} />
                              </div>
                            ) : (
                              <div className={` `}>
                                <FaEdit
                                className={" text-xl cursor-pointer"}
                                onClick={() => {
                                  setEditIndex((prev) => {
                                    if (
                                      prev !== null &&
                                      devData[prev]._id === editInputData._id
                                    ) {
                                      if (
                                        devData[prev].Developer !=
                                        editInputData.Developer
                                      ) {
                                        setEditError(true)
                                        return prev;
                                      }
                                    } else {
                                      setEditData(devs);
                                      return index;
                                    }
                                    setEditData(devs);
                                    return index;
                                  });
                                }}
                              />
                            
                              </div>
                            )}</td>
                          </tr>
                        );
                      })
                    : "loading..."}
                                     
                         
                                
                            </tbody>
                        </table>
                </div>
            </div>
            
            
            
           
          </div>
        </div>
      </div>
    </RootLayout>
  );
};
export default Developers;
