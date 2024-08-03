"use client";
import React, { useEffect, useState, useRef } from 'react';
import RootLayout from '@/app/components/layout';
import SearchableSelect from '@/app/Leads/dropdown';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import TokenDecoder from '../components/Cookies';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import styles from '../Modal.module.css';
import { formatDate } from 'date-fns';
import { FaDownload } from "react-icons/fa6";
import { IoIosInformationCircle } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import ViewModal from '../components/ViewModal';

const styless = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 20
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 20,
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
        fontWeight: 'normal', // Changed from 'bold' to 'normal'
    },
    title: {
        fontSize: 16,
        fontWeight: 'normal',
        marginBottom: 10
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    subheader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
     table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableColHeader: {
        width: "50%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: "#d3d3d3",
    },
    tableCol: {
        width: "50%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableCellHeader: {
        margin: 5,
        fontSize: 10,
        fontWeight: 'bold',
    },
    tableCell: {
        margin: 5,
        fontSize: 10,
    }
});

function Invoice() {
    const decodedToken = TokenDecoder();
    const parentStaff = decodedToken ? decodedToken.id : null;
    const role = decodedToken ? decodedToken.role : null;

    const [invoice, setInvoice] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const [reason, setReason] = useState('');
    console.log(isModalOpen2,"isModalOpen");
   useEffect(() => {
    const fetchData = async () => {
        try {
            let response;
            if (role === "Admin") {
                response = await axios.get(`/api/invoice/get`);
            } 
             if (role === "superAdmin") {
                response = await axios.get(`/api/invoice/get`);
            } 
            else if (role === "FOS") {
                response = await axios.get(`/api/invoice/me/${parentStaff}`);
            }
            else {
                response = await axios.get(`/api/invoice/get/${parentStaff}`);
            }
            console.log(response.data.data,"respone");
            setInvoice(response.data.data);
        } catch (error) {
            console.error('Error fetching invoice:', error);
        }
    };

    if (parentStaff) {
        fetchData();
    }

}, [parentStaff, role]);

    const htmlContent = "<h1>Hello, world!</h1>";

    const handleDownloadPDF = (item) => {
        console.log(item,"item");
        const pdfContent = (
            <Document>
                <Page size="A4" style={styless.page}>
                    <View style={styles.table}>
                    <View style={styless.section}>
                    <View style={styles.tableRow}>
                            <View style={styles.tableColHeader}>
                                <Text style={styles.tableCellHeader}>Field</Text>
                            </View>
                            <View style={styles.tableColHeader}>
                                <Text style={styles.tableCellHeader}>Value</Text>
                            </View>
                        </View>
                        <Text style={styless.text}>{'\n'}Created Date: {new Date(item.timestamp).toLocaleDateString()}</Text>
                        <Text style={styless.text}>{'\n'}Agent Name: {item?.Userid?.username}</Text>
                        <Text style={styless.text}>{'\n'}Project Name: {item.ProjectName}</Text>
                        <Text style={styless.text}>{'\n'}Value: {item.Price}</Text>
                        <Text style={styless.text}>{'\n'}BUA: {item.BUA}</Text>
                        <Text style={styless.text}>{'\n'}Bed: {item.Bed}</Text>
                        <Text style={styless.text}>{'\n'}Booking Date: {item.Booking}</Text>
                        <Text style={styless.text}>{'\n'}Closure Date: {item.Closure}</Text>
                        <Text style={styless.text}>{'\n'}Comission: {item.Comission}</Text>
                        <Text style={styless.text}>{'\n'}ComissionVAT: {item.ComissionVAT}</Text>
                        <Text style={styless.text}>{'\n'}Developer: {item.Developer} {item.othrDeveloper}</Text>
                        <Text style={styless.text}>{'\n'}EOI Date: {item.EOI}</Text>
                        <Text style={styless.text}>{'\n'}Handover Date: {item.Handover}</Text>
                        <Text style={styless.text}>{'\n'}Property Type: {item.Property}</Text>
                        <Text style={styless.text}>{'\n'}Ready/Offplan: {item.Ready}</Text>
                        <Text style={styless.text}>{'\n'}UAE Resident: {item.Resident}</Text>
                        <Text style={styless.text}>{'\n'}Buyer Name: {item.buyername}</Text>
                        <Text style={styless.text}>{'\n'}Buyer Email: {item.buyerEmail}</Text>
                        <Text style={styless.text}>{'\n'}Buyer Contact: {item.buyerContact}</Text>
                        <Text style={styless.text}>{'\n'}Buyer Passport no.: {item.buyerpassport}</Text>
                        <Text style={styless.text}>{'\n'}Buyer Emirate Id: {item.emiratesid}</Text>
                        <Text style={styless.text}>{'\n'}Buyer Emirate Expiry Date: {item.emiratesExpiry}</Text>
                        <Text style={styless.text}>{'\n'}Buyer Nationality: {item.nationality}</Text>
                        <Text style={styless.text}>{'\n'}Plot Area in Sq.ft: {item.PlotArea}</Text>
                        <Text style={styless.text}>{'\n'}Plot No.: {item.PlotNumber}</Text>
                        <Text style={styless.text}>{'\n'}Unit Complete Address: {item.Unitaddress}</Text>
                        <Text style={styless.text}>{'\n'}Loyalty Bonus (% and Amount): {item.loyaltyBonus}</Text>
                    </View>
                     </View>
                </Page>
            </Document>
        );

        // Return the PDFDownloadLink component for downloading the PDF
        return (
            <PDFDownloadLink document={pdfContent} fileName="invoice.pdf">
                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : <FaDownload className='text-2xl cursor-pointer'/> )}
            </PDFDownloadLink>
        );
    };

    const [date, setDate] = useState()
    

 const approved = async (invoiceid, approvedBy) => {
        try {
            if (role == "Admin") {
                await axios.put(`/api/invoice/status/${invoiceid}`, { status: 5, approvedBy });
            } 
             if (role == "superAdmin") {
                await axios.put(`/api/invoice/status/${invoiceid}`, { status: 5, approvedBy });
            }
            else if (role == "ATL") {
                await axios.put(`/api/invoice/status/${invoiceid}`, { status: 1, approvedBy });
            } else if (role == "TL") {
                await axios.put(`/api/invoice/status/${invoiceid}`, { status: 2, approvedBy });
            } else if (role == "PNL") {
                await axios.put(`/api/invoice/status/${invoiceid}`, { status: 3, approvedBy });
            } else if (role == "BussinessHead") {
                await axios.put(`/api/invoice/status/${invoiceid}`, { status: 4, approvedBy });
            }
            window.location.href="http://crm-milestonehomes.com:8080/Your-Deals"
        } catch (error) {
            console.error('Error updating lead status:', error);
        }
    };
const openModal = (invoiceid) => {
        setSelectedInvoiceId(invoiceid);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setReason('');
    };
     const handleDisapprove = async () => {
        try {
            let status;
            if (role === "Admin") {
                status = 10;
            }
             if (role == "superAdmin") {
               status = 10;
            }else if (role === "ATL") {
                status = 6;
            } else if (role === "TL") {
                status = 7;
            } else if (role === "PNL") {
                status = 8;
            } else if (role === "BussinessHead") {
                status = 9;
            }
            await axios.put(`/api/invoice/status/${selectedInvoiceId}`, { status, reason, approvedBy: parentStaff });
            closeModal();
            window.location.href="http://crm-milestonehomes.com:8080/Your-Deals"
        } catch (error) {
            console.error('Error updating lead status:', error);
        }
    };
    

  
   
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
    
    
  const handleViewClick = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen2(true);
    };
    return (
        <RootLayout>
        {isModalOpen2 && (
                <ViewModal invoice={selectedInvoice} onClose={() => setIsModalOpen2(false)} />
            )}
            
            <div className="flex justify-end w-full mt-20 !px-0">
        <div className="tablet:w-[calc(100%-100px)]  mobile:w-full h-full overflow-x-hidden">
          <div className="w-full   px-4 py-4">
            <p className="text-lg font-[500]  font-Satoshi w-full ">
              Your Deals
            </p>
            
            <div className="table-responsive">
                        <table className="table mt-4">
                            <thead>


                                <tr className='!font-bold !text-lg !bg-slate-50 !border-b !border-slate-600 '>
                                    <th className='!text-center'>#</th>
                                    <th  className='!text-center'>Date</th>
                                     {role !== "FOS" ? (
                                    <th  className='!text-center'>Agent</th>
                                    ) :  <th  className='!text-center'>Customer Name</th>}
                                    <th  className='!text-center'>Project Name</th>
                                    <th  className='!text-center'>Value</th>
                                    <th  className='!text-center'>Status</th>
                                     <th  className='!text-center'>Reason</th>
                                    <th  className='!text-center'>View</th>

                                        <th scope="col" className='!flex !justify-center !items-center !border-0'>Download
                                        </th>
                                    <th scope="col" className='!text-center'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='!bg-slate-50 !text-md'>
                                {invoice.map((item, index) => (
                                    <tr key={index} className='!border-b border-gray-300 !h-[70px]'>
                                        <th  >{index + 1}</th>
                                        <td className='!text-center '><p className='!mb-0 !mt-2'>{new Date(item.timestamp).toLocaleDateString()}</p></td>
                                        {role !== "FOS" ? (
                                        <td className='!flex justify-center !items-center !border-0'><p>{item?.Userid?.username}</p></td>
                                        ) : <td className='!text-center'>{item.buyername}</td>}
                                        <td className='!text-center'>{item.ProjectName}</td>
                                        <td className='!text-center'>{item.Price}</td>
                                   <td>
                                            {(["6", "7", "8", "9", "10"].includes(item.approved)) ? (
                                                <p className="px-1 py-2 mb-0 w-content bg-gray-100 rounded-full text-center text-red-400">Rejected</p>
                                            ) : (
                                                (item.approved !== "50" && item.approved !== "51" && item.approved !== "100") ? (
                                                    <p className="px-1 py-2 mb-0 w-content bg-gray-100 rounded-full text-center text-green-400">Approved By {item.approvedby[0]?.username}</p>
                                                ) : (
                                                    <p className="px-1 py-2 mb-0 w-content bg-gray-100 rounded-full text-center text-yellow-400">Pending</p>
                                                )
                                            )}
                                        </td>


                                     <td className={``}>
                            <div className={`w-full text-center`}>
                                {item.approved == "6" || item.approved == "7" || item.approved == "8" || item.approved == "9" || item.approved == "10"? (
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
                                                {item.cancelreason}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    'N/A'
                                )}
                            </div>
                        </td>
                          <td className={``}>
                                         <button className='btn !border !border-slate-900 !rounded-full hover:!bg-yellow-400 !text-slate-900' onClick={() => handleViewClick(item)}>
                                                                            View
                                                                        </button>

                                        
                                </td>
                        
                                    <td className='!flex !justify-center !items-center !border-0'>
                                        
                                            
                                            {handleDownloadPDF(item)}
                                        
</td>

                                        <td>
                                            <div >

                                               {role !== "FOS" && (
                                                    <>
                                                            {((role == "superAdmin" || role == "Admin") || !item.submittedBy.includes(parentStaff)) &&
                                                            !(item.approved === "2" && role === "ATL") &&
                                                            !(item.approved === "3" && role === "TL") &&
                                                            !(item.approved === "4" && role === "PNL") &&
                                                            !(item.approved === "5" ) &&
                                                            !(item.approved === "10") &&
                                                            !(item.approved === "7" && role === "ATL") &&
                                                            !(item.approved === "8" && role === "TL") &&
                                                            !(item.approved === "9" && role === "PNL") && (
                                                                <div className='!flex justify-center items-center gap-2'>
                                                                    <div>
                                                                        <button
                                                                            className='btn !border !border-slate-900 !rounded-full hover:!bg-green-400 !text-slate-900'
                                                                            onClick={() => approved(item._id, parentStaff)}
                                                                        >
                                                                            Approve
                                                                        </button>
                                                                    </div>
                                                                    <div>
                                                                        <button
                                                                            className='btn hover:!bg-red-400 !border !border-slate-900 !rounded-full !text-slate-900 !px-6'
                                                                            onClick={() => openModal(item._id)}
                                                                        >
                                                                            Reject
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                    </>
                                                )}

                                            </div>
                                        </td>
                                         

                                    </tr>

                                ))}
                            </tbody>
                        </table>
</div>
            
            </div>
            </div>
            </div>
            
            
            <Modal isOpen={isModalOpen} onRequestClose={closeModal} className={styles.modalBackdrop} overlayClassName={styles.modalOverlay} contentLabel="Disapproval Reason">
    <div className={`w-[30vw] flex flex-col bg-white px-3 py-3 gap-3 rounded-md `}>
         <div className="w-full  flex items-center justify-between">
                      <p className="!mb-0 text-2xl font-Satoshi font-[500]">Reason for cancel</p>
                      <IoCloseSharp className="text-2xl hover:text-red-500 cursor-pointer" onClick={closeModal} />
          </div>
       
         <div className="flex px-2 flex-col items-center gap-3">
            <div className="w-full">
              <textarea
                className="form-control resize-none h-[200px]"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Notes Description"
              />
            </div>
            <div className="w-full">
              <button
                className="w-full bg-blue-500 hover:!bg-blue-400 hover:shadow-md text-lg text-slate-200 py-2 rounded-md"
                onClick={handleDisapprove}
              >
                Submit
              </button>
            </div>
          </div>
    </div>
</Modal>

            <ToastContainer />
        </RootLayout >
    )
}

export default Invoice;
