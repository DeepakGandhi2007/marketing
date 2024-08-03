"use client";
import axios from 'axios';
import Link from 'next/link';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import RootLayout from '../components/layout';
import Modal from '../components/modal';
import DocumentModal from '../components/doument';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import SearchableSelect from '@/app/Leads/dropdown';
import { FaRegEdit } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6" 
import moment from 'moment/moment';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { MultiSelect } from "react-multi-select-component";
import { IoIosInformationCircle } from "react-icons/io";
import TokenDecoder from "../components/Cookies";
function allDeals() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [userPerPage, setUserPerPage] = useState(10);
    const [kycFilter, setKycFilter] = useState(null)
    const [myData, setMyData] = useState([]);
    const [filteredData, setFilteredData] = useState([])
    const Agent = myData.map(agent => ({ label: agent?.Userid?.username, value:agent?._id}))
    const [agentFilter, setAgenFilter] = useState(null)
    const userdata = TokenDecoder();
   const [date, setDate] = useState([null, null])
   const userrole = userdata ? userdata.role : null;
   
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/invoice/get');
                setMyData(response.data.data);
                setFilteredData(response.data.data)

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

const exportFile = useCallback((id) => {
    if (!filteredData || typeof filteredData !== 'object') {
        console.error('Invalid or missing data.');
        return;
    }
    const urlPath = 'https://crm-milestonehomes.com/public/kyc/'
    const buyerOnepassFront = urlPath + filteredData[id]?.passfront?.split('kyc/').pop()
    const buyerOnepassBack = urlPath + filteredData[id]?.passback?.split('kyc/').pop()
    const buyerOneEOI = urlPath + filteredData[id]?.eoiimage?.split('kyc/').pop()
    const handleDownload = async () => {
    try {
        
        
         
        const front = await fetch(buyerOnepassFront).then(response => response.blob());
        const back = await fetch(buyerOnepassFront).then(response => response.blob());
        const eoi = await fetch(buyerOnepassFront).then(response => response.blob()); 
        FileSaver.saveAs(front, 'passfront.jpg');
        FileSaver.saveAs(back, 'passback.jpg');
        FileSaver.saveAs(eoi, 'eoi.jpg'); // Specify a file name for the downloaded image
    } catch (error) {
      console.error('Error downloading image:', error);
    }

    
}

    const customHeadersMain = [
        { header: 'Sr.', width: 5, color: '#000000' },
        { header: 'Date on Board', width: 20 },
        { header: 'Agent', width: 20 },
        { header: 'Rent/Sale', width: 20 },
        { header: 'Full Name', width: 20, color: '#FF0000' }, // Red color for 'Full Name'
        { header: 'Nationality', width: 20 },
        { header: 'Customer ID', width: 15 },
        { header: 'Passport Expiry', width: 20 },
        { header: 'Date of Birth', width: 15 },
        { header: 'Address', width: 30 },
        { header: 'Resident/Non Resident', width: 30 },
        { header: 'Salary/Non Salary', width: 30 },
        { header: 'Mobile No.', width: 20 },
        { header: 'Email', width: 25 },
        { header: 'Risk Classification', width: 30 },
        { header: 'Value/ Volume of Transaction', width: 30 },
    ];

    // Combine custom headers for both main data and additional buyers
    const customHeaders = customHeadersMain.map(header => header.header);

    // Extract buyer data from filteredData
    const buyerData = filteredData[id]; // Modify this according to your data structure

    // Flatten the buyer data into an array
    const buyerRow = [
        1,
        moment(buyerData?.timestamp).format('DD-MM-YY'),
        buyerData?.Userid?.username,
        'Sale',
        buyerData?.buyername,
        buyerData?.nationality,
        'customerId',
        buyerData?.passportexpiry,
        buyerData?.buyerdob,
        buyerData?.address,
        buyerData?.Resident,
        'salary',
        buyerData?.buyerContact,
        buyerData?.buyerEmail,
        'risk',
        'price'
    ];

    // Flatten the array data below buyerRow
    const additionalRows = (filteredData[id]?.additionalBuyers || []).map((buyerOne, index) => [
        index + 2,
        moment(buyerOne?.timestamp).format('DD-MM-YY'),
        buyerOne?.Userid?.username,
        'Sale',
        buyerOne?.buyername,
        buyerOne?.nationality,
        'customerId',
        buyerOne?.passportexpiry,
        buyerOne?.buyerdob,
        buyerOne?.address,
        buyerOne?.Resident,
        'salary',
        buyerOne?.buyerContact,
        buyerOne?.buyerEmail,
        'risk',
        'price'
        // Add more properties as needed
    ]);

    // Create worksheet data array
    const worksheetData = [customHeaders, buyerRow, ...additionalRows];

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    const colWidths = [];
    customHeadersMain.forEach(header => colWidths.push({ wch: header.width }));
    worksheet['!cols'] = colWidths;

    // Apply styles to header row
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = { c: C, r: range.s.r };
        const cell = worksheet[XLSX.utils.encode_cell(cellAddress)];
        const headerIndex = C - range.s.c; // Index of the header in customHeadersMain array
        const header = customHeadersMain[headerIndex];

        // Apply header style
        const headerStyle = {
            fill: { fgColor: { rgb: header.color || 'FFFF00' } }, // Default to yellow color if no color specified
            font: { bold: true, color: { rgb: header.color || '000000' } } // Default to black font color if no color specified
        };
        cell.s = { ...headerStyle };
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Create an Excel file
    XLSX.writeFile(workbook, 'exported_data.xlsx');
    handleDownload()
}, [filteredData]);
    
    const kycTypes = [{value:'53', label:'Approved'}, {value:'10', label:'Pending'}, {value:'54', label:'Reject'}]


  const agentNames = [
      { value: 'Super admin', label: 'Super admin' },
        { value: 'Admin', label: 'Admin' },
        { value: 'SalesHead', label: 'Sales Head' },
        { value: 'Manager', label: 'Manager' },
        { value: 'BussinessHead', label: 'Bussiness Head' },
        { value: 'PNL', label: 'PNL' },
        { value: 'TL', label: 'TL' },
        { value: 'ATL', label: 'ATL' },
        { value: 'FOS', label: 'FOS' },
    ]




     useEffect(() => {
    let filteredResult = myData;

    if (agentFilter) {
      filteredResult = filteredResult.filter(agent => agent.Userid.username === agentFilter);
    }

    if (kycFilter) {
      if (kycFilter === '10') {
        filteredResult = filteredResult.filter(agent => agent.approved !== '53' && agent.approved !== '54');
      } else {
        filteredResult = filteredResult.filter(agent => agent.approved == kycFilter);
      }
    }

    if (date[1] && date[0] != null) {
      const [startDate, endDate] = date;
      const start = moment(startDate).format('DD-MM-YYYY')
      const end = moment(endDate).format('DD-MM-YYYY')
      filteredResult = filteredResult.filter(item => {
        const itemDate = moment(item?.timestamp).format('DD-MM-YYYY');
        console.log(itemDate,"itemDate");
        console.log(start,end,"start");

        return itemDate >= start && itemDate <= end;
      });
      
    }
    setFilteredData(filteredResult);
  }, [agentFilter, kycFilter, myData, date]);

    const toggleModal = (e,user = null) => {
        if (e) {
            e.preventDefault();
        }
          setSelectedUser(user);
        setIsModalOpen(!isModalOpen);
    };
    const [users, setUsers] = useState([]);
     
 
   const toggleDocumentModal = (e, userId) => {
    setIsDocumentModalOpen(!isDocumentModalOpen);
    setSelectedUserId(userId);
};



    const downloadFile = async (fileUrl) => {
        try {
            const response = await axios.get(fileUrl, {
                responseType: 'blob', // important for downloading files
            });
            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', fileUrl.substring(fileUrl.lastIndexOf('/') + 1));
            document.body.appendChild(link);
            link.click(); // This should trigger the download
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };
    const indexOfLastUser = currentPage * userPerPage;
    const indexOfFirstUser = indexOfLastUser - userPerPage;
   

    const nextPage = () => {
        if (currentPage < Math.ceil(users.length / userPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
  
   const handleDateChange = (value) => {
    setDate(value)
}
    

    const disabledFutureDates = (date) => {
        // Disable dates after today
        return date && date.getTime() > Date.now();
      };
      console.log(myData)
      
      
      var _date = moment(); var _date2 = moment().date(0);
      
    const [activeIndex, setActiveIndex] = useState(null); // State to track active popup index
    const buttonRefs = useRef([]);
    const popupRefs = useRef([]);

    const handleButtonClick = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeIndex !== null && popupRefs.current[activeIndex] &&
                !popupRefs.current[activeIndex].contains(event.target) &&
                buttonRefs.current[activeIndex] &&
                !buttonRefs.current[activeIndex].contains(event.target)) {
                setActiveIndex(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeIndex]);
    
    
    
  const approved = async (index) => {
    try {
      await axios.put(`/api/invoice/status/${myData[index]._id}`, {
        status: 53,
      });
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };
  const Reject = async (index) => {
    try {
      await axios.put(`/api/invoice/status/${myData[index]._id}`, {
        status: 54,
      });
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };
    return (


        <RootLayout>
            {isModalOpen && <Modal setUsers={setUsers} userdata={selectedUser}  onClose2={toggleModal} />} {/* Render modal if isModalOpen is true */}
            {isDocumentModalOpen && <DocumentModal isOpen={isDocumentModalOpen} onClose={toggleDocumentModal} savedUser={selectedUserId} defaultCalendarValue={[new Date('05/01/2021'), new Date('05/08/2021')]} />}
            <div className="flex justify-end w-full mt-20 !px-0">
                    <div className="tablet:w-[calc(100%-100px)]  mobile:w-full h-full overflow-x-hidden">
                      <div className="w-full   px-4 py-4">
                        <p className="text-lg font-[500]  font-Satoshi w-full ">
                          KYC and Sanctions
                        </p>
                        
                           <div className="flex justify-start items-center gap-10 !mt-5">
                                        <div>
                                            <SearchableSelect options={agentNames} onChange={(value)=>setAgenFilter(value.label)} placeholder={'Agent Name'}></SearchableSelect>
                                        </div>

                                        <div className={`flex items-center gap-3`}>
                                            
                                            <SearchableSelect options={kycTypes} onChange={(value)=>setKycFilter(value.value)}  placeholder={'KYC Filter'}>
                                            
                                            </SearchableSelect>
                                    
                                        </div>

                                        <div className='flex justify-center items-center cursor-pointer'>
                                            <DateRangePicker className={'cursor-pointer'} placeholder="Select Date Range" onClean={()=>setDate([null, null])} title='Click twice to select single date'  calendarDefaultDate={new Date()} shouldDisableDate={disabledFutureDates} onChange = {handleDateChange} defaultCalendarValue={[new Date(_date2),new Date(_date)]} />
                                        </div>

                                       
                              
                                    </div>
                                    
                                      <div className="table-responsive">
                                                <table className="table mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Date of Closure</th>
                                                            <th>Agent Name</th>
                                                            <th>Deal Type</th>
                                                            <th>Project Name</th>
                                                            <th>KYC Status</th>
                                                            <th>KYC Date</th>
                                                            <th>Approved By</th>
                                                            {userrole?.toLowerCase() == "superadmin" ||
                                                                userrole?.toLowerCase() == "admin" ? (
                                                                <th>Admin Approval</th>
                                                                    ) : null}
                                                                <th  className='!text-center'>Reason</th>
                                                             <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                       {
                                                       filteredData.map((user, index) => (
                                                            <tr key={index}>
                                                                <th scope="row">{index  + 1}</th>
                                                                <td>{moment(user?.timestamp).format('DD-MM-YYYY')}</td>
                                                                <td>{user?.Userid?.username}</td>
                                                                <td>{user?.Ready}</td>
                                                                <td>{user?.ProjectName}</td>
                                                              <td>
                                                                    {user.documents ? (
                                                                        <div className="dropdown">
                                                                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                                                                Select Document
                                                                            </button>
                                                                            {/* Dropdown menu content can be added here */}
                                                                        </div>
                                                                    ) : (
                                                                     <>
                                                                       {user.approved == 53 ? (
                                                                             
                                                                            <p className="px-1 text-sm py-2 mb-0 w-content bg-gray-100 rounded-full text-center text-green-400">
                                                                              Approved by Superadmin
                                                                            </p>
                                                                          ) : user.approved == 54 ? (
                                                                         
                                                                            <p className="px-1 text-sm py-2 mb-0 w-content bg-gray-100 rounded-full text-center text-red-400">
                                                                              Rejected by Superadmin
                                                                            </p>
                                                                          ) : user.KYCimage !==
                                                                              "https://crm-milestonehomes.com/public/kyc/undefined" &&
                                                                            user.Riskimage !==
                                                                              "https://crm-milestonehomes.com/public/kyc/undefined" &&
                                                                            user.Sanctionimage !==
                                                                              "https://crm-milestonehomes.com/public/kyc/undefined" &&
                                                                            user.UNimage !==
                                                                              "https://crm-milestonehomes.com/public/kyc/undefined" &&
                                                                            user.approved != 53 &&
                                                                            user.approved != 54 ? (
                                                                            <p className="px-1 py-2 mb-0 w-content bg-gray-100 rounded-full text-center text-blue-400">
                                                                              Awaiting
                                                                            </p>
                                                                          ) : (
                                                                            <p className="px-1 py-2 mb-0 w-content bg-gray-100 rounded-full text-center text-yellow-400">
                                                                              Pending
                                                                            </p>
                                                                          )}
                                                                    </>

                                                                
                                                                    )}
                                                                </td>

                                                                 <td className='mx-auto my-auto !mb-0 '>{user?.kycDate ? "user?.kycDate":'N/A'}</td>

                                                                <td className='mx-auto my-auto !mb-0 '>{user?.approvedby[0]?.username} </td>
                                                                 {userrole?.toLowerCase() == "superadmin" ||
                                                                    userrole?.toLowerCase() == "admin" ? (
                                                                      <td>
                                                                        {
                                                                            user.approved != 53 && user.approved != 54  ? <div className="flex items-center gap-1">
                                                                          <button
                                                                            className="px-3 py-1   bg-green-400 hover:bg-green-500 rounded-full text-white"
                                                                            onClick={() => approved(index)}
                                                                          >
                                                                            Approve
                                                                          </button>{" "}
                                                                          <button
                                                                            className="px-3 py-1   bg-red-400 hover:bg-red-600 rounded-full  text-white"
                                                                            onClick={() => Reject(index)}
                                                                          >
                                                                            Reject
                                                                          </button>
                                                                        </div> : null
                                                                        }
                                                                      </td>
                                                                    ) : null}
                                                                <td>  <div className={`w-full text-center`}>
                                                                {user.approved == "51" || user.approved == "50" ? (
                                                                    <div className={`w-full flex justify-center relative`}>
                                                                        <button
                                                                            onClick={() => handleButtonClick(index)}
                                                                            ref={(el) => (buttonRefs.current[index] = el)}
                                                                            className={`font-Satoshi font-[500] cursor-pointer text-2xl`}
                                                                        >
                                                                            <IoIosInformationCircle />
                                                                        </button>
                                                                        {activeIndex === index && (
                                                                            <p
                                                                                ref={(el) => (popupRefs.current[index] = el)}
                                                                                className="absolute z-10 top-6 bg-white px-3 py-2 text-md font-medium shadow-md rounded-md inline-block"
                                                                                style={{
                                                                                    whiteSpace: 'nowrap',
                                                                                    maxWidth: '500px',
                                                                                    minWidth: 'auto',
                                                                                    overflow: 'hidden',
                                                                                    textOverflow: 'ellipsis',
                                                                                }}
                                                                            >
                                                                                {user?.Reasons}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    'N/A'
                                                                )}
                                                                    </div> </td>
                                                                
                                                                <td className='!flex !justify-start !items-center gap-2 '><Link  href={{pathname: '/operationsForm',query: { leadId: user._id }}}><button className='!mb-0 text-lg'><FaRegEdit /></button></Link> <button href='link' className='!mb-0'><FaDownload onClick={()=>{exportFile(index)}} /></button></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            
                                             <div className="col-sm-12 col-md-12">
                                            <div className="dataTables_info" id="datatable_info" role="status" aria-live="polite">
                                                Showing {currentPage * userPerPage - userPerPage + 1} to{' '}
                                                {Math.min(currentPage * userPerPage, filteredData.length)} of {filteredData.length}{' '}
                                                entries
                                            </div>
                                        </div>
                                           <div className="col-sm-12 col-md-12">
                                            <div className="dataTables_paginate paging_simple_numbers" id="datatable_paginate">
                                                <ul className="pagination pagination-rounded">
                                                    <li className={`paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}`} id="datatable_previous">
                                                        <a href="#" aria-controls="datatable" aria-disabled={currentPage === 1} role="link" data-dt-idx="previous" tabIndex={0} className="page-link" onClick={prevPage}>
                                                            <i className="mdi mdi-chevron-left" />
                                                        </a>
                                                    </li>
                                                    {Array.from({ length: Math.ceil(filteredData.length / userPerPage) }, (_, i) => (
                                                        <li key={i} className={`paginate_button page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                                                            <a href="#" aria-controls="datatable" role="link" aria-current={i + 1 === currentPage ? 'page' : null} data-dt-idx={i} tabIndex={0} className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                                                {i + 1}
                                                            </a>
                                                        </li>
                                                    ))}
                                                    <li className={`paginate_button page-item next ${currentPage === Math.ceil(filteredData.length / userPerPage) ? 'disabled' : ''}`} id="datatable_next">
                                                        <a href="#" aria-controls="datatable" aria-disabled={currentPage === Math.ceil(filteredData.length / userPerPage)} role="link" data-dt-idx="next" tabIndex={0} className="page-link" onClick={nextPage}>
                                                            <i className="mdi mdi-chevron-right" />
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    
                      </div>  
                      </div>  
                      </div>  
                        
        


        </RootLayout>


    )
}

export default allDeals
