import React, { useState, useEffect, useMemo, useCallback } from "react";
import styles from "../Modal.module.css";
import axios from "axios";
import SearchableSelect from "../Leads/dropdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";
import { useDropzone } from "react-dropzone";
import DocumentModal from "./doument";
import { NumericFormat } from "react-number-format";
import { MdOutlineClose } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import Meetingshowmodal from "../components/meetingshow";
import { IoIosArrowDropright } from "react-icons/io";
import moment from "moment/moment";
const EditModal = ({
  userData,
  onClose2,
  meetingshowtogle,
  setMeetingId,
  setReminderId,
}) => {
  const [showModal, setShowModal] = useState(true);
  const [savedUser, setSavedUser] = useState(null);
  const [parentStaff, setParentStaff] = useState([]);
  const [userid, setuserid] = useState(null);

  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("tab1"); // State to keep track of active tab

  const handleTabClick = (tabId, e) => {
    setActiveTab(tabId);
    e.stopPropagation(); // Update active tab state when tab is clicked
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const imageData = formData.filePreview.split(",")[1];
      const response = await axios.post("/api/staff/add", {
        ...formData,
        image: imageData,
        PrentStaff: formData.PrentStaff, // Use PrentStaff as the key
      });
      setSavedUser(response.data.savedUser);
      setuserid(response.data.savedUser._id);
      setShowModal(false); // Close the Modal
      setIsDocumentModalOpen(true);
      setUsers((prevUsers) => [...prevUsers, response.data.savedUser]); // Update the list of users
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const [Reminders, setReminders] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData._id) {
          const response = await axios.get(`/api/Reminder/get/${userData._id}`);
          setReminders(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    if (userData._id) {
      fetchData();
    }
  }, [userData._id]);

  const [Meeting, setMeetings] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData._id) {
          const response = await axios.get(`/api/Meeting/get/${userData._id}`);
          setMeetings(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    if (userData._id) {
      fetchData();
    }
  }, [userData._id]);

  const [showReminderComment, setShowReminderComment] = useState(false);
  console.log(Meeting);
  return (
    <>
      {showModal && (
        <div
          className={
            "fixed top-0 left-0 w-full h-full flex justify-center items-start  bg-slate-700/30 z-[999999999999999999999999999]"
          }
        >
          <div className={`bg-white px-7 py-4   rounded-lg mt-28`}>
            <div className=" flex w-full justify-between items-center">
              <p className="!mt-0 capitalize !mb-0 text-3xl font-Satoshi font-[500] flex items-end gap-2">
              {
                  userData.Name
              }
              <span className='text-lg'>
              ({              
                  userData.Phone
              })
              </span>
              </p>
              <p
                className="text-4xl hover:text-red-500 !mt-0 !mb-0 cursor-pointer "
                onClick={onClose2}
              >
                <MdOutlineClose />
              </p>
            </div>
            <div className="card-body mt-7 p-0">
              <div className="container">
                <div className="flex gap-3 mb-4">
                  <button
                    className={`text-gray-600 px-4 rounded-lg font-[500] font-Satoshi text-lg py-2 ${
                      activeTab === "tab1"
                        ? "bg-gray-200"
                        : "hover:bg-slate-100"
                    }`}
                    onClick={(e) => handleTabClick("tab1", e)}
                  >
                    Description
                  </button>
                  <button
                    className={`text-gray-600 px-4 rounded-lg font-[500] font-Satoshi text-lg py-2 ${
                      activeTab === "tab2"
                        ? "bg-gray-200"
                        : "hover:bg-slate-100"
                    }`}
                    onClick={(e) => handleTabClick("tab2", e)}
                  >
                    Reminders
                  </button>
                  <button
                    className={`text-gray-600 px-4 rounded-lg font-[500] font-Satoshi text-lg py-2 ${
                      activeTab === "tab3"
                        ? "bg-gray-200"
                        : "hover:bg-slate-100"
                    }`}
                    onClick={(e) => handleTabClick("tab3", e)}
                  >
                    Meetings
                  </button>
                  <button
                    className={`text-gray-600 px-4 rounded-lg font-[500] font-Satoshi text-lg py-2 ${
                      activeTab === "tab4"
                        ? "bg-gray-200"
                        : "hover:bg-slate-100"
                    }`}
                    onClick={(e) => handleTabClick("tab4", e)}
                  >
                    Activity Log
                  </button>
                </div>
                <div className="border rounded-lg p-4 h-72 overflow-y-auto">
                  {activeTab === "tab1" && (
                    <div>This is tab 1 content. desc </div>
                  )}
                  {activeTab === "tab2" && (
                    <div className="flex flex-col justify-center gap-2 items-center">
                    <div className='w-full flex items-center gap-2'><p className="text-lg font-[500] !mb-0 !mt-0">Total Reminders </p> <div className="text-lg  !mb-0 !mt-0" >{Reminders.length}</div></div>
                      {Reminders.length <= 0 ? (
                        <div className="">
                          <p className="text-2xl">No Reminder to show</p>
                        </div>
                      ) : (
                        <div className={`w-full flex flex-col gap-2`}>
                          {Reminders.map((reminder, index) => {
                            return (
                              <div
                                key={index}
                                className={`w-full bg-slate-50 rounded-md py-2 px-1`}
                              >
                                <div className="w-full justify-between flex gap-2 items-center">
                                  <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                                    {reminder.Assignees.username}
                                  </p>
                                  <p className="!mb-0 !mt-0 mr-2">
                                    {moment(reminder.DateTime).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </p>
                                </div>
                                <p className="!mb-0 !mt-0">
                                  {reminder.Comment}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <button
                        onClick={() => {
                          meetingshowtogle(userData._id);
                          setReminderId(userData._id._id);
                        }}
                        className=" font-Satoshi text-lg !border-0 bg-gray-100 hover:!bg-gray-200 rounded-lg px-3 py-2 font-[400]"
                      >
                        Add Reminder
                      </button>
                    </div>
                  )}
                  {activeTab === "tab3" && (
                    <div className="flex flex-col justify-center gap-2 items-center">
                    <div className='w-full flex items-center gap-2'><p className="text-lg font-[500] !mb-0 !mt-0">Total Meetings </p> <div className="text-lg  !mb-0 !mt-0" >{Meeting.length}</div></div>
                      {Meeting.length <= 0 ? (
                        <div className="">
                          <p className="text-2xl">No Meeting to show</p>
                        </div>
                      ) : (
                        <div className={`w-full flex flex-col gap-2`}>
                          {Meeting.map((meeting, index) => {
                            return (
                              <div
                                key={index}
                                className={`w-full bg-slate-50 rounded-md py-2 px-1`}
                              >
                                <div className="gap-2 items-center">
                                  <div className="flex w-full justify-between items-center">
                                    <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                                      Added by:{" "}
                                      <span className="text-lg font-[400]">
                                        {meeting.addedby.username}
                                      </span>{" "}
                                    </p>{" "}
                                    <p className="!mb-0 !mt-0 mr-3">
                                      {moment(meeting.MeetingDate).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </p>
                                  </div>
                                  <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                                    Subject:{" "}
                                    <span className="text-lg font-[400]">
                                      {meeting.Subject}
                                    </span>{" "}
                                  </p>
                                  <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                                    Priority:{" "}
                                    <span className="text-lg font-[400]">
                                      {" "}
                                      {meeting.Priority}{" "}
                                    </span>
                                  </p>
                                  <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                                    Type:{" "}
                                    <span className="text-lg font-[400]">
                                      {" "}
                                      {meeting.MeetingType}{" "}
                                    </span>
                                  </p>
                                  <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                                    Location:{" "}
                                    <span className="text-lg font-[400]">
                                      {meeting.Location}
                                    </span>
                                  </p>
                                  <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                                    Status:{" "}
                                    <span className="text-lg font-[400]">
                                      {meeting.Status}
                                    </span>
                                  </p>
                                  {meeting.MeetingType == "Secondary" ? (
                                    meeting.directoragnet != "Direct" && (
                                      <div>
                                        {" "}
                                          <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                                          Agent Name:{" "}
                                          <span className="text-lg font-[400]">
                                            {" "}
                                            {meeting.agentName}
                                          </span>
                                        </p>{" "}
                                        <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                                          Agent Company:{" "}
                                          <span className="text-lg font-[400]">
                                            {" "}
                                            {meeting.agentCompany}
                                          </span>
                                        </p>{" "}
                                      
                                        <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                                          Agent Phone:{" "}
                                          <span className="text-lg font-[400]">
                                            {" "}
                                            {meeting.agentPhone}
                                          </span>
                                        </p>{" "}
                                      </div>
                                    )
                                  ) : (
                                    <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                                      Developer:{" "}
                                      <span className="text-lg font-[400]">
                                        {meeting.Developer}
                                      </span>
                                    </p>
                                  )}
                                  <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                                    Comment:{" "}
                                    <span className="text-lg font-[400]">
                                      {meeting.Comment}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <button
                        onClick={() => {
                          meetingshowtogle(userData._id);
                          setMeetingId(userData._id);
                        }}
                        className=" font-Satoshi text-lg !border-0 bg-gray-100 hover:!bg-gray-200 rounded-lg px-3 py-2 font-[400]"
                      >
                        Add Meeting
                      </button>
                    </div>
                  )}
                  {activeTab === "tab4" && <div>This is tab 4 content.</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditModal;
