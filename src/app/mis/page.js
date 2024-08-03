"use client";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import RootLayout from "../components/layout";
import PriceModal from "../components/priceModal";
import TlModal from "../components/tlModal";
import { NumericFormat } from "react-number-format";
import "rsuite/dist/rsuite.min.css";
import SearchableSelect from "@/app/Leads/dropdown";
import moment from "moment/moment";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import './table.css';
import { FaRegEdit } from "react-icons/fa";
import { ImCheckmark } from "react-icons/im";
import { RiCloseFill } from "react-icons/ri";
import { IoMdDownload } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { TbDatabaseEdit } from "react-icons/tb";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdFileDownload } from "react-icons/md";
function allDeals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTlModalOpen, setisTlIsModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userPerPage, setUserPerPage] = useState(10);
  const [myData, setMyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const path = "https://crm-milestonehomes.com/public/kyc/";
  const [agentFilter, setAgenFilter] = useState(null);
  const [kycFilter, setKycFilter] = useState("");
  const [date, setDate] = useState([null, null]);
  const [userIndex, setUserIndex] = useState(null);
  const [isDateInput, setIsDateInput] = useState(false);

  const toggleInputType = () => {
    setIsDateInput((prevIsDateInput) => !prevIsDateInput);
  };
  const handleKeyDown = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/invoice/get");
        console.log(response.data.data, "response");
        setMyData(response.data.data);
        setFilteredData(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const exportFile = useCallback(
    (id) => {
      if (!filteredData || typeof filteredData !== "object") {
        console.error("Invalid or missing data.");
        return;
      }
      const urlPath = "https://crm-milestonehomes.com/public/kyc/";
      const buyerOnepassFront =
        urlPath + filteredData[id]?.passfront?.split("kyc/").pop();
      const buyerOnepassBack =
        urlPath + filteredData[id]?.passback?.split("kyc/").pop();
      const buyerOneEOI =
        urlPath + filteredData[id]?.eoiimage?.split("kyc/").pop();
      const handleDownload = async () => {
        try {
          const front = await fetch(buyerOnepassFront).then((response) =>
            response.blob()
          );
          const back = await fetch(buyerOnepassFront).then((response) =>
            response.blob()
          );
          const eoi = await fetch(buyerOnepassFront).then((response) =>
            response.blob()
          );
          FileSaver.saveAs(front, "passfront.jpg");
          FileSaver.saveAs(back, "passback.jpg");
          FileSaver.saveAs(eoi, "eoi.jpg"); // Specify a file name for the downloaded image
        } catch (error) {
          console.error("Error downloading image:", error);
        }
      };

      const customHeadersMain = [
        { header: "#", width: 5, color: "#000000" },
        { header: "Agent Name", width: 20 },
        { header: "Agent Phone Number", width: 20 },
        { header: "Date of Lead Created", width: 20 },
        { header: "Lead Source", width: 20, color: "#FF0000" }, // Red color for 'Full Name'
        { header: "Buyer Full Name", width: 20 },
        { header: "Phone Number", width: 15 },
        { header: "Email Id", width: 20 },
        { header: "Date of Birth", width: 15 },
        { header: "Passport Number", width: 30 },
        { header: "Passport Expiry", width: 30 },
        { header: "Nationality", width: 30 },
        { header: "UAE Resident/ Non Resident", width: 20 },
        { header: "Emirates Expiry", width: 25 },
        { header: "Address", width: 30 },
        { header: "EOI / Token Date", width: 30 },
        { header: "Date of Closure", width: 30 },
        { header: "Date of Booking", width: 30 },
        { header: "Expected Handover Date", width: 30 },
        { header: "Status of Deal", width: 30 },
        { header: "	Direct/Indirect Buyer/Tenant", width: 30 },
        { header: "	Direct/Indirect Seller/Owner", width: 30 },
        { header: "	Remarks", width: 30 },
        { header: "Property Type", width: 30 },
        { header: "Developer", width: 30 },
        { header: "No. of Bed", width: 30 },
        { header: "Size/BUA Sq/Ft", width: 30 },
        { header: "Plot Area in Sq.Ft", width: 30 },
        { header: "Plot Number", width: 30 },
        { header: "Deal Type", width: 30 },
        { header: "Sale/Rent", width: 30 },

        { header: "Ready / Offplan", width: 30 },
        { header: "Unit No.", width: 30 },
        { header: "Mode", width: 30 },
        { header: "Unit Complete Address", width: 30 },
        { header: "Unit Price", width: 30 },
        { header: "Comission %", width: 30 },
        { header: "Spot Cash", width: 30 },
        { header: "Gross Total Comission", width: 30 },
        { header: "VAT 5%", width: 30 },
        { header: "Total Comission including VAT", width: 30 },
        { header: "Loyalty Bonus", width: 30 },
        { header: "Net/Total Comission", width: 30 },
        { header: "MOU/Contract Signed", width: 30 },
        { header: "Invoice Number", width: 30 },
        { header: "Agent % Comission", width: 30 },
        { header: "Agent (AED) Comission", width: 30 },
        { header: "ATL % Comission", width: 30 },
        { header: "ATL (AED) Comission", width: 30 },
        { header: "TL %age Comission", width: 30 },
        { header: "	TL (AED) Comission", width: 30 },
        { header: "SM Comission %", width: 30 },
        { header: "	SM (AED) Comission", width: 30 },
        { header: "Total Agent %age Comission to Total Agent", width: 30 },
        { header: "	Total Agent Commission to Total Agent", width: 30 },
        { header: "BH %age Comission", width: 30 },
        { header: "BH Comission", width: 30 },
        {
          header: "Total Agents + BH %age Comission to Total Agent",
          width: 30,
        },
        {
          header: "	Total Commission to Agent + BH (AED)",
          width: 30,
        },
        { header: "%age Comission to Company", width: 30 },
        { header: "Comission to Company(AED)", width: 30 },
        { header: "Additional Comments", width: 30 },
        { header: "Comission Status to Agent", width: 30 },
        { header: "Sanction List", width: 30 },
        { header: "AML Remarks", width: 30 },
        { header: "Contract End Date", width: 30 },
        { header: "No. of Cheques", width: 30 },
        { header: "Security Deposits", width: 30 },
        { header: "TA", width: 30 },
        { header: "Full Comission", width: 30 },
        { header: "1st Claim", width: 30 },
        { header: "2nd Claim", width: 30 },
        { header: "3rd Claim", width: 30 },
        { header: "Comission Status", width: 30 },
        { header: "Cancelled Price", width: 30 },
        { header: "Dewa Premises", width: 30 },
        { header: "Contract Number", width: 30 },
        { header: "Title Deed Number", width: 30 },
        { header: "New Title Deed Number", width: 30 },
        { header: "External Agent", width: 30 },
      ];

      // Combine custom headers for both main data and additional buyers
      const customHeaders = customHeadersMain.map((header) => header.header);

      // Extract buyer data from filteredData
      const buyerData = filteredData[id]; // Modify this according to your data structure

      // Flatten the buyer data into an array
      const buyerRow = [
        1,
        buyerData?.Userid?.username,
        buyerData?.Userid?.Phone,
        moment(buyerData?.Leadid.timestamp).format("DD-MM-YY"),
        buyerData?.Leadid?.Source.Source,
        buyerData?.buyername,
        buyerData?.buyerContact,
        buyerData?.buyerEmail,
        buyerData?.buyerdob,
        buyerData?.buyerpassport,
        buyerData?.passportexpiry,
        buyerData?.nationality,
        buyerData?.Resident,
        buyerData?.emiratesid,
        buyerData?.address,
        buyerData?.EOI,
        buyerData?.Closure,
        buyerData?.Booking,
        buyerData?.Handover,
        buyerData?.dealStatus,
        buyerData?.directIndirectTenant,
        buyerData?.directIndirectOwner,
        buyerData?.remarks,

        buyerData?.Property,
        buyerData?.Developer ? buyerData?.Developer : buyerData?.othrDeveloper,
        buyerData?.Bed,
        buyerData?.BUA,
        buyerData?.PlotArea,
        buyerData?.Property == "Apartment" ? "N/A" : buyerData?.PlotNumber,
        buyerData?.dealType,
        buyerData?.saleRent,
        buyerData?.Ready,
        buyerData?.Unitaddress,
        buyerData?.mode,
        buyerData?.Unitaddress,
        buyerData?.Price,
        buyerData?.Comission + buyerData?.ComissionType,
        buyerData?.SpotCash,
        buyerData?.TotalComission,
        buyerData?.VAT,
        buyerData?.ComissionVAT,
        buyerData?.loyaltyBonus,
        parseFloat(buyerData?.netcom),
        "N/A",
        buyerData?.Invoicenumber,
        buyerData?.agentComissionPercent,
        (parseFloat(buyerData?.netcom) * buyerData?.agentComissionPercent / 100) ,
        buyerData?.atlComissionPercent,
        (parseFloat(buyerData?.netcom) * buyerData?.atlComissionPercent / 100),
        buyerData?.tlComissionPercent,
        (parseFloat(buyerData?.netcom) * buyerData?.tlComissionPercent / 100),
        buyerData?.smComissionPercent,
        (parseFloat(buyerData?.netcom) * buyerData?.smComissionPercent / 100),
        buyerData?.tAgentPercentComissionToAgent,
        (parseFloat(buyerData?.netcom) * buyerData?.tAgentPercentComissionToAgent / 100),
        buyerData?.bhPercentComission,
        (parseFloat(buyerData?.netcom) * buyerData?.bhPercentComission / 100),
        buyerData?.TbhPercentComissiontoAgent,
        (parseFloat(buyerData?.netcom) * buyerData?.TbhPercentComissiontoAgent / 100),
        buyerData?.comissiontoCompanyPercent,
        (parseFloat(buyerData?.netcom) * buyerData?.comissiontoCompanyPercent / 100),
        buyerData?.additionalComments,
        buyerData?.comissionStatustoAgent == 1 ? "Paid" : "Not Paid",
        buyerData?.approved == 53
          ? "Approved by Superadmin"
          : buyerData?.approved == 54
          ? "Rejected by Superadmin"
          : "Awaiting",
        buyerData?.approved == 50 ? "Approved" : "Pending",
        buyerData?.contractEndDate,
        buyerData?.cheques,
        buyerData?.securityDeposit,
        buyerData?.TA,
        parseFloat(buyerData?.netCom),
        buyerData?.claim1,
        buyerData?.claim2,
        buyerData?.claim3,
        buyerData?.fullComission == 1 ? "Completed" : "Not Complete",
        buyerData?.cancelledPrice,
        buyerData?.dewaPremises,
        buyerData?.contractNumber,
        buyerData?.titleNumber,
        buyerData?.newTitleDeedNumber,
        buyerData?.agentname,
      ];

      // Flatten the array data below buyerRow
      const additionalRows = (filteredData[id]?.additionalBuyers || []).map(
        (buyerOne, index) => [
          index + 2,
          buyerOne?.Userid?.username,
          buyerOne?.Userid?.Phone,
          moment(buyerOne?.Leadid.timestamp).format("DD-MM-YY"),
          buyerOne?.Leadid?.Source.Source,
          buyerOne?.buyername,
          buyerOne?.buyerContact,
          buyerOnebuyerData?.buyerEmail,
          buyerOne?.buyerdob,
          buyerOne?.buyerpassport,
          buyerOne?.passportexpiry,
          buyerOne?.nationality,
          buyerOne?.Resident,
          buyerOne?.emiratesid,
          buyerOne?.address,
        ]
      );

      // Create worksheet data array
      const worksheetData = [customHeaders, buyerRow, ...additionalRows];

      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Set column widths
      const colWidths = [];
      customHeadersMain.forEach((header) =>
        colWidths.push({ wch: header.width })
      );
      worksheet["!cols"] = colWidths;

      // Apply styles to header row
      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = { c: C, r: range.s.r };
        const cell = worksheet[XLSX.utils.encode_cell(cellAddress)];
        const headerIndex = C - range.s.c; // Index of the header in customHeadersMain array
        const header = customHeadersMain[headerIndex];

        // Apply header style
      }

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Create an Excel file
      XLSX.writeFile(workbook, "exported_data.xlsx");
      handleDownload();
    },
    [filteredData]
  );
  const propertyOptions = [
    { value: "Apartment", label: "Apartment" },
    { value: "Town House", label: "Town House" },
    { value: "Villa", label: "Villa" },
  ];
  const dealStatuses = [
    { value: "Open", label: "Open" },
    { value: "Close", label: "Close" },
  ];
  const directIndirectTenantOP = [
    { value: "Direct Buyer", label: "Direct Buyer" },
    { value: "Indirect Buyer", label: "Indirect Buyer" },
    { value: "Tenant", label: "Tenant" },
  ];
  const directIndirectOwnerOP = [
    { value: "Direct Seller", label: "Direct Seller" },
    { value: "Indirect Seller", label: "Indirect Seller" },
    { value: "Owner", label: "Owner" },
  ];

  const agentNames = [
    { value: "Super admin", label: "Super admin" },
    { value: "Admin", label: "Admin" },
    { value: "SalesHead", label: "Sales Head" },
    { value: "Manager", label: "Manager" },
    { value: "BussinessHead", label: "Bussiness Head" },
    { value: "PNL", label: "PNL" },
    { value: "TL", label: "TL" },
    { value: "ATL", label: "ATL" },
    { value: "FOS", label: "FOS" },
  ];
  const readyStatus = [
    { value: "Ready", label: "Ready" },
    { value: "Off-Plan", label: "Off-Plan" },
  ];
  const dealTypes = [
    { value: "Primary", label: "Primary" },
    { value: "Secondary", label: "Secondary" },
  ];
  const saleRents = [
    { value: "Sale", label: "Sale" },
    { value: "Rent", label: "Rent" },
  ];
  const modes = [
    { value: "Cheque", label: "Cheque" },
    { value: "Cash", label: "Cash" },
    { value: "Bank Transfer", label: "Bank Transfer" },
    { value: "Managers Cheque", label: "Managers Cheque" },
  ];
  useEffect(() => {
    let filteredResult = myData;

    if (agentFilter) {
      filteredResult = filteredResult.filter(
        (agent) => agent.Userid.username === agentFilter
      );
    }

    if (kycFilter) {
      filteredResult = filteredResult.filter(
        (agent) => agent.kycStatus === kycFilter
      );
    }
    const filteredResultWithEdit = filteredResult.map((item) => ({
      ...item,
      edit: null,
      PlotArea: parseFloat(item.PlotArea.replace(/\B(?=(\d{3})+(?!\d))/g, ",")),
    }));

    setFilteredData(filteredResultWithEdit);
  }, [agentFilter, kycFilter, myData]);
  console.log(myData);
  const toggleModal = (index) => {
    setIsModalOpen(!isModalOpen);
    setUserIndex(index);
  };
  const toggleTlModal = (index) => {
    setIsModalOpen(!isTlModalOpen);
    setUserIndex(index);
  };
  const [users, setUsers] = useState([]);

  const toggleDocumentModal = (e, userId) => {
    setIsDocumentModalOpen(!isDocumentModalOpen);
    setSelectedUserId(userId);
  };

  const downloadFile = async (fileUrl) => {
    try {
      const response = await axios.get(fileUrl, {
        responseType: "blob", // important for downloading files
      });
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute(
        "download",
        fileUrl.substring(fileUrl.lastIndexOf("/") + 1)
      );
      document.body.appendChild(link);
      link.click(); // This should trigger the download
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  const commissionCurrency = [
    { value: "%", label: "%" },
    { value: "AED", label: "AED" },
  ];
  const [showEOI, setShowEOI] = useState(null);
  const [showSPA, setShowSPA] = useState(null);
  const [showBooking, setShowBooking] = useState(null);

  const submit = async (data, id) => {
    console.log(data);
    try {
      const response = await axios.put(`/api/invoice/table/${id} `, {
        data: data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [eoiIndex, seteoiIndex] = useState(null);
  const [bookingIndex, setbookingIndex] = useState(null);
  const [showSPAIndex, setSPAIndex] = useState(null);

  const [passFront, setpassFront] = useState(null);
  const [passBack, setpassBack] = useState(null);
  const [passFrontIndex, setPassFrontIndex] = useState(null);
  const [passBackIndex, setPassBackIndex] = useState(null);

  const showImageEOI = (index) => {
    setShowEOI(true);
    seteoiIndex(index);
  };

  const showImageBooking = (index) => {
    setShowBooking(true);
    setbookingIndex(index);
  };

  const showImageSPA = (index) => {
    if (filteredData[index].SPAmage != null) {
      setShowSPA(true);
      setSPAIndex(index);
    }
  };

  const [collapsed, setCollapsed] = useState(false);
  const handleDownload = async (apiUrl) => {
    const fileName = apiUrl.split("/").pop();
    const aTag = document.createElement("a");
    aTag.href = apiUrl;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  // Handler for the button click

  const showBuyerOnePassback = (index) => {
    setPassBackIndex(index);
    setpassBack(true);
  };
  const showBuyerOnePassfront = (index) => {
    setPassFrontIndex(index);
    setpassFront(true);
  };

  const developerOptions = [
    { value: "Emaar Properties", label: "Emaar Properties" },
    { value: "DAMAC Properties", label: "DAMAC Properties" },
    { value: "Nakheel Properties", label: "Nakheel Properties" },
    { value: "Meraas", label: "Meraas" },
    { value: "MAG Property Development", label: "MAG Property Development" },
    { value: "Sobha Realty", label: "Sobha Realty" },
    { value: "Danube Properties", label: "Danube Properties" },
    { value: "Azizi Developments", label: "Azizi Developments" },
    {
      value: "Al Futtaim Group Real Estate",
      label: "Al Futtaim Group Real Estate",
    },
    { value: "other", label: "Other" },
  ];
  const [collapsed2, setCollapsed2] = useState(false);

  return (
    <RootLayout>
      {isModalOpen && (
        <PriceModal userData={filteredData[userIndex]} onClose2={toggleModal} />
      )}
      {isTlModalOpen && (
        <PriceModal userData={filteredData[userIndex]} onClose2={toggleModal} />
      )}

      { 
        myData ?  <div className="flex justify-end  w-full mt-20 !px-0">
        <div className=" tablet:w-[calc(100%-100px)]  mobile:w-full h-full">
            <div className=" w-full  px-4 py-4 h-full">
              <p className="text-lg font-[500] px-2 text-white font-Satoshi w-full bg-blue-700 py-3 ">MIS</p>
            {showEOI && (
          <div className="!flex !flex-col  !w-[50%] !rounded-md !h-[80%] fixed items-end top-20 left-[30%] z-[9999]">
            <IoMdClose
              className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300  !text-gray-900"
              onClick={() => setShowEOI(null)}
            />
            <embed
              src={path + filteredData[eoiIndex].eoiimage?.split("kyc/").pop()}
              type="application/pdf"
              className="w-full h-full"
            />
          </div>
        )}

        {showSPA && filteredData[eoiIndex].SPAmage && (
          <div className="!flex !flex-col  !w-[50%] !rounded-md !h-[80%] fixed items-end top-20 left-[30%] z-[9999]">
            <IoMdClose
              className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300  !text-gray-900"
              onClick={() => setShowSPA(null)}
            />
            <embed
              src={path + filteredData[showSPAIndex].SPAmage?.split("kyc/").pop()}
              type="application/pdf"
              className="w-full h-full"
            />
          </div>
        )}

        {showBooking && (
          <div className="!flex !flex-col  !w-[50%] !rounded-md !h-[80%] fixed items-end top-20 left-[30%] z-[9999]">
            <IoMdClose
              className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300  !text-gray-900"
              onClick={() => setShowBooking(null)}
            />
            <embed
              src={
                path + filteredData[bookingIndex]?.bookingmage?.split("kyc/").pop()
              }
              type="application/pdf"
              className="w-full h-full"
            />
          </div>
        )}
        
        
        {passFront && (
          <div className="!flex !flex-col  !w-[80%] !rounded-md !h-[80%] fixed items-end top-20 left-[10%] z-[9999]">
            <IoMdClose
              className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300  !text-gray-900"
              onClick={() => setpassFront(null)}
            />
              { 
              filteredData[passFrontIndex]?.passfront[0] == '/' ? <embed
                src={path + filteredData[passFrontIndex]?.passfront?.split("kyc/").pop()}
                type="application/pdf"
              className="w-full h-full"
            /> : <embed
            src={filteredData[passFrontIndex]?.passfront}
            type="application/pdf"
            className="w-full h-full"
          /> 
              
            }
          </div>
        )}
        {passBack && (
          <div className="!flex !flex-col  !w-[80%] !rounded-md !h-[80%] fixed items-end top-20 left-[10%] z-[9999]">
            <IoMdClose
              className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300  !text-gray-900"
              onClick={() => setpassBack(null)}
            />
            { 
              filteredData[passBackIndex]?.passback[0] == '/' ? <embed
                src={path + filteredData[passBackIndex]?.passback?.split("kyc/").pop()}
                type="application/pdf"
              className="w-full h-full"
            /> : <embed
            src={filteredData[passBackIndex]?.passfront}
            type="application/pdf"
            className="w-full h-full"
          /> 
              
            }
          </div>
        )}
          <div className="flex  items-center gap-3 ">
        <div className={`relative z-[95]`}>
          <SearchableSelect
            options={agentNames}
            onChange={(value) => setAgenFilter(value.label)}
            placeholder={"Agent Name"}
            
          ></SearchableSelect>
        </div>

        <div className={`relative z-[95]`}>
          <SearchableSelect
            options={[]}
            onChange={(value) => setKycFilter(value.label)}
            placeholder={"Select Team"}
            
          ></SearchableSelect>
        </div>
      </div>
          <div className=" overflow-x-auto mt-3 h-[calc(100vh-12rem)]">
            <table className="table-fixed  ">
              <thead className="  text-gray-700 ">
                <tr className="text-md sticky z-[90] top-0 !border-b border-slate-600 py-2">
                    <th id='firstHeader' className={` !bg-[#D2E8F2] sticky left-0 z-[3]`}>
                        <div className="grid items-center px-3 grid-cols-5 w-[650px] ">
                          
                          <p className='!mb-0 !mt-0'>Serial No.</p>
                          <p className='!mb-0 !mt-0'>Agent Name</p>
                          <p className='!mb-0 !mt-0'>Agent Phone Number</p>
                          <p className='!mb-0 !mt-0'>Date of Lead Created</p>
                          <p className='!mb-0 !mt-0'>Lead Source</p>

                      </div>
                    </th>                   
                  <th
                      onClick={() => setCollapsed2(!collapsed2)}
                      
                      className={`cursor-pointer  hover:!bg-blue-200 !px-1 !bg-[#D2E8F2] ${collapsed2 ? 'shadow-r-md !bg-blue-200': 'shadow-none !bg-[#D2E8F2]'}`}
                  >
                    <div className={`flex justify-start items-center gap-3`}>
                      Buyer Full Name
                      <MdKeyboardArrowRight
                        className={`${collapsed2 ? "rotate-180" : "rotate-0"}`}
                      />
                    </div>
                  </th>

                  {collapsed2 ? (
                    <th className="  !px-1 !bg-[#9ED8F2]">Phone Number</th>
                  ) : null}
                  {collapsed2 ? (
                    <th className="  !px-1 !bg-[#9ED8F2]">Email Id</th>
                  ) : null}
                  {collapsed2 ? (
                    <th className="  !px-1 !bg-[#9ED8F2]">Date of Birth</th>
                  ) : null}
                  {collapsed2 ? (
                    <th className=" !px-1  !bg-[#9ED8F2]">Passport Number</th>
                  ) : null}
                  {collapsed2 ? (
                    <th className=" !px-1  !bg-[#9ED8F2]">
                      <div
                        className={`flex !px-4 justify-between items-center`}
                      >
                        <p className={`!mb-0 !mt-0`}>Front</p>
                        <p className={`!mb-0 !mt-0`}>Back</p>
                      </div>
                    </th>
                  ) : null}
                  {collapsed2 ? (
                    <th className="  !px-1 !bg-[#9ED8F2]">Passport Expiry</th>
                  ) : null}
                  {collapsed2 ? (
                    <th className="  !px-1 !bg-[#9ED8F2]">Nationality</th>
                  ) : null}
                  {collapsed2 ? (
                    <th className="  !px-1 !bg-[#9ED8F2]">UAE Resident</th>
                  ) : null}
                  {collapsed2 ? (
                    <th className="  !px-1 !bg-[#9ED8F2]">Emirates ID</th>
                  ) : null}
                  {collapsed2 ? (
                    <th className="  !px-1 !bg-[#9ED8F2]">Emirates Expiry</th>
                  ) : null}
                  {collapsed2 ? (
                    <th className="  !px-1 !bg-[#9ED8F2]">Address</th>
                  ) : null}

                  <th
                    className="!px-1 !bg-[#ffbb7c] hover:!bg-[#cc9663] cursor-pointer flex justify-start items-center gap-3"
                    onClick={() => setCollapsed(!collapsed)}
                  >
                    Seller Full Name{" "}
                    <MdKeyboardArrowRight
                      className={`${collapsed ? "rotate-180" : "rotate-0"}`}
                    />
                  </th>

                  {collapsed ? (
                    <th className="  !px-1 !bg-[#ffbb7c]">Buyer Full Name</th>
                  ) : null}
                  {collapsed ? (
                    <th className="  !px-1 !bg-[#ffbb7c]">Phone Number</th>
                  ) : null}
                  {collapsed ? (
                    <th className="  !px-1 !bg-[#ffbb7c]">Email Id</th>
                  ) : null}
                  {collapsed ? (
                    <th className="  !px-1 !bg-[#ffbb7c]">Date of Birth</th>
                  ) : null}
                  {collapsed ? (
                    <th className=" !px-1  !bg-[#ffbb7c]">Passport Number</th>
                  ) : null}
                  {collapsed ? (
                    <th className="  !px-1 !bg-[#ffbb7c]">Passport Expiry</th>
                  ) : null}
                  {collapsed ? (
                    <th className="  !px-1 !bg-[#ffbb7c]">Nationality</th>
                  ) : null}
                  {collapsed ? (
                    <th className="  !px-1 !bg-[#ffbb7c]">UAE Resident</th>
                  ) : null}
                  {collapsed ? (
                    <th className="  !px-1 !bg-[#ffbb7c]">Emirates ID</th>
                  ) : null}
                  {collapsed ? (
                    <th className="  !px-1 !bg-[#ffbb7c]">Emirates Expiry</th>
                  ) : null}
                  {collapsed ? (
                    <th className="  !px-1 !bg-[#ffbb7c]">Address</th>
                  ) : null}

                  <th className="  !px-1 !bg-[#D2E8F2]">EOI / Token Date</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">Date of Closure</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">Date of Booking</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">
                    {" "}
                    Expected Handover Date{" "}
                  </th>
                  <th className="  !px-1 !bg-[#D2E8F2]"> Status of Deal </th>
                  <th className="  !px-1 !bg-[#D2E8F2]">
                    {" "}
                    Direct/Indirect Buyer/Tenant{" "}
                  </th>
                  <th className="  !px-1 !bg-[#D2E8F2]">
                    {" "}
                    Direct/Indirect Seller/Owner{" "}
                  </th>
                  <th className="  !px-1 !bg-[#D2E8F2]"> Remarks </th>
                  <th className="  !px-1 !bg-[#D2E8F2]">Property Type</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">Developer</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">No. of Bed</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">Size /BUA Sq/Ft</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">Plot Area in Sq.FT</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">Plot Number</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">Deal Type</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">Sale/Rent</th>

                  <th className="  !px-1 !bg-[#D2E8F2]">Ready/Offplan</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">Unit No.</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">Mode</th>

                  <th className="  !px-1 !bg-[#D2E8F2]">Unit Address</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">Unit Price</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">Comission</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">Spot Cash</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">
                    Gross Total Comission
                  </th>
                  <th className="  !px-1 !bg-[#D2E8F2]">VAT 5%</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">
                    Total Commission Including VAT
                  </th>
                  <th className="  !px-1 !bg-[#D2E8F2]">
                    Loyalty Bonus if Any
                  </th>
                  <th className="  !px-1 !bg-[#D2E8F2]">Net/Total Comission</th>
                  <th className="  !px-1 !bg-[#D2E8F2]">MOU/Contract Signed</th>
                  <th className="  !px-1 !bg-[#D2E8F2]  ">
                    <div className="flex items-center justify-between px-3 gap-3">
                      <p className="!m-0 !border-0">EOI Receipt</p>
                      <p className="!m-0 !border-0">Booking Form</p>
                      <p className="!m-0 !border-0">SPA Copy</p>
                    </div>
                  </th>
                  <th className="   !bg-[#D2E8F2]">Invoice Number</th>

                  <th className=" !px-1  !bg-[#D2E8F2]">Agent Commission %</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">
                    Agent (AED) Commission
                  </th>
                  <th className=" !px-1  !bg-[#D2E8F2]">ATL Commission %</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">
                    ATL (AED) Commission
                  </th>
                  <th className="!px-1   !bg-[#D2E8F2]">TL Comission %</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">TL (AED) Comission</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">SM Comission %</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">SM (AED) Comission</th>

                  <th className=" !px-1  !bg-[#D2E8F2]">
                    Total Agent %age Commission to Total Agent
                  </th>
                  <th className=" !px-1  !bg-[#D2E8F2]">
                    Total Agent Commission to Total Agent
                  </th>
                  <th className=" !px-1  !bg-[#D2E8F2]">BH %age Commission</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">BH Commission</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">
                    Total Agents + BH %age Commission to total agent
                  </th>
                  <th className=" !px-1  !bg-[#D2E8F2]">
                    Total Commission to Agent + BH (AED)
                  </th>
                  <th className=" !px-1  !bg-[#D2E8F2]">
                    %age Commission to Company
                  </th>
                  <th className=" !px-1  !bg-[#D2E8F2]">
                    Commission to Company (AED)
                  </th>
                  <th className=" !px-1  !bg-[#D2E8F2]">Additional Comments</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">
                    Commission Status to Agent
                  </th>

                  <th className=" !px-1  !bg-[#D2E8F2]">Sanction List</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">AML Remarks</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">Contract End Date</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">No. of Cheques</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">Security Deposits</th>

                  <th className=" !px-1  !bg-[#D2E8F2]">TA</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">Full Comission</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">1st Claim</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">2nd Claim</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">3rd Claim</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">Comission Status</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">Cancelled Price</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">Dewa Premises</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">Contract Number</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">Title Deed Number</th>
                  <th className=" !px-1  !bg-[#D2E8F2]">
                    New Title Deed Number
                  </th>
                  <th className=" !px-1  !bg-[#D2E8F2]">External Agent</th>

                  <th
                  id='lastHeader'
                    className=" !px-1 sticky right-0 text-white  !bg-red-500
                  "
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {filteredData.map((row, index) => (
                  <tr key={index} className="border-b   border-slate-400">
                    <td id='rowHeader' className={` !bg-[#F1F5F7]  sticky left-0 z-[2] !mb-0`}>
                      
                      <div className="grid grid-cols-5 w-[650px] px-3 items-center">
                          <p className="!mt-0 !mb-0">{index + 1}</p>
                          <p className="!w-[100px] !mb-0">{row?.Userid?.username }</p>
                          <p className="!w-[200px] !mb-0 text-nowrap  overflow-x-hidden">
                        {row?.Userid?.Phone}
                      </p>
                      <p className="!w-[100px] text-wrap !mb-0">
                        {row.Leadid?.timestamp}
                      </p>
                      <p className="!w-[100px] text-wrap !mb-0">
                        {row.Leadid?.Source?.Source}
                      </p>
                          
                      </div>
                    </td>
                   

                    <td scope="row" className=" ">
                      <input
                        value={row?.buyername}
                        disabled={row.edit === null || row.edit === false}
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].buyername = e.target.value;
                          setFilteredData(newFilteredData);
                        }}
                      />
                      {row.additionalBuyers.length > 0
                        ? row.additionalBuyers.map((addBuyers, id) => {
                            return (
                              <div key={id} className={`mt-1`}>
                                <input
                                  disabled={
                                    row.edit === null || row.edit === false
                                  }
                                  value={addBuyers?.buyername}
                                  onChange={(e) => {
                                    const newFilteredData = [...filteredData];
                                    newFilteredData[index].additionalBuyers[
                                      id
                                    ].buyername = e.target.value;
                                    setFilteredData(newFilteredData);
                                  }}
                                  className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                                />
                              </div>
                            );
                          })
                        : null}
                    </td>

                    {collapsed2 ? (
                      <td scope="row" className=" ">
                        <input
                          value={row?.buyerContact}
                          disabled={row.edit === null || row.edit === false}
                          className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                          onChange={(e) => {
                            const newFilteredData = [...filteredData];
                            newFilteredData[index].buyerContact =
                              e.target.value;
                            setFilteredData(newFilteredData);
                          }}
                        />
                        {row.additionalBuyers.length > 0
                          ? row.additionalBuyers.map((addBuyers, id) => {
                              return (
                                <div key={id} className={`mt-1`}>
                                  <input
                                    value={addBuyers?.buyerContact}
                                    disabled={
                                      row.edit === null || row.edit === false
                                    }
                                    onChange={(e) => {
                                      const newFilteredData = [...filteredData];
                                      newFilteredData[index].additionalBuyers[
                                        id
                                      ].buyerContact = e.target.value;
                                      setFilteredData(newFilteredData);
                                    }}
                                    className=" px-1 py-1 disabled:!border-0 disabled:!bg-[#F1F5F7] "
                                  />
                                </div>
                              );
                            })
                          : null}
                      </td>
                    ) : null}

                    {collapsed2 ? (
                      <td scope="row" className=" !px-1 ">
                        <input
                          value={row?.buyerEmail}
                          className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                          disabled={row.edit === null || row.edit === false}
                          onChange={(e) => {
                            const newFilteredData = [...filteredData];
                            newFilteredData[index].buyerEmail = e.target.value;
                            setFilteredData(newFilteredData);
                          }}
                        />
                        {row.additionalBuyers.length > 0
                          ? row.additionalBuyers.map((addBuyers, id) => {
                              return (
                                <div key={id} className={`mt-1`}>
                                  <input
                                    value={addBuyers?.buyerEmail}
                                    disabled={
                                      row.edit === null || row.edit === false
                                    }
                                    onChange={(e) => {
                                      const newFilteredData = [...filteredData];
                                      newFilteredData[index].additionalBuyers[
                                        id
                                      ].buyerEmail = e.target.value;
                                      setFilteredData(newFilteredData);
                                    }}
                                    className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                                  />
                                </div>
                              );
                            })
                          : null}
                      </td>
                    ) : null}

                    {collapsed2 ? (
                      <td scope="row" className=" !px-1">
                        <input
                          value={row?.buyerdob}
                          onKeyDown={handleKeyDown}
                          onFocus={toggleInputType}
                          className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                          disabled={row.edit === null || row.edit === false}
                          max={new Date().toISOString().split("T")[0]}
                          type="date"
                          onChange={(e) => {
                            const newFilteredData = [...filteredData];
                            newFilteredData[index].buyerdob = e.target.value;
                            setFilteredData(newFilteredData);
                          }}
                        />
                        {row.additionalBuyers.length > 0
                          ? row.additionalBuyers.map((addBuyers, id) => {
                              return (
                                <div key={id} className={`mt-1`}>
                                  <input
                                    onKeyDown={handleKeyDown}
                                    onFocus={toggleInputType}
                                    value={addBuyers?.buyerdob}
                                    disabled={
                                      row.edit === null || row.edit === false
                                    }
                                    max={new Date().toISOString().split("T")[0]}
                                    type="date"
                                    onChange={(e) => {
                                      const newFilteredData = [...filteredData];
                                      newFilteredData[index].additionalBuyers[
                                        id
                                      ].buyerdob = e.target.value;
                                      setFilteredData(newFilteredData);
                                    }}
                                    className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                                  />
                                </div>
                              );
                            })
                          : null}
                      </td>
                    ) : null}

                    {collapsed2 ? (
                      <td scope="row" className=" !px-3">
                        <input
                          value={row?.buyerpassport}
                          className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                          onChange={(e) => {
                            const newFilteredData = [...filteredData];
                            newFilteredData[index].buyerpassport =
                              e.target.value;
                            setFilteredData(newFilteredData);
                          }}
                          disabled={row.edit === null || row.edit === false}
                        />
                        {row.additionalBuyers.length > 0
                          ? row.additionalBuyers.map((addBuyers, id) => {
                              return (
                                <div key={id} className={`mt-1`}>
                                  <input
                                    value={addBuyers?.buyerpassport}
                                    onChange={(e) => {
                                      const newFilteredData = [...filteredData];
                                      newFilteredData[index].additionalBuyers[
                                        id
                                      ].buyerpassport = e.target.value;
                                      setFilteredData(newFilteredData);
                                    }}
                                    className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                                    disabled={
                                      row.edit === null || row.edit === false
                                    }
                                  />
                                </div>
                              );
                            })
                          : null}
                      </td>
                    ) : null}

                    {collapsed2 ? (
                      <td
                        scope="row"
                        className="!px-3 "
                      >
                        <div className="flex flex-col items-center gap-2 justify-between">
                          
                          <div className="flex justify-between items-center gap-2 w-[140px]">
                        <div className="flex w-full justify-around ">
                          <p className="!m-0 !border-0">
                            <FaCheck
                              className={`cursor-pointer ${
                                row.passfront.length < 5
                                  ? "text-slate-300"
                                  : "text-green-300"
                              }`}
                            />{" "}
                          </p>
                          <p className="!m-0 !border-0">
                            <IoMdEye
                              className="cursor-pointer"
                              onClick={() => {
                                showBuyerOnePassfront(index);
                              }}
                            />{" "}
                          </p>
                          <p
                            className="!m-0 !border-0"
                            onClick={() => {
                              handleDownload(row.passfront, "file.pdf");
                            }}
                          >
                            <IoMdDownload className="cursor-pointer" />{" "}
                          </p>
                        </div>
                        <div className="flex w-full justify-around">
                          <p className="!m-0 !border-0">
                            <FaCheck
                              className={`cursor-pointer ${
                                row.passback.length < 5
                                  ? "text-slate-300"
                                  : "text-green-300"
                              }`}
                            />
                          </p>
                          <p className="!m-0 !border-0">
                            <IoMdEye
                              className="cursor-pointer"
                              onClick={() => {
                                showBuyerOnePassback(index);
                              }}
                            />{" "}
                          </p>
                          <p
                            className="!m-0 !border-0"
                            onClick={() => {
                              handleDownload(row.passback, "file.pdf");
                            }}
                          >
                            <IoMdDownload className="cursor-pointer" />{" "}
                          </p>
                        </div>
                          </div>

                                                    
                        </div>
                      </td>
                    ) : null}

                    {collapsed2 ? (
                      <td scope="row" className=" !px-1 ">
                        <input
                          value={row?.passportexpiry}
                          className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                          onKeyDown={handleKeyDown}
                          onFocus={toggleInputType}
                          onChange={(e) => {
                            const newFilteredData = [...filteredData];
                            newFilteredData[index].passportexpiry =
                              e.target.value;
                            setFilteredData(newFilteredData);
                          }}
                          disabled={row.edit === null || row.edit === false}
                          min={new Date().toISOString().split("T")[0]}
                          type="date"
                        />
                        {row.additionalBuyers.length > 0
                          ? row.additionalBuyers.map((addBuyers, id) => {
                              return (
                                <div key={id} className={`mt-1`}>
                                  <input
                                    min={new Date().toISOString().split("T")[0]}
                                    type="date"
                                    value={addBuyers?.passportexpiry}
                                    onKeyDown={handleKeyDown}
                                    onFocus={toggleInputType}
                                    onChange={(e) => {
                                      const newFilteredData = [...filteredData];
                                      newFilteredData[index].additionalBuyers[
                                        id
                                      ].passportexpiry = e.target.value;
                                      setFilteredData(newFilteredData);
                                    }}
                                    className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                                    disabled={
                                      row.edit === null || row.edit === false
                                    }
                                  />
                                </div>
                              );
                            })
                          : null}
                      </td>
                    ) : null}

                    {collapsed2 ? (
                      <td scope="row" className=" !px-1 ">
                        <input
                          value={row?.nationality}
                          className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                          onChange={(e) => {
                            const newFilteredData = [...filteredData];
                            newFilteredData[index].nationality = e.target.value;
                            setFilteredData(newFilteredData);
                          }}
                          disabled={row.edit === null || row.edit === false}
                        />
                        {row.additionalBuyers.length > 0
                          ? row.additionalBuyers.map((addBuyers, id) => {
                              return (
                                <div key={id} className={`mt-1`}>
                                  <input
                                    value={addBuyers?.nationality}
                                    onChange={(e) => {
                                      const newFilteredData = [...filteredData];
                                      newFilteredData[index].additionalBuyers[
                                        id
                                      ].nationality = e.target.value;
                                      setFilteredData(newFilteredData);
                                    }}
                                    className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                                    disabled={
                                      row.edit === null || row.edit === false
                                    }
                                  />
                                </div>
                              );
                            })
                          : null}
                      </td>
                    ) : null}

                    {collapsed2 ? (
                      <td scope="row" className=" !px-1 ">
                        <p
                          
                          className={`w-[100px] !mb-0`}
                          
                        >{row?.Resident}</p>
                        {row.additionalBuyers.length > 0
                          ? row.additionalBuyers.map((addBuyers, id) => {
                              return (
                                <div key={id} className={`mt-1`}>
                                  <p
                          
                          className={`w-[100px] !mb-0`}
                          
                        >{addBuyers?.Resident}</p>
                                </div>
                              );
                            })
                          : null}
                      </td>
                    ) : null}

                    {collapsed2 ? (
                      <td scope="row" className=" !px-1 ">
                         
                         <p
                          
                          className={`w-[100px] !mb-0`}
                          
                        >{row?.emiratesid ? row?.emiratesid : 'N/A' }</p>
                        {row.additionalBuyers.length > 0
                          ? row.additionalBuyers.map((addBuyers, id) => {
                              return (
                                <div key={id} className={`mt-1`}>
                                   <p
                          
                                    className={`w-[100px] !mb-0`}>
                                    {addBuyers?.emiratesid? addBuyers?.emiratesid : "N/A"}
                                  </p>
                                </div>
                              );
                            })
                          : null}
                      </td>
                    ) : null}

                    {collapsed2 ? (
                      <td scope="row" className=" !px-1 ">
                            <input
                          className={`px-1 !mb-0 disabled:bg-slate-200`}
                          value={row?.emiratesExpiry ? row?.emiratesExpiry : "N/A"}
                          type='date'
                          disabled
                        />
                        {row.additionalBuyers.length > 0
                          ? row.additionalBuyers.map((addBuyers, id) => {
                              return (
                                <div key={id} className={`mt-1`}>
                              <p
                          
                                className={`w-[200px] !mb-0`}>
                                {addBuyers?.emiratesExpiry ? addBuyers?.emiratesExpiry : "N/A"}
                               </p>
                                </div>
                              );
                            })
                          : null}
                      </td>
                    ) : null}

                    {collapsed2 ? (
                      <td scope="row" className=" !px-1">
                        <input
                          value={row?.address}
                          className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                          onChange={(e) => {
                            const newFilteredData = [...filteredData];
                            newFilteredData[index].address = e.target.value;
                            setFilteredData(newFilteredData);
                          }}
                          disabled={row.edit === null || row.edit === false}
                        />
                        {row.additionalBuyers.length > 0
                          ? row.additionalBuyers.map((addBuyers, id) => {
                              return (
                                <div key={id} className={`mt-1`}>
                                  <input
                                    value={addBuyers?.address}
                                    onChange={(e) => {
                                      const newFilteredData = [...filteredData];
                                      newFilteredData[index].additionalBuyers[
                                        id
                                      ].address = e.target.value;
                                      setFilteredData(newFilteredData);
                                    }}
                                    className="px-1 py-1 disabled:!border-0 disabled:!bg-[#F1F5F7]"
                                    disabled={
                                      row.edit === null || row.edit === false
                                    }
                                  />
                                </div>
                              );
                            })
                          : null}
                      </td>
                    ) : null}

                    <td scope="row" className="  z-[1] !px-1 "></td>

                    {collapsed ? (
                      <td scope="row" className="  z-[1] !px-1 "></td>
                    ) : null}
                    {collapsed ? (
                      <td scope="row" className="  z-[1] !px-1 "></td>
                    ) : null}
                    {collapsed ? (
                      <td scope="row" className="  z-[1] !px-1 "></td>
                    ) : null}
                    {collapsed ? (
                      <td scope="row" className="  z-[1] !px-1 "></td>
                    ) : null}
                    {collapsed ? (
                      <td scope="row" className="  z-[1] !px-1 "></td>
                    ) : null}
                    {collapsed ? (
                      <td scope="row" className="  z-[1] !px-1 "></td>
                    ) : null}
                    {collapsed ? (
                      <td scope="row" className="  z-[1] !px-1 "></td>
                    ) : null}
                    {collapsed ? (
                      <td scope="row" className="  z-[1] !px-1 "></td>
                    ) : null}
                    {collapsed ? (
                      <td scope="row" className="  z-[1] !px-1 "></td>
                    ) : null}

                    {collapsed ? (
                      <td scope="row" className="  z-[1] !px-1 "></td>
                    ) : null}
                    {collapsed ? (
                      <td scope="row" className="  z-[1] !px-1 "></td>
                    ) : null}

                    <td scope="row" className=" !px-1 ">
                      <input
                        value={row?.EOI}
                        onKeyDown={handleKeyDown}
                        onFocus={toggleInputType}
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].EOI = e.target.value;
                          setFilteredData(newFilteredData);
                        }}
                        type="date"
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <input
                        value={row?.Closure}
                        onKeyDown={handleKeyDown}
                        onFocus={toggleInputType}
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].Closure = e.target.value;
                          setFilteredData(newFilteredData);
                        }}
                        type="date"
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <input
                        value={row?.Booking}
                        onKeyDown={handleKeyDown}
                        onFocus={toggleInputType}
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].Booking = e.target.value;
                          setFilteredData(newFilteredData);
                        }}
                        type="date"
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <input
                        value={row?.Handover}
                        onKeyDown={handleKeyDown}
                        onFocus={toggleInputType}
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].Handover = e.target.value;
                          setFilteredData(newFilteredData);
                        }}
                        type="date"
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>
                    <td scope="row" className=" ">
                      <div className={ `w-[120px]`}>
                      <SearchableSelect
                        
                        options={dealStatuses}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].dealStatus = e.value;
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                        defaultValue={row.dealStatus}
                      />
                      </div>
                    </td>
                    <td scope="row" className="   !px-1 ">
                      <div className={`w-[150px]`}>
                      <SearchableSelect
                        options={directIndirectTenantOP}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].directIndirectTenant = e.value;
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                        defaultValue={row.directIndirectTenant}
                      />
                     </div>
                    </td>
                    <td scope="row" className="  !px-1 ">
                      <div className="w-[150px]">
                      <SearchableSelect
                        options={directIndirectOwnerOP}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].directIndirectOwner = e.value;
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                        defaultValue={row.directIndirectOwner}
                      />
                      </div>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <input
                        value={row?.remarks}
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].remarks = e.target.value;
                          setFilteredData(newFilteredData);
                        }}
                        type="text"
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>

                    <td scope="row" className="  !px-1 ">
                      <div className="w-[150px]">
                      <SearchableSelect
                        options={propertyOptions}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].Property = e.value;
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                        defaultValue={row.Property}
                      />
                     </div>
                    </td>

                    <td scope="row" className="  !px-1 ">
                      <div
                        className={
                          row?.Developer === "other"
                            ? "grid grid-cols-2 gap-x-4 w-[300px]"
                            : "grid grid-cols-1 gap-x-4 w-[200px]"
                        }
                      >
                        <SearchableSelect
                          className={"z-[0]"}
                          options={developerOptions}
                          disabled={row.edit === null || row.edit === false}
                          defaultValue={row.Developer}
                          onChange={(e) => {
                            const newFilteredData = [...filteredData];
                            newFilteredData[index].Developer = e.value;
                            setFilteredData(newFilteredData);
                          }}
                        />
                        {row.Developer === "other" && (
                          <input
                            className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                            value={row.othrDeveloper}
                            onChange={(e) => {
                              const newFilteredData = [...filteredData];
                              newFilteredData[index].othrDeveloper = e.value;
                              setFilteredData(newFilteredData);
                            }}
                            placeholder="Enter developer name"
                            disabled={row.edit === null || row.edit === false}
                          />
                        )}
                      </div>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <div className="w-[100px]">
                      <NumericFormat
                        value={row?.Bed}
                        thousandSeparator=","
                        className={`px-1 py-1 w-full border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].Bed = e.target.value;
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                      </div>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <div className="w-[130px]">
                      <NumericFormat
                        value={row?.BUA}
                        thousandSeparator=","
                        className={`px-1 py-1 border-1 w-full border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].BUA = e.target.value;
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                      </div>
                    </td>
                    <td scope="row" className=" !px-1 ">
                      <div className="w-[140px]">
                      <NumericFormat
                        value={row?.PlotArea}
                        thousandSeparator=","
                        className={`px-1 w-full py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].PlotArea = e.target.value;
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                    </div>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <input
                        value={
                          row?.Property == "Apartment" ? "N/A" : row?.PlotNumber
                        }
                        className={`px-1 py-1 w-[100px] border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].PlotNumber = e.target.value;
                          setFilteredData(newFilteredData);
                        }}
                        disabled={
                          row.edit === null ||
                          row.edit === false ||
                          row.Property == "Apartment"
                        }
                      />
                    </td>

                    <td scope="row" className="   !px-2 ">
                      <div className="w-[130px]">
                      <SearchableSelect
                        options={dealTypes}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].dealType = e.value;
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                        defaultValue={row.dealType}
                      />
                      </div>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <div className="w-[130px]">
                      <SearchableSelect
                        options={saleRents}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].saleRent = e.value;
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                        defaultValue={row.saleRent}
                      />
                      </div>
                    </td>

                    <td scope="row" className="  !px-1 ">
                      <div className="w-[130px]">
                      <SearchableSelect
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        disabled={row.edit === null || row.edit === false}
                        options={readyStatus}
                        defaultValue={row?.Ready}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].Ready = e.value;
                          setFilteredData(newFilteredData);
                        }}
                        placeholder="Ready / Offplan"
                      />
                      </div>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <input
                        value={row?.Unitaddress}
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].address = e.target.value;
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>

                    <td scope="row" className="  !px-1 ">
                      <div className="w-[140px]">
                        <SearchableSelect
                          className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                          disabled={row.edit === null || row.edit === false}
                          options={modes}
                          defaultValue={row?.mode}
                          onChange={(e) => {
                            const newFilteredData = [...filteredData];
                            newFilteredData[index].mode = e.value;
                            setFilteredData(newFilteredData);
                          }}
                          placeholder="Modes"
                        />
                     </div>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <input
                        value={row?.Unitaddress}
                        className={`px-1 w-[150px] py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].Unitaddress = e.target.value;
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <div className={`flex justify-start !w-[200px] items-center gap-3`}>
                        <p className="!mb-0 w-[150px] ">{ row?.Price
                              ? parseFloat(row?.Price.replace(/,/g, ""))
                                  .toFixed(2)
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              : "" }</p>

                        <button
                          className={`${
                            row?.edit ? "text-slate-900" : "text-slate-500"
                          }`}
                          disabled={row.edit === null || row.edit === false}
                          onClick={() => {
                            toggleModal(index);
                          }}
                        >
                          <TbDatabaseEdit className={`text-xl ${
                            row?.edit ? "text-green-400" : "text-slate-500"
                          }`}
                          disabled={row.edit === null || row.edit === false} />
                        </button>
                      </div>
                    </td>

                    <td scope="row" className="  !px-1 ">
                      <div className={`flex justify-center items-center`}>
                        <p className="!mb-0 w-[100px]">{
                            row?.ComissionType != "%"
                              ? row?.Comission + " " + row?.ComissionType
                              : row?.Comission + row?.ComissionType
                          }</p>
                      </div>
                    </td>
                    <td scope="row" className=" !px-1 ">
                      <p className="!mb-0 w-[200px]">
                        {
                          row?.SpotCash
                            ? parseFloat(row?.SpotCash.replace(/,/g, ""))
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : "0.00"
                        }</p>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <p className="!mb-0 w-[200px]">{
                          row?.TotalComission
                            ? parseFloat(row?.TotalComission.replace(/,/g, ""))
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : ""
                        }</p>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <p className={ `!mb-0 w-[200px]`}>
                      {
                          row?.VAT
                            ? parseFloat(row?.VAT.replace(/,/g, ""))
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : ""
                        }
                      </p>
                    </td>

                    <td scope="row" className=" !px-1  ">
                      <p className="!mb-0 w-[200px]">
                      {
                          row?.ComissionVAT
                            ? parseFloat(row?.ComissionVAT.replace(/,/g, ""))
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : ""
                        }
                      </p>
                    </td>
                    <td scope="row" className=" !px-1 ">
                      <p className={ `!mb-0 w-[200px]`}>{
                          row?.loyaltyBonus
                            ? parseFloat(row?.loyaltyBonus.replace(/,/g, ""))
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : "00"
                        }</p>
                    </td>
                    <td scope="row" className=" !px-1 ">
                      <p className={ `!mb-0 w-[200px]`}>
                      {
                          row?.netcom
                            ? parseFloat(row?.netcom.replace(/,/g, ""))
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : ""
                        }
                      </p>
                    </td>

                    <td scope="row" className=" !px-1 "></td>

                    <td
                      scope="row"
                      className="   !px-3  z-[1]"
                    >
                      <div className="flex justify-between w-[300px] items-center gap-3">

                      <div className="flex w-full justify-around gap-2">
                        <p className="!m-0 !border-0">
                          <FaCheck
                            className={`cursor-pointer ${
                              row.eoiimage.length < 5
                                ? "text-slate-300"
                                : "text-green-300"
                            }`}
                          />{" "}
                        </p>
                        <p className="!m-0 !border-0">
                          <IoMdEye
                            className="cursor-pointer"
                            onClick={() => {
                              showImageEOI(index);
                            }}
                          />{" "}
                        </p>
                        <p
                          className="!m-0 !border-0"
                          onClick={() => {
                            handleDownload(
                              path + row.eoiimage.split("kyc/").pop(),
                              "file.pdf"
                            );
                          }}
                        >
                          <IoMdDownload className="cursor-pointer" />{" "}
                        </p>
                      </div>
                      <div className="flex w-full justify-around">
                        <p className="!m-0 !border-0">
                          <FaCheck
                            className={`cursor-pointer ${
                              row.bookingmage.length < 5
                                ? "text-slate-300"
                                : "text-green-300"
                            }`}
                          />
                        </p>
                        <p className="!m-0 !border-0">
                          <IoMdEye
                            className="cursor-pointer"
                            onClick={() => {
                              showImageBooking(index);
                            }}
                          />{" "}
                        </p>
                        <p
                          className="!m-0 !border-0"
                          onClick={() => {
                            handleDownload(
                              path + row.bookingmage.split("kyc/").pop(),
                              "file.pdf"
                            );
                          }}
                        >
                          <IoMdDownload className="cursor-pointer" />{" "}
                        </p>
                      </div>
                      <div className="flex w-full justify-around">
                        {filteredData[index].SPAmage != null &&
                        filteredData[index].SPAmage !=
                          "https://crm-milestonehomes.com/public/kyc/undefined" ? (
                          <div className="flex w-full justify-around">
                            {" "}
                            <p className="!m-0 !border-0">
                              <FaCheck
                                className={`cursor-pointer ${
                                  row?.SPAmage?.length < 5
                                    ? "text-slate-300"
                                    : "text-green-300"
                                }`}
                              />
                            </p>
                            <p className="!m-0 !border-0">
                              <IoMdEye
                                className="cursor-pointer"
                                onClick={() => {
                                  showImageSPA(index);
                                }}
                              />{" "}
                            </p>
                            <p
                              className="!m-0 !border-0"
                              onClick={() => {
                                handleDownload(
                                  path + row.SPAmage.split("kyc/").pop(),
                                  "file.pdf"
                                );
                              }}
                            >
                              <IoMdDownload className="cursor-pointer" />{" "}
                            </p>
                          </div>
                        ) : (
                          <IoMdClose className="text-xl text-red-500" />
                        )}
                      </div>


                      </div>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <input
                        className={`px-1 w-[230px] py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        disabled={row.edit === null || row.edit === false}
                        value={row?.Invoicenumber}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].Invoicenumber = e.target.value;
                          setFilteredData(newFilteredData);
                        }}
                      />
                    </td>

                    <td scope="row" className=" !px-1">
                      <div className="w-[200px]">
                    {
                        row?.edit ? 
                          <NumericFormat
                        className={`px-1  py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={row?.agentComissionPercent}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          const newAgentComissionPercent = Number(
                            e.target.value
                          );

                          const totalComission = parseFloat(
                            row?.TotalComission
                          );
                          const loyaltyBonus = parseFloat(
                            row?.loyaltyBonus || 0
                          );

                          let newAgentComissionAED = 0;

                          if (row?.loyaltyBonus) {
                            newAgentComissionAED =
                              ((totalComission - loyaltyBonus) *
                                newAgentComissionPercent) /
                              100;
                          } else {
                            newAgentComissionAED =
                              (totalComission * newAgentComissionPercent) / 100;
                          }

                          // Round to 2 decimal places
                          newAgentComissionAED = parseFloat(
                            newAgentComissionAED.toFixed(2)
                          );

                          newFilteredData[index] = {
                            ...newFilteredData[index],
                            agentComissionPercent: newAgentComissionPercent,
                            agentComissionAED: newAgentComissionAED,
                          };

                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                      :
                       <p className={`w-full !mb-0 !mt-0 `}>{ row?.agentComissionPercent ?  row?.agentComissionPercent + '%' : null }</p>
                      
                    }
                     </div>
                    </td>


                    <td scope="row" className=" !px-1 ">
                      <div className="w-[230px]">
                      <NumericFormat
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                         value={(
                                (parseFloat(row?.netcom) *
                                  parseFloat(row?.agentComissionPercent)) /
                                100
                              ).toFixed(2)}
                              thousandSeparator=","
                              disabled
                       
                      />
                     </div>
                    </td>

                    <td scope="row" className=" !px-1">
                      <div className="w-[200px]">
                     {
                         row?.edit ? 
                          <NumericFormat
                        className={`px-1  py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={row?.atlComissionPercent}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          const newAgentComissionPercent = Number(
                            e.target.value
                          );

                          const totalComission = parseFloat(
                            row?.TotalComission
                          );
                          const loyaltyBonus = parseFloat(
                            row?.loyaltyBonus || 0
                          );

                          let newAgentComissionAED = 0;

                          if (row?.loyaltyBonus) {
                            newAgentComissionAED =
                              ((totalComission - loyaltyBonus) *
                                newAgentComissionPercent) /
                              100;
                          } else {
                            newAgentComissionAED =
                              (totalComission * newAgentComissionPercent) / 100;
                          }

                          // Round to 2 decimal places
                          newAgentComissionAED = parseFloat(
                            newAgentComissionAED.toFixed(2)
                          );

                          newFilteredData[index] = {
                            ...newFilteredData[index],
                            atlComissionPercent: newAgentComissionPercent,
                            atlComissionAED: newAgentComissionAED,
                          };

                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                      :
                       <p className={`w-full !mb-0 !mt-0 `}>{ row?.atlComissionPercent ?  row?.atlComissionPercent + '%' : null }</p>
                     }
                     </div>
                    </td>


                    <td scope="row" className=" !px-1 ">
                      <div className="w-[230px]">
                      <NumericFormat
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                         value={(
                                (parseFloat(row?.netcom) *
                                  parseFloat(row?.atlComissionPercent)) /
                                100
                              ).toFixed(2)}
                              thousandSeparator=","
                              disabled
                            
                      />
                     </div>
                    </td>



                    <td scope="row" className=" !px-1">
                      <div className="w-[230px]">
                        {
                            row?.edit ? 
                              <NumericFormat
                       className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={row?.tlComissionPercent}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          const newTlComissionPercent = Number(e.target.value);

                          const totalComission = parseFloat(
                            row?.TotalComission
                          );
                          const loyaltyBonus = parseFloat(
                            row?.loyaltyBonus || 0
                          );

                          let newTlComissionAED = 0;

                          if (row?.loyaltyBonus) {
                            newTlComissionAED =
                              ((totalComission - loyaltyBonus) *
                                newTlComissionPercent) /
                              100;
                          } else {
                            newTlComissionAED =
                              (totalComission * newTlComissionPercent) / 100;
                          }

                          // Round to 2 decimal places
                          newTlComissionAED = parseFloat(
                            newTlComissionAED.toFixed(2)
                          );

                          newFilteredData[index] = {
                            ...newFilteredData[index],
                            tlComissionPercent: newTlComissionPercent,
                            tlComissionAED: newTlComissionAED,
                          };

                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                      :
                       <p className={`w-full !mb-0 !mt-0 `}>{ row?.tlComissionPercent ?  row?.tlComissionPercent + '%' : null }</p>
                        }
                     </div>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <div className="w-[200px]">
                      <NumericFormat
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                         value={(
                                (parseFloat(row?.netcom) *
                                  parseFloat(row?.tlComissionPercent)) /
                                100
                              ).toFixed(2)}
                        thousandSeparator=","
                        disabled
                      />
                     </div>
                    </td>
                    <td scope="row" className=" !px-1">
                      <div className="w-[200px]">
                     {
                         row?.edit ? 
                          <NumericFormat
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={row?.smComissionPercent}
                        max="100"
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          const newSmComissionPercent = Number(e.target.value);

                          const totalComission = parseFloat(
                            row?.TotalComission
                          );
                          const loyaltyBonus = parseFloat(
                            row?.loyaltyBonus || 0
                          );

                          let newSmComissionAED = 0;

                          if (row?.loyaltyBonus) {
                            newSmComissionAED =
                              ((totalComission - loyaltyBonus) *
                                newSmComissionPercent) /
                              100;
                          } else {
                            newSmComissionAED =
                              (totalComission * newSmComissionPercent) / 100;
                          }

                          // Round to 2 decimal places
                          newSmComissionAED = parseFloat(
                            newSmComissionAED.toFixed(2)
                          );

                          newFilteredData[index] = {
                            ...newFilteredData[index],
                            smComissionPercent: newSmComissionPercent,
                            smComissionAED: newSmComissionAED,
                          };

                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                      :
                       <p className={`w-full !mb-0 !mt-0 `}>{ row?.smComissionPercent ?  row?.smComissionPercent + '%' : null }</p>
                     }
                     </div>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <div className="w-[200px]">
                      <NumericFormat
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        thousandSeparator=","
                         value={(
                                (parseFloat(row?.netcom) *
                                  parseFloat(row?.smComissionPercent)) /
                                100
                              ).toFixed(2)}
                              disabled
                      />
                     </div>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <div className="w-[200px]">
                      <input
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={row?.tAgentPercentComissionToAgent}
                        value={
                                parseFloat(row?.agentComissionPercent) +
                                parseFloat(row?.atlComissionPercent) +
                                parseFloat(row?.tlComissionPercent) +
                                parseFloat(row?.smComissionPercent) + '%'
                              }
                              max="100"
                              disabled
                      />
                     </div>
                    </td>
                    <td scope="row" className=" !px-1 ">
                     <div className="w-[200px]">
                     <NumericFormat
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        thousandSeparator=","
                         value={(
                                ((parseFloat(row?.agentComissionPercent) +
                                  parseFloat(row?.atlComissionPercent) +
                                  parseFloat(row?.tlComissionPercent) +
                                  parseFloat(row?.smComissionPercent)) *
                                  parseFloat(row?.netcom)) /
                                100
                              ).toFixed(2)}
                              disabled
                      />
                     </div>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <div className="w-[230px]">
                        {
                            row?.edit ? 
                              <NumericFormat
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={row?.bhPercentComission}
                        max="100"
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index] = {
                            ...newFilteredData[index], // Maintain other properties of the row
                            bhPercentComission: Number(e.target.value),
                            bhComission: row?.loyaltyBonus
                              ? parseFloat(
                                  ((parseFloat(row?.TotalComission) -
                                    parseFloat(row?.loyaltyBonus)) *
                                    Number(e.target.value)) /
                                    100
                                )
                                  .toFixed(2)
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              : (
                                  (parseFloat(row?.TotalComission) *
                                    Number(e.target.value)) /
                                  100
                                )
                                  .toFixed(2)
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                          };
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                      :
                       <p className={`w-full !mb-0 !mt-0 `}>{ row?.bhPercentComission ?  row?.bhPercentComission + '%' : null }</p>
                        }
                   </div>
                    </td>
                    <td scope="row" className=" !px-1 ">
                      <div className="w-[230px]">
                      <NumericFormat
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        thousandSeparator=","
                         value={(
                                (parseFloat(row?.netcom) *
                                  parseFloat(row?.bhPercentComission)) /
                                100
                              ).toFixed(2)}
                              disabled
                      />
                    </div>
                    </td>

                    <td scope="row" className=" !px-1 ">
                    <div className="w-[230px]">
                    <input
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        
                        max="100"
                        value={
                                parseFloat(row?.agentComissionPercent) +
                                parseFloat(row?.atlComissionPercent) +
                                parseFloat(row?.tlComissionPercent) +
                                parseFloat(row?.smComissionPercent) +
                                parseFloat(row?.bhPercentComission) + '%'
                              }
                        disabled
                      />
                    </div>
                    </td>
                    <td scope="row" className=" !px-1 ">
                      <div className="w-[230px]">
                      <NumericFormat
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        thousandSeparator=","
                        value={(
                                ((parseFloat(row?.agentComissionPercent) +
                                  parseFloat(row?.atlComissionPercent) +
                                  parseFloat(row?.tlComissionPercent) +
                                  parseFloat(row?.smComissionPercent) +
                                  parseFloat(row?.bhPercentComission)) *
                                  parseFloat(row?.netcom)) /
                                100
                              ).toFixed(2)}
                              disabled
                      />
                    </div>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <div className="w-[230px]">
                      <input
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={row?.comissiontoCompanyPercent}
                        max="100"
                         value={
                                100 - (parseFloat(row?.agentComissionPercent) +
                                parseFloat(row?.atlComissionPercent) +
                                parseFloat(row?.tlComissionPercent) +
                                parseFloat(row?.smComissionPercent) +
                                parseFloat(row?.bhPercentComission)) +'%'
                              }
                              max="100"
                             
                              disabled
                      />
                     </div>
                    </td>
                    <td scope="row" className=" !px-1 ">
                     <div className="w-[230px]">
                     <NumericFormat
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        thousandSeparator=","
                        value={
                                ((100 - (parseFloat(row?.agentComissionPercent) +
                                parseFloat(row?.atlComissionPercent) +
                                parseFloat(row?.tlComissionPercent) +
                                parseFloat(row?.smComissionPercent) +
                                parseFloat(row?.bhPercentComission))) * parseFloat(row?.netcom) / 100).toFixed(2)
                              }
                        disabled
                      />
                     </div>
                    </td>
                    <td scope="row" className=" !px-1 ">
                      <input
                        className={`px-1 w-[250px] py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={row?.additionalComments}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index] = {
                            ...newFilteredData[index], // Maintain other properties of the row
                            additionalComments: e.target.value,
                          };
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <div className="flex flex-col gap-1 w-[250px]">
                        <div className="flex items-center justify-start gap-1">
                          <input
                            className="px-1 py-1 disabled:!border-0 disabled:!bg-[#F1F5F7]"
                            type="checkbox"
                            checked={row?.comissionStatustoAgent == 1}
                            onChange={(e) => {
                              const newFilteredData = [...filteredData];
                              newFilteredData[index] = {
                                ...newFilteredData[index],
                                comissionStatustoAgent: e.target.checked
                                  ? 1
                                  : 0,
                              };
                              setFilteredData(newFilteredData);
                            }}
                            disabled={row.edit === null || row.edit === false}
                          />
                          <label className="!mb-0">Click if Comission Received</label>
                        </div>

                        <div>
                          {row?.comissionStatustoAgent == 1 ? (
                            <p className="!mb-0 bg-white text-green-500 !mt-0 text-center px-3 py-2 rounded-full">
                              Paid
                            </p>
                          ) : (
                            <p className="!mb-0 !mt-0 text-red-500 px-3 bg-white py-2 text-center rounded-full">
                              Not Paid
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td
                      scope="row"
                      className="  !px-1 "
                    >
                      <div className="w-[120px]">
                      {(row?.KYCimage != "https://crm-milestonehomes.com/public/kyc/undefined" && row?.KYCimage != null) &&
                              (row?.UNimage != "https://crm-milestonehomes.com/public/kyc/undefined" && row?.UNimage != null) &&
                              (row?.Sanctionimage != "https://crm-milestonehomes.com/public/kyc/undefined" && row?.Sanctionimage != null) &&
                              (row?.Riskimage != "https://crm-milestonehomes.com/public/kyc/undefined" && row?.Riskimage != null) ? (
                                <p className="px-1 text-sm py-2 mb-0 w-content bg-white rounded-full text-center text-green-400">
                                  Done
                                </p>
                              ) : 
                                row.approved == 53 ? <p className="px-1 text-sm py-2 mb-0 w-content bg-white rounded-full text-center text-green-400">
                                Approved by Superadmin
                              </p> :  
                                row.approved == 51 ? <p className="px-1 text-sm py-2 mb-0 w-content bg-white rounded-full text-center text-red-400">
                                Rejected
                              </p> : <p className="px-1 text-sm py-2 mb-0 w-content bg-white rounded-full text-center text-blue-400">
                                Awaiting
                              </p>
                              

                              }
                     </div>
                    </td>

                    <td
                      scope="row"
                      className=" !px-1  "
                    >
                      <div className={`!w-[150px]`}>
                    {(row?.KYCimage != "https://crm-milestonehomes.com/public/kyc/undefined" && row?.KYCimage != null) &&
                              (row?.UNimage != "https://crm-milestonehomes.com/public/kyc/undefined" && row?.UNimage != null) &&
                              (row?.Sanctionimage != "https://crm-milestonehomes.com/public/kyc/undefined" && row?.Sanctionimage != null) &&
                              (row?.Riskimage != "https://crm-milestonehomes.com/public/kyc/undefined" && row?.Riskimage != null) ? (
                                <p className="px-1 text-sm py-2 mb-0 w-content bg-white rounded-full text-center text-yellow-600">
                                  Pending
                                </p>
                              ) : 
                              row.approved == 53 ? <p className="px-1 text-sm py-2 mb-0 w-content bg-white rounded-full text-center text-green-400">
                              Done
                              </p> :  
                                 <p className="px-1 text-sm py-2 mb-0 w-content bg-white rounded-full text-center text-yellow-600">
                                Pending
                              </p> 

                              }
                    </div>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <input
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={row?.contractEndDate}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index] = {
                            ...newFilteredData[index], // Maintain other properties of the row
                            contractEndDate: e.target.value,
                          };
                          setFilteredData(newFilteredData);
                        }}
                        type="date"
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <input
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={row?.cheques}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index] = {
                            ...newFilteredData[index], // Maintain other properties of the row
                            cheques: e.target.value,
                          };

                          setFilteredData(newFilteredData);
                        }}
                        type="number"
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <NumericFormat
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index] = {
                            ...newFilteredData[index], // Maintain other properties of the row
                            securityDeposit: e.target.value,
                          };
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                        value={parseFloat(String(row?.securityDeposit).replace(/,/g, ""))
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        thousandSeparator=","
                      />
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <input
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={row?.TA}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index] = {
                            ...newFilteredData[index], // Maintain other properties of the row
                            TA: e.target.value,
                          };
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>

                    <td scope="row" className=" !px-1">
                      <input
                        disabled
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={
                          row?.loyaltyBonus
                            ? parseFloat(
                                parseFloat(row?.TotalComission) -
                                  parseFloat(row?.loyaltyBonus)
                              )
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : parseFloat(row?.TotalComission)
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                    </td>
                    <td scope="row" className=" !px-1 ">
                      <NumericFormat
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={parseFloat(String(row?.claim1).replace(/,/g, ""))
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        thousandSeparator=","
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index] = {
                            ...newFilteredData[index], // Maintain other properties of the row
                            claim1: e.target.value,
                          };
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <NumericFormat
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={parseFloat(String(row?.claim2).replace(/,/g, ""))
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index] = {
                            ...newFilteredData[index], // Maintain other properties of the row
                            claim2: e.target.value,
                          };
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                        thousandSeparator=","
                      />
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <NumericFormat
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={parseFloat(String(row?.claim3).replace(/,/g, ""))
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index] = {
                            ...newFilteredData[index], // Maintain other properties of the row
                            claim3: e.target.value,
                          };
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                        thousandSeparator=","
                      />
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <div className="flex flex-col w-[230px] gap-1">
                        <div className="flex items-center justify-start gap-1">
                          <input
                            className="px-1 py-1 disabled:!border-0 disabled:!bg-[#F1F5F7]"
                            type="checkbox"
                            checked={row?.fullComission == 1}
                            onChange={(e) => {
                              const newFilteredData = [...filteredData];
                              newFilteredData[index] = {
                                ...newFilteredData[index],
                                fullComission: e.target.checked ? 1 : 0,
                              };
                              setFilteredData(newFilteredData);
                            }}
                            disabled={row.edit === null || row.edit === false}
                          />
                          <label className="!mb-0">Click if Comission Received</label>
                        </div>

                        <div>
                          {row?.fullComission == 1 ? (
                            <p className="!mb-0 bg-white text-green-500 !mt-0 text-center px-3 py-2 rounded-full">
                              Completed
                            </p>
                          ) : (
                            <p className="!mb-0 !mt-0 text-red-500 px-3 bg-white py-2 text-center rounded-full">
                              Not Complete
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <NumericFormat
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={parseFloat(
                          String(row?.cancelledPrice).replace(/,/g, "")
                        )
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index] = {
                            ...newFilteredData[index], // Maintain other properties of the row
                            cancelledPrice: e.target.value,
                          };
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                        thousandSeparator=","
                      />
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <input
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={row?.dewaPremises}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index] = {
                            ...newFilteredData[index], // Maintain other properties of the row
                            dewaPremises: e.target.value,
                          };
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <input
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={row?.contractNumber}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index] = {
                            ...newFilteredData[index], // Maintain other properties of the row
                            contractNumber: e.target.value,
                          };
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>
                    <td scope="row" className=" !px-1 ">
                      <input
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={row?.titleNumber}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index] = {
                            ...newFilteredData[index], // Maintain other properties of the row
                            titleNumber: e.target.value,
                          };
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <input
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={row?.newTitleDeedNumber}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index] = {
                            ...newFilteredData[index], // Maintain other properties of the row
                            newTitleDeedNumber: e.target.value,
                          };
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>

                    <td scope="row" className=" !px-1 ">
                      <input
                        className={`px-1 py-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                        value={row?.agentname}
                        onChange={(e) => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index] = {
                            ...newFilteredData[index], // Maintain other properties of the row
                            agentname: e.target.value,
                          };
                          setFilteredData(newFilteredData);
                        }}
                        disabled={row.edit === null || row.edit === false}
                      />
                    </td>

                    <td
                        id='lastRow'
                      row={"row"}
                      className="sticky right-0 z-[9] !bg-[#F1F5F7] px-1"
                    >
                      <div className={ `flex item-center justify-around `}>
                      <button
                        className="text-lg cursor-pointer inline-block !mr-2"
                        onClick={() => {
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].edit = true;
                          setFilteredData(newFilteredData);
                        }}
                      >
                        <FaRegEdit />
                      </button>

                      <button
                        className={`text-lg !inline-block   ${
                          row.edit == null ||
                          row.edit == false ||
                          row.buyername.length < 1 ||
                          row.buyerContact.length < 1 ||
                          row.buyerdob.length < 1 ||
                          row.buyerpassport.length < 1 ||
                          row.passportexpiry.length < 1 ||
                          row.nationality.length < 1 ||
                          row.address.length < 1 ||
                          row.Closure.length < 1 ||
                          row.Booking.length < 1
                            ? "text-slate-300"
                            : "text-green-300"
                        } `}
                        onClick={() => {
                          submit(row, row._id);
                          const newFilteredData = [...filteredData];
                          newFilteredData[index].edit = false;
                          setFilteredData(newFilteredData);
                        }}
                        disabled={
                          row.edit === null ||
                          row.edit === false ||
                          row.buyername.length < 1 ||
                          row.buyerContact.length < 1 ||
                          row.buyerdob.length < 1 ||
                          row.buyerpassport.length < 1 ||
                          row.passportexpiry.length < 1 ||
                          row.nationality.length < 1 ||
                          row.address.length < 1 ||
                          row.Closure.length < 1 ||
                          row.Booking.length < 1
                        }
                      >
                        <ImCheckmark />
                      </button>
                      <button
                        className="text-lg cursor-pointer inline-block !mr-2"
                        onClick={() => {
                          exportFile(index);
                        }}
                      >
                        <MdFileDownload />
                      </button>
                  </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          </div>
        </div>
      </div> : 'Loading'
      }
      <ToastContainer />
    </RootLayout>
  );
}

export default allDeals;
