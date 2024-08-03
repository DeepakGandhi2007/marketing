"use client";
import axios from 'axios';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import RootLayout from '../components/layout';
import Modal from '../components/modal';
import DocumentModal from '../components/doument';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import SearchableSelect from '@/app/Leads/dropdown';
import "react-datepicker/dist/react-datepicker.css";
import { FaRegEdit } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6" 
import moment from 'moment/moment';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

function allDeals() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [userPerPage, setUserPerPage] = useState(10);
    const [myData, setMyData] = useState([]);
    const [filteredData, setFilteredData] = useState([])
    const Agent = myData.map(agent => ({ label: agent?.Userid?.username, value:agent?._id}))
    const [agentFilter, setAgenFilter] = useState(null)
    const [kycFilter, setKycFilter] = useState('')
   const [date, setDate] = useState([null, null])
   
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








     useEffect(() => {
    let filteredResult = myData;

    if (agentFilter) {
      filteredResult = filteredResult.filter(agent => agent.Userid.username === agentFilter);
    }

    if (kycFilter) {
      filteredResult = filteredResult.filter(agent => agent.kycStatus === kycFilter);
    }

    if (date[1] && date[0] != null) {
      const [startDate, endDate] = date;
      const start = moment(startDate).format('DD-MM-YYYY')
      const end = moment(startDate).format('DD-MM-YYYY')
      
      filteredResult = filteredResult.filter(item => {
        const itemDate = moment(item?.timestamp).format('DD-MM-YYYY'); // Convert API date to Date object
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

    console.log(filteredData)

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
      
      
      var _date = moment(); var _date2 = moment().date(0);
    return (


        <RootLayout>
            {isModalOpen && <Modal setUsers={setUsers} userdata={selectedUser}  onClose2={toggleModal} />} {/* Render modal if isModalOpen is true */}
            {isDocumentModalOpen && <DocumentModal isOpen={isDocumentModalOpen} onClose={toggleDocumentModal} savedUser={selectedUserId} defaultCalendarValue={[new Date('05/01/2021'), new Date('05/08/2021')]} />}

            <div className='container-fluid'>
                <div className='row'>
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                              <div className='row'>
                                    <div className='w-full h-12 bg-blue-700'><p className='!flex text-xl font-bold !justify-start h-full text-slate-100 !items-center !mb-0'>Deals and Invoices</p></div>
                                    <div className="flex justify-start items-center gap-10 !mt-5">
                                        <div>
                                            <SearchableSelect options={Agent} onChange={(value)=>setAgenFilter(value.label)} placeholder={'Agent Name'}></SearchableSelect>
                                        </div>

                                        <div>
                                            <SearchableSelect options={[{value:'Done', label:'Done'}, {value:'Pending', label:'Pending'}, {value:'Reject', label:'Reject'}]}   placeholder={'KYC Filter'}></SearchableSelect>
                                        </div>

                                        <div className='flex justify-center items-center '>
                                            <DateRangePicker placeholder="Select Date Range" onClean={()=>setDate([null, null])}  calendarDefaultDate={new Date()} shouldDisableDate={disabledFutureDates} onChange = {handleDateChange} defaultCalendarValue={[new Date(_date2),new Date(_date)]} />
                                            
                                            
                                        </div>

                                       
                              
                                    </div>
                                </div>

                                <div
                                    id="datatable_wrapper"
                                    className="dataTables_wrapper dt-bootstrap4 no-footer !mt-5"
                                >
                                    <div className="row">
                                        <div className="col-sm-12">
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
                                                             <th>Admin Approval</th>
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
                                                                <td></td>
                                                                <td>{}</td>
                                                                <td>
                                                                    {user.documents ? (
                                                                        <div className="dropdown">
                                                                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                                                                Select Document
                                                                            </button>
                                                                          
                                                                        </div>
                                                                    ) : (
                                                                        <p className={'px-1 py-2 mb-0 w-content bg-gray-100 rounded-full text-center text-red-400'}>Pending</p>
                                                                    )}
                                                                </td>
                                                                 <td className='mx-auto my-auto !mb-0 '>{user?.kyDate ? "user?.kyDate":'N/A'}</td>

                                                                <td className='mx-auto my-auto !mb-0 '> <p className={'py-2 !mb-0 bg-gray-100 rounded-full text-center text-green-400'}>Done</p></td>
                                                                
                                                                <td className='!flex !justify-start !items-center gap-2'><Link  href={{pathname: '/operationsForm',query: { leadId: user._id }}}><button className='!mb-0'><FaRegEdit /></button></Link> <button href='link' className='!mb-0'><FaDownload onClick={()=>{exportFile(index)}} /></button></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    </div>
                              <div className="row">
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
                        </div>
                    </div>
                </div>
                <Link
                    href="/"
                    className="float"
                    onClick={toggleModal}
                >
                    <i className="fa fa-plus my-float" />
                </Link>
                 
            </div>




        </RootLayout>


    )
}

export default allDeals
