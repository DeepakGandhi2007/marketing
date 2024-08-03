"use client";
import axios from "axios";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import RootLayout from "@/app/components/layout";
import { FaPlus } from "react-icons/fa";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { RiUploadCloud2Fill } from "react-icons/ri";
import { SiGooglesheets } from "react-icons/si";
import { AiOutlinePlus } from "react-icons/ai";
import Excelmodal from "../Leads/excelmodal";
import BulkModal from "../components/bulk";
import MeetingModal from "../components/meetingmodal";
import { motion } from "framer-motion";
import EditModal from "@/app/components/editModal";
import ReminderModal from "../components/Remindermodal";
import ParsedDataTable from "../excel/page";
import SearchableSelect from "../Leads/dropdown";
import TokenDecoder from "../components/Cookies";
import Remindershowmodal from "../components/remindershow";
import Meetingshowmodal from "../components/meetingshow";
import { MdKeyboardArrowDown } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import moment from "moment/moment";
import LeadCard from "../components/leadCard";
import Image from "next/image";
import { MultiSelect } from "react-multi-select-component";
import { format } from "date-fns"; // Import date-fns format function for date formatting
import { DatePicker, Space } from "antd";
import { Select } from "antd";

const { RangePicker } = DatePicker;
function Cold() {
  const [toastShown, setToastShown] = useState(false);
  const [Leadss, setLead] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage, setleadsPerPage] = useState(50);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [longPressTimeout, setLongPressTimeout] = useState({});
  const [longPressedLeadId, setLongPressedLeadId] = useState(null);
  const [editLeadId, setEditLeadId] = useState(null);
  const [leadid, setLeadId] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [selectedTag, setSelectedTag] = useState([]);
  const [remindershow, setremindershow] = useState(false);
  const [meetingshow, setmeetingshow] = useState(false);
  const [TagsCount, setTagsCount] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selecteduser, setselecteduser] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [selectedstatus, setselectedstatus] = useState([]);
  const [selectedsource, setsource] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedValues2, setSelectedValues2] = useState([]);
  const [selectedValues3, setSelectedValues3] = useState([]);
  const [selectedValues4, setSelectedValues4] = useState([]);
  const [date, setDate] = useState([]);
  const [options2, setoptions2] = useState([]);
  const [SourceCount, setSourceCount] = useState([]);

  const router = useRouter();
  const userdata = TokenDecoder();
  const userid = userdata ? userdata.id : null;
  const userrole = userdata ? userdata.role : null;
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const fetchLead = async (pageNumber = 1) => {
    try {
      let url = "";
      if (userrole === "Admin") {
        url = `/api/Lead/get?page=${pageNumber}&limit=${leadsPerPage}`;
        if (searchTerm) {
          url += `&searchterm=${searchTerm}`;
        }
        if (selectedValues.length > 0) {
          url += `&selectedValues=${selectedValues}`;
        }
        if (selectedValues2.length > 0) {
          url += `&selectedValues2=${selectedValues2}`;
        }
        if (selectedValues3.length > 0) {
          url += `&selectedValues3=${selectedValues3}`;
        }
        if (selectedValues4.length > 0) {
          url += `&selectedTag=${selectedValues4}`;
        }
        if (date) {
          url += `&date=${date}`;
        }
      } else if (userrole === "superAdmin") {
        url = `/api/Lead/get?page=${pageNumber}&limit=${leadsPerPage}`;
        if (searchTerm) {
          url += `&searchterm=${searchTerm}`;
        }
        if (selectedValues.length > 0) {
          url += `&selectedValues=${selectedValues}`;
        }
        if (selectedValues2.length > 0) {
          url += `&selectedValues2=${selectedValues2}`;
        }
        if (selectedValues3.length > 0) {
          url += `&selectedValues3=${selectedValues3}`;
        }
        if (selectedValues4.length > 0) {
          url += `&selectedTag=${selectedValues4}`;
        }
        if (date) {
          url += `&date=${date}`;
        }
      } else if (userrole === "FOS") {
        url = `/api/Lead/FOS/${userid}?page=${pageNumber}&limit=${leadsPerPage}`;
        if (searchTerm) {
          url += `&searchterm=${searchTerm}`;
        }
        if (selectedValues.length > 0) {
          url += `&selectedValues=${selectedValues}`;
        }
        if (selectedValues2.length > 0) {
          url += `&selectedValues2=${selectedValues2}`;
        }
        if (selectedValues3.length > 0) {
          url += `&selectedValues3=${selectedValues3}`;
        }
        if (selectedValues4.length > 0) {
          url += `&selectedTag=${selectedValues4}`;
        }
        if (date) {
          url += `&date=${date}`;
        }
      } else if (userrole === "BussinessHead") {
        url = `/api/Lead/hiearchy?page=${currentPage}&limit=${leadsPerPage}?role=ATL&userid=${userid}`;
        if (searchTerm) {
          url += `&searchterm=${searchTerm}`;
        }
        if (selectedValues.length > 0) {
          url += `&selectedValues=${selectedValues}`;
        }
        if (selectedValues2.length > 0) {
          url += `&selectedValues2=${selectedValues2}`;
        }
        if (selectedValues3.length > 0) {
          url += `&selectedValues3=${selectedValues3}`;
        }
        if (selectedValues4.length > 0) {
          url += `&selectedTag=${selectedValues4}`;
        }
        if (date) {
          url += `&date=${date}`;
        }
      } else if (userrole === "PNL") {
        url = `/api/Lead/hiearchy?page=${currentPage}&limit=${leadsPerPage}?role=PNL&userid=${userid}`;
        if (searchTerm) {
          url += `&searchterm=${searchTerm}`;
        }
        if (selectedValues.length > 0) {
          url += `&selectedValues=${selectedValues}`;
        }
        if (selectedValues2.length > 0) {
          url += `&selectedValues2=${selectedValues2}`;
        }
        if (selectedValues3.length > 0) {
          url += `&selectedValues3=${selectedValues3}`;
        }
        if (selectedValues4.length > 0) {
          url += `&selectedTag=${selectedValues4}`;
        }
        if (date) {
          url += `&date=${date}`;
        }
      } else if (userrole === "TL") {
        url = `/api/Lead/hiearchy?page=${currentPage}&limit=${leadsPerPage}?role=TL&userid=${userid}`;
        if (searchTerm) {
          url += `&searchterm=${searchTerm}`;
        }
        if (selectedValues.length > 0) {
          url += `&selectedValues=${selectedValues}`;
        }
        if (selectedValues2.length > 0) {
          url += `&selectedValues2=${selectedValues2}`;
        }
        if (selectedValues3.length > 0) {
          url += `&selectedValues3=${selectedValues3}`;
        }
        if (selectedValues4.length > 0) {
          url += `&selectedTag=${selectedValues4}`;
        }
        if (date) {
          url += `&date=${date}`;
        }
      } else if (userrole === "ATL") {
        url = `/api/Lead/hiearchy?page=${currentPage}&limit=${leadsPerPage}?role=ATL&userid=${userid}`;
        if (searchTerm) {
          url += `&searchterm=${searchTerm}`;
        }
        if (selectedValues.length > 0) {
          url += `&selectedValues=${selectedValues}`;
        }
        if (selectedValues2.length > 0) {
          url += `&selectedValues2=${selectedValues2}`;
        }
        if (selectedValues3.length > 0) {
          url += `&selectedValues3=${selectedValues3}`;
        }
        if (selectedValues4.length > 0) {
          url += `&selectedTag=${selectedValues4}`;
        }
        if (date) {
          url += `&date=${date}`;
        }
      }

      const response = await axios.get(url);
      let filteredLeads = response.data.data;

      setLead(filteredLeads);
      setTotalLeads(response.data.totalLeads);

    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    fetchLead(currentPage);
  }, [
    userrole,
    userid,
    selectedTag,
    selectedValues,
    selectedValues2,
    selectedValues3,
    date,
    selectedTag,
    leadsPerPage,
    currentPage,
    searchTerm,
  ]);

  const [btnShow, setBtnShow] = useState(false);

  const filteredLeads = Leadss
    ? Leadss.filter(
      (lead) =>
        lead.Phone.toString() === searchTerm ||
        lead.Name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];
  const fetchDataAndDownloadExcel = async () => {
    try {
      const response = await axios.post(`/api/Lead/export/cold`);
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const groupedLeads = useMemo(() => {
    if (!Leadss) return [];
    return Leadss.reduce((groups, lead) => {
      const phoneNumber = lead.Phone;
      if (!groups[phoneNumber]) {
        groups[phoneNumber] = [];
      }
      groups[phoneNumber].push(lead);
      return groups;
    }, {});
  }, [Leadss]);

  const keys = Object.keys(groupedLeads);
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const changePage = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await fetchLead(pageNumber);
  };

  const nextPage = () => {
    const nextPageNumber = currentPage + 1;
    if (nextPageNumber <= Math.ceil(filteredLeads.length / leadsPerPage)) {
      changePage(nextPageNumber);
    }
  };

  const prevPage = () => {
    const prevPageNumber = currentPage - 1;
    if (prevPageNumber >= 1) {
      changePage(prevPageNumber);
    }
  };

  const openexcelmodal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const openbulkModal = () => {
    setIsModalOpen2(!isModalOpen2);
  };
  const handleLongPressStart = (leadId) => {
    const timeoutId = setTimeout(() => {
      setSelectedLeads((prevSelectedLeads) => {
        if (prevSelectedLeads.includes(leadId)) {
          return prevSelectedLeads.filter((id) => id !== leadId);
        } else {
          return [...prevSelectedLeads, leadId];
        }
      });
      setLongPressedLeadId(leadId);
    }, 500); // Adjust the time for long press as needed

    setLongPressTimeout((prevTimeouts) => ({
      ...prevTimeouts,
      [leadId]: timeoutId,
    }));
  };

  const handleCardClick = (cardId, e) => {
    e.stopPropagation();
    if (selectedLeads.includes(cardId)) {
      setSelectedLeads(selectedLeads.filter((id) => id !== cardId)); // Deselect if already selected
    } else {
      setSelectedLeads([...selectedLeads, cardId]); // Select if not selected
    }
  };

  const handleLongPressEnd = (event, leadId) => {
    event.preventDefault();
    clearTimeout(longPressTimeout[leadId]);
    setLongPressTimeout((prevTimeouts) => {
      delete prevTimeouts[leadId];
      return { ...prevTimeouts };
    });
    setLongPressedLeadId(null);
  };
  const handleSelectAll = () => {
    if (selectedLeads.length === currentLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(currentLeads.map((lead) => lead._id));
    }
    setSelectAll(!selectAll);
  };
  function disabledDate(current) {
    // Can not select days after today
    return current && current > moment().endOf("day");
  }
  const handleEditClick = (leadId) => {
    setEditLeadId((prevEditLeadId) =>
      prevEditLeadId === leadId ? null : leadId
    );
    setLeadId(leadId);
  };
  const [StatusCount, setStatusCount] = useState([]);
  const [options, setoptions10] = useState([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        let url = `/api/Status/get`;
        const response = await axios.get(url);
        setStatusCount(response.data.data);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchStatus();
  }, []);

  useEffect(() => {
    const newOptions2 = SourceCount.map(SourceCount => ({
      value: SourceCount._id,
      label: SourceCount.Source,
    }));
    setoptions2(newOptions2);
  }, [SourceCount]);

  useEffect(() => {
    const newOptions1 = StatusCount.map((StatusCount) => ({
      value: StatusCount._id,
      label: StatusCount.Status,
    }));
    setoptions10(newOptions1);
  }, [StatusCount]);

  const source = [
    { value: "Sm 1", label: "Sm 1" },
    { value: "Sm 2", label: "Sm 2" },
    { value: "Sm 3", label: "Sm 3" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [showReminderModal, setReminderModal] = useState(false);

  const handleButtonClick = () => {
    setShowModal(true);
  };
  const handleReminderClick = () => {
    setReminderModal(true);
  };
  const [Meeting, setMeetings] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (leadid) {
          const response = await axios.get(`/api/Meeting/get/${leadid}`);
          setMeetings(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    if (leadid) {
      fetchData();
    }
  }, [leadid]);




  const [Reminders, setReminders] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (leadid) {
          const response = await axios.get(`/api/Reminder/get/${leadid}`);
          setReminders(response.data.data);
          console.log(leadid)
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    if (leadid) {
      fetchData();
    }
  }, [leadid]);

  useEffect(() => {
    const fetchSource = async () => {
      try {
        let url = `/api/Source/get`;
        const response = await axios.get(url);
        setSourceCount(response.data.data);
      } catch (error) {
        console.error('Error fetching Source:', error);
      }
    };

    fetchSource();

  }, []);


  const handleParse = (data) => {
    setParsedData(data);
  };
  useEffect(() => {
    const fetchTags = async () => {
      try {
        let url = `/api/tags/get`;
        const response = await axios.get(url);
        setTagsCount(response.data.data);
      } catch (error) {
        console.error("Error fetching Tags:", error);
      }
    };

    fetchTags();
  }, []);
  const tagOptions = TagsCount.map((tag) => ({
    label: tag.Tag,
    value: tag._id,
  }));

  const options5 = [
    { value: "100", label: "100" },
    { value: "200", label: "200" },
    { value: "1000 ", label: "1000" },
  ];
  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      await axios.put(`/api/Lead/status/${leadId}`, { status: newStatus });
      setLeadss((prevLeads) =>
        prevLeads.map((lead) =>
          lead._id === leadId ? { ...lead, LeadStatus: newStatus } : lead
        )
      );
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };
  const handleInvoiceClick = (leadId) => {
    setSelectedLeadId(leadId);
  };

  const meetingshowtogle = () => {
    setmeetingshow((prevState) => !prevState);
  };
  const leadcountf = (value) => {
    setCurrentPage(1);
    setleadsPerPage(parseInt(value, 10));
  };
  const deleteSelectedLeads = async () => {
    try {
      await axios.delete(`/api/Lead/delete`, {
        data: { leadIds: selectedLeads },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting leads:", error);
    }
  };
  const baseUrl = "http://216.10.242.11:8080/"; // Your base URL

  const handleSubmission = () => {
    if (selectedLeads.length === 1) {
      const leadId = selectedLeads[0] ? selectedLeads[0].toString() : null;
      if (leadId) {
        window.location.href = `/Your-Deals/create?leadId=${leadId}`;
      } else {
        console.error("Lead ID is null.");
      }
    } else if (selectedLeads.length > 1) {
      toast.error("You have selected more than 1 Lead");
    } else {
      // Handle the case where no lead is selected
      toast.error("You Haven't Selected Any Lead");
    }
  };

  useEffect(() => {
    if (userrole !== null) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get("/api/staff/get");

          let filteredUsers = response.data.data;
          if (userrole == "BussinessHead") {
            const PNLUsers = response.data.data.filter(
              (user) => user.Role === "PNL" && user.PrentStaff === userid
            );
            const PNLIds = PNLUsers.map((user) => user._id);
            const tlUsers = response.data.data.filter(
              (user) => user.Role === "TL" && PNLIds.includes(user.PrentStaff)
            );
            const tlIds = tlUsers.map((user) => user._id);
            const atlUsers = response.data.data.filter(
              (user) => user.Role === "ATL" && tlIds.includes(user.PrentStaff)
            );
            const atlIds = atlUsers.map((user) => user._id);
            const fosUsers = response.data.data.filter(
              (user) => user.Role === "FOS" && atlIds.includes(user.PrentStaff)
            );
            filteredUsers = [...PNLUsers, ...tlUsers, ...atlUsers, ...fosUsers];
          } else if (userrole == "TL") {
            const atlUsers = response.data.data.filter(
              (user) => user.Role === "ATL" && user.PrentStaff === userid
            );
            const atlIds = atlUsers.map((user) => user._id);
            const fosUsers = response.data.data.filter(
              (user) => user.Role === "FOS" && atlIds.includes(user.PrentStaff)
            );
            filteredUsers = [...atlUsers, ...fosUsers];
          } else if (userrole == "PNL") {
            const tlUsers = response.data.data.filter(
              (user) => user.Role === "TL" && user.PrentStaff === userid
            );
            const tlIds = tlUsers.map((user) => user._id);
            const atlUsers = response.data.data.filter(
              (user) => user.Role === "ATL" && tlIds.includes(user.PrentStaff)
            );
            const atlIds = atlUsers.map((user) => user._id);
            const fosUsers = response.data.data.filter(
              (user) => user.Role === "FOS" && atlIds.includes(user.PrentStaff)
            );
            filteredUsers = [...tlUsers, ...atlUsers, ...fosUsers];
          } else if (userrole == "ATL") {
            const fosUsers = response.data.data.filter(
              (user) => user.Role === "FOS" && user.PrentStaff === userid
            );
            filteredUsers = [...fosUsers];
          } else if (userrole == "FOS") {
            const fosUsers = response.data.data.filter(
              (user) => user.Role === "FOS" && user._id === userid
            );
            filteredUsers = [...fosUsers];
          } else if (userrole == "Admin") {
            filteredUsers = response.data.data;
          }
          filteredUsers = filteredUsers.filter(
            (user) =>
              ![
                "HR",
                "Finance",
                "Manager",
                "Operations",
                "Marketing",
                "SalesHead",
              ].includes(user.Role)
          );

          const username =
            response.data.data.find((user) => user._id === userid)?.username ||
            "Default Username";
          const defaultOption = { value: userid, label: username };
          filteredUsers = filteredUsers.filter((user) => user._id !== userid);

          const mappedUsers =
            filteredUsers.length > 0
              ? [
                defaultOption,
                ...filteredUsers.map((user) => ({
                  value: user._id,
                  label: user.username,
                })),
              ]
              : [defaultOption];

          setUsers(mappedUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
    }
  }, [userrole]);

  const handleUserChange = (selected) => {
    setselecteduser(selected, "users");
    const selectedValues = selected.map((user) => user);
    setSelectedValues(selectedValues);
  };

  const handlestatusChange = (selected) => {
    setselectedstatus(selected);
    const selectedValues2 = selected.map((status) => status);
    setSelectedValues2(selectedValues2);
  };

  const handlesourceChange = (selected) => {
    setsource(selected);
    const selectedValues3 = selected.map((source) => source);
    setSelectedValues3(selectedValues3);
  };
  const handletagchage = (selected) => {
    setSelectedTag(selected);
    const selectedValues4 = selected.map((tags) => tags);
    setSelectedValues4(selectedValues4);
  };
  const handleDateChange = (date, datestring) => {
    if (date) {
      setDate([date[0].$d, date[1].$d]);
    } else {
      setDate(null);
    }
  };

  const [edit, setEdit] = useState(false);
  const toggleModal = (e) => {
    setEdit(!edit);
    e.stopPropagation();
  };
  const containerRef = useRef(null);
  const handleClickOutsideButton = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setBtnShow(false);
    }
  };
  useEffect(() => {
    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutsideButton);
    return () => {
      // Clean up event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutsideButton);
    };
  }, []);
  const [meetingId, setMeetingId] = useState();
  const [reminderId, setReminderId] = useState();
  console.log(options2)
  return (
    <RootLayout>
      <div className="  flex  justify-end  w-full mt-20   h-screen !px-0">
        <div className=" tablet:w-[calc(100%-100px)] flex flex-col ">
          {isModalOpen2 && <BulkModal onClose={openbulkModal} selectedLeads={selectedLeads} />}
          {isModalOpen && <Excelmodal onClose={openexcelmodal} onParse={handleParse} />}
          {isModalOpen && <Excelmodal onClose={openexcelmodal} onParse={handleParse} />}
          <div className="w-full px-4 py-4 ">
            <p className="font-Satoshi tablet:text-lg !mb-0 mobile:text-lg text-black font-bold">
              Leads
            </p>


            <div className="w-full tablet:grid tablet:grid-cols-6 mobile:flex mobile:flex-col mobile:justify-center tablet:items-center mobile:items-stretch mobile:gap-x-1 mt-2">
              <div className="tablet:col-span-4 mobile:col-span-1 grid tablet:grid-cols-6 mobile:grid-cols-3 items-center h-full mobile:order-last mobile:mt-3 tablet:mt-0 tablet:order-1 gap-x-1">
                <div className="w-full h-full cursor-pointer">
                  <RangePicker
                    format={"DD-MM-YYYY"}
                    style={{ width: "100%", height: "100%" }}
                    onChange={handleDateChange}
                    needConfirm
                    disabledDate={disabledDate}
                  />
                </div>

                <div className="w-full h-full cursor-pointer">
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%", height: "100%" }}
                    defaultValue={selecteduser}
                    onChange={handleUserChange}
                    options={users}
                    maxTagCount="responsive"
                    placeholder={"Users"}
                  />
                </div>

                <div className="w-full h-full cursor-pointer">
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%", height: "100%" }}
                    defaultValue={selectedstatus}
                    onChange={handlestatusChange}
                    options={options}
                    placeholder={"Status"}
                    maxTagCount="responsive"
                  />
                </div>

                <div className="w-full h-full cursor-pointer">
                  <Select
                    mode="multiple"
                    style={{ width: "100%", height: "100%" }}
                    allowClear
                    onChange={handlesourceChange}
                    options={options2}
                    placeholder={"Source"}
                    maxTagCount="responsive"
                  />
                </div>
                <div className="w-full h-full cursor-pointer">
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%", height: "100%" }}
                    defaultValue={selectedTag}
                    onChange={handletagchage}
                    options={tagOptions}
                    placeholder={"Tags"}
                    maxTagCount="responsive"
                  />
                </div>
                <div className="w-full h-full cursor-pointer">
                  <Select
                    mode="single"
                    style={{ width: "100%", height: "100%" }}
                    allowClear
                    defaultValue={selectedTag}
                    onChange={(selectedOption) =>
                      leadcountf(selectedOption.value)
                    }
                    options={options5}
                    placeholder={"Count"}
                  />
                </div>
              </div>
              <input
                className="rounded-md tablet:col-span-2 !border border-slate-300 text-lg focus:outline-none transition-all duration-200 focus:shadow-md bg-white px-3 py-1"
                placeholder="Search Leads.."
                value={searchTerm}
                onChange={handleSearchTermChange}
              />
            </div>
            <div className="flex items-center tablet:w-2/5 mobile:w-full gap-2 mt-3">
              <button
                onClick={handleSubmission}
                className="bg-[#83D2FF] hover:bg-transparent hover:border-[#83D2FF] border-2 transition-all duration-300 rounded-md tablet:px-3  tablet:py-2 mobile:px-2  mobile:py-2 tablet:text-md `mobile:text-sm font-Satoshi font-bold"
              >
                Submit Deal
              </button>
              <button
                onClick={openbulkModal}
                className="bg-[#83D2FF] hover:bg-transparent hover:border-[#83D2FF] border-2 transition-all duration-300 rounded-md tablet:px-3  tablet:py-2 mobile:px-2  mobile:py-2 tablet:text-md `mobile:text-sm font-Satoshi font-bold"
              >
                Mapping
              </button>
              {selectedLeads.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  className="bg-[#83D2FF] hover:bg-transparent hover:border-[#83D2FF] border-2 transition-all duration-300 rounded-md tablet:px-3  tablet:py-2 mobile:px-2  mobile:py-2 tablet:text-md `mobile:text-sm font-Satoshi font-bold"
                >
                  Select All
                </button>
              )}

              {userrole !== "FOS" && (
                <>
                  {selectedLeads.length > 0 && (
                    <button
                      onClick={deleteSelectedLeads}
                      className="bg-[#83D2FF] hover:bg-transparent hover:border-[#83D2FF] border-2 transition-all duration-300 rounded-md tablet:px-3  tablet:py-2 mobile:px-2  mobile:py-2 tablet:text-md `mobile:text-sm font-Satoshi font-bold"
                    >
                      Delete All
                    </button>
                  )}
                </>
              )}
            </div>

            <p className="font-Satoshi tablet:text-md mobile:text-sm mt-3 text-black font-bold">
              Showing {leadsPerPage} cards of {totalLeads}{" "}
            </p>

            <div className="grid gap-x-4 gap-y-4 mobile:grid-cols-1 tablet:grid-cols-3  desktop:grid-cols-3">
              {searchTerm ? (
                filteredLeads.length > 0 ? (
                  filteredLeads.map((currentLead) => {
                    return (
                      <>
                        <LeadCard
                          options={options}
                          currentLead={currentLead}
                          updateLeadStatus={updateLeadStatus}
                          handleCardClick={handleCardClick}
                          setEdit={setEdit}
                          selectedLeads={selectedLeads}
                          options2={options2}
                          Reminders={Reminders}
                        />
                        {edit === currentLead._id && (
                          <EditModal
                            userData={currentLead}
                            onClose2={(e) => toggleModal(e)}
                            meetingshowtogle={meetingshowtogle}
                            setMeetingId={setMeetingId}
                            setReminderId={setReminderId}
                          />
                        )}
                        {meetingId === currentLead._id && (
                          <MeetingModal
                            onClose={() => {
                              setShowModal(false);
                              setMeetingId(null);
                            }}
                            lead={currentLead._id}
                          />
                        )}
                        {reminderId === currentLead._id && (
                          <ReminderModal
                            onClose={() => {
                              setremindershow(false);
                              setReminderId(null);
                            }}
                            lead={currentLead._id}
                          />
                        )}
                      </>
                    );
                  })
                ) : (
                  <p>No leads found for the given search term.</p>
                )
              ) : Array.isArray(Leadss) ? (
                Leadss.map((currentLead) => {
                  return (
                    <>
                      <LeadCard
                        options={options}
                        currentLead={currentLead}
                        updateLeadStatus={updateLeadStatus}
                        handleCardClick={handleCardClick}
                        setEdit={setEdit}
                        selectedLeads={selectedLeads}
                        Reminders={Reminders}
                        options2={options2}
                      />
                      {edit === currentLead._id && (
                        <EditModal
                          userData={currentLead}
                          Reminders={Reminders}
                          Meeting={Meeting}
                          meetingshowtogle={meetingshowtogle}
                          setMeetingId={setMeetingId}
                          setReminderId={setReminderId}
                          onClose2={(e) => {
                            toggleModal(e);
                            setEdit(null);
                          }}
                        />
                      )}

                      {meetingId === currentLead._id && (
                        <MeetingModal
                          onClose={() => {
                            setShowModal(false);
                            setMeetingId(null);
                          }}
                          lead={currentLead._id}
                        />
                      )}

                      {reminderId === currentLead._id && (
                        <ReminderModal
                          onClose={() => {
                            setremindershow(false);
                            setReminderId(null);
                          }}
                          lead={currentLead._id}
                        />
                      )}
                    </>
                  );
                })
              ) : (
                []
              )}
            </div>

            <div ref={containerRef} className="fixed bottom-5 right-6 z-10">
              <div className={`relative rounded-full cursor-pointer`}>
                <motion.div
                  animate={{ rotate: btnShow ? 45 : 0 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  onClick={() => {
                    setBtnShow(!btnShow);
                  }}
                  className={`size-12 cursor-pointer  text-2xl font-bold flex items-center justify-center   bg-black text-slate-100 cursor-pointer    rounded-full  `}
                >
                  <FaPlus />
                </motion.div>
                <motion.div
                  onClick={openexcelmodal}
                  animate={{ bottom: btnShow ? "120%" : 0 }}
                  transition={{ duration: 0.4, type: "spring", delay: 0.2 }}
                  className={`size-12 cursor-pointer bg-sky-300  text-2xl -z-[99] flex items-center justify-center cursor-default rounded-full absolute  `}
                >
                  <RiUploadCloud2Fill />
                </motion.div>
                <motion.div
                  onClick={fetchDataAndDownloadExcel}
                  animate={{ right: btnShow ? "120%" : 0 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className={`size-12 bg-sky-300 cursor-pointer  text-2xl -z-[99] flex items-center justify-center bottom-0 cursor-default rounded-full absolute  `}
                >
                  <SiGooglesheets />
                </motion.div>
                <motion.div
                  animate={{
                    right: btnShow ? "120%" : 0,
                    bottom: btnShow ? "120%" : 0,
                  }}
                  transition={{ duration: 0.4, type: "spring", delay: 0.1 }}
                  className={`size-12 bg-sky-300 cursor-pointer text-2xl -z-[99] flex items-center justify-center cursor-default rounded-full absolute  `}
                >
                  <Link
                    href={{
                      pathname: "/Leads/Add",
                      query: { lead: "cold" },
                    }}
                  >
                    <HiOutlineDocumentAdd className="text-black" />
                  </Link>
                </motion.div>
              </div>
            </div>

            <div className="mt-10 ">
              <div
                className="dataTables_paginate paging_simple_numbers"
                id="datatable_paginate"
              >
                <ul className="pagination pagination-rounded">
                  <li
                    className={`paginate_button page-item previous ${currentPage === 1 ? "disabled" : ""
                      }`}
                    id="datatable_previous"
                  >
                    <a
                      href="#"
                      aria-controls="datatable"
                      aria-disabled={currentPage === 1}
                      role="link"
                      data-dt-idx="previous"
                      tabIndex={0}
                      className="page-link"
                      onClick={prevPage}
                    >
                      <i className="mdi mdi-chevron-left" />
                    </a>
                  </li>
                  <li className="p-2 rounded-full">{currentPage}</li>
                  <li
                    className={`paginate_button page-item next ${currentPage === Math.ceil(totalLeads / leadsPerPage)
                      ? "disabled"
                      : ""
                      }`}
                    id="datatable_next"
                  >
                    <button onClick={nextPage} className="page-link">
                      {" "}
                      <i className="mdi mdi-chevron-right" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}

export default Cold;
