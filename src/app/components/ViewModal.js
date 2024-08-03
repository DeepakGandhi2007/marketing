import React, { useEffect, useState } from 'react';
import styles from '../Modal.module.css';
import axios from 'axios';
import SearchableSelect from '../Leads/dropdown';
import 'bootstrap/dist/css/bootstrap.css';
import { ToastContainer, toast } from 'react-toastify';

const ViewModal = ({ onClose, invoice }) => {
   
    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <span className={styles.closeButton} onClick={onClose}>
                    &times;
                </span>
           <table className="table mt-4">
                            <thead>
                                <tr className='!font-bold !text-lg !bg-slate-50 !border-b !border-slate-600 '>
                                    <th className='!text-center'>Agent Name</th>
                                    <th className='!text-center'>Project Name</th>
                                    <th className='!text-center'>Deal Value</th>
                                    <th className='!text-center'>Comission</th>
                                    <th className='!text-center'>Developer</th>
                                    <th className='!text-center'>Customer Name</th>
                                </tr>
                            </thead>
                            <tbody className='!bg-slate-50 !text-md'>
                                <tr className='!border-b border-gray-300 !h-[70px]'>
                                        <th className='!text-center '><p className='!mb-0 !mt-2'>{invoice.Userid.username}</p></th>
                                        <th className='!text-center '><p className='!mb-0 !mt-2'>{invoice.ProjectName}</p></th>
                                        <th className='!text-center '><p className='!mb-0 !mt-2'>{invoice.Price}</p></th>
                                        <td className='!text-center '><p className='!mb-0 !mt-2'>{invoice.Comission}{invoice.ComissionType}</p></td>
                                        <td className='!text-center '><p className='!mb-0 !mt-2'>{invoice.Developer} Developer {invoice.othrDeveloper}</p></td>
                                        <td className='!text-center '><p className='!mb-0 !mt-2'>{invoice.buyername}</p></td>
                                     </tr>
                            </tbody>
                        </table>
            </div>
        </div>
    );
};

export default ViewModal;
