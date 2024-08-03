"use client";
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import RootLayout from '../components/layout';


function Leads() {
    const [Leads, setLead] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [leadsPerPage] = useState(1);
    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await axios.get('/api/Lead/get');
                console.log(response);
                setLead(response.data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const intervalId = setInterval(fetchLead, 2000);

        fetchLead();

        return () => clearInterval(intervalId);
    }, []);


    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/Lead/delete/${id}`);
        } catch (error) {
            console.error('Error deleting lead:', error);
        }
    };

    const currentLeadIndex = currentPage - 1;
    const currentLead = Leads[currentLeadIndex]; // Calculate the current lead based on currentPage

    // Change page
    const nextPage = () => {
        if (currentPage < Leads.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    return (
        <RootLayout>

            <div className='container-fluid'>
                <div className='row'>
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Leads</h4>

                                <div
                                    id="datatable_wrapper"
                                    className="dataTables_wrapper dt-bootstrap4 no-footer"
                                >
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="dataTables_length" id="datatable_length">
                                                <label>
                                                    Show{" "}
                                                    <select
                                                        name="datatable_length"
                                                        aria-controls="datatable"
                                                        className="custom-select custom-select-sm form-control form-control-sm form-select form-select-sm"
                                                    >
                                                        <option value={10}>10</option>
                                                        <option value={25}>25</option>
                                                        <option value={50}>50</option>
                                                        <option value={100}>100</option>
                                                    </select>{" "}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div id="datatable_filter" className="dataTables_filter">
                                                <div className="search-box me-2">
                                                    <div className="position-relative">
                                                        <input type="text" style={{ width: 100 }} className="form-control" placeholder="Search..." />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-5">
                                        {currentLead && (
                                            <div className="col-sm-12" key={currentLead._id}>
                                                <div className="card" style={{ background: currentLead.LeadStatus === 'Not Intrested' ? "#CCCCCC" : currentLead.LeadStatus === 'Intrested' ? "#d3d3d38c" : "#FFFFFF" }}>
                                                    <div className="card-body">
                                                        <div className="d-flex">
                                                            <div className="flex-1 overflow-hidden">
                                                                <Link href={`/Leads/${currentLead._id}`}>
                                                                    <h4 className="text-truncate font-size-14 mb-2">
                                                                        {currentLead.Name}
                                                                    </h4>
                                                                </Link>
                                                                <p className="mb-0">{currentLead.Email}</p>
                                                            </div>
                                                            <div className="text-primary ml-15">
                                                                <a href={`tel:${currentLead.Phone}`}>
                                                                    <i className="ri-phone-fill font-size-24" />
                                                                </a>
                                                            </div>
                                                            <div className="text-primary ml-15">
                                                                <a href={`https://wa.me/${currentLead.Phone}?text=Your%20custom%20message%20here`}>
                                                                    <i className="ri-whatsapp-fill font-size-24" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card-body border-top py-3">
                                                        <div className="text-truncate">
                                                            <span className="badge bg-success-subtle text-success  font-size-11">
                                                                <p className="mb-0"> {currentLead.Description &&
                                                                    currentLead.Description.split(' ').splice(0, 100).join(' ')}
                                                                    {currentLead.Description &&
                                                                        currentLead.Description.split(' ').length > 100 && '...'}</p>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        )}
                                    </div>


                                    <div className="row">
                                        <div className="col-sm-12 col-md-5">
                                            <div
                                                className="dataTables_info"
                                                id="datatable_info"
                                                role="status"
                                                aria-live="polite"
                                            >
                                                Showing {currentPage * leadsPerPage - leadsPerPage + 1} to{' '}
                                                {Math.min(currentPage * leadsPerPage, Leads.length)} of {Leads.length}{' '}
                                                entries
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-7">
                                            <div
                                                className="dataTables_paginate paging_simple_numbers"
                                                id="datatable_paginate"
                                            >
                                                <ul className="pagination pagination-rounded">
                                                    <li
                                                        className={`paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''
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
                                                    {Array.from({ length: Math.ceil(Leads.length / leadsPerPage) }, (_, i) => (
                                                        <li
                                                            key={i}
                                                            className={`paginate_button page-item ${i + 1 === currentPage ? 'active' : ''
                                                                }`}
                                                        >
                                                            <a
                                                                href="#"
                                                                aria-controls="datatable"
                                                                role="link"
                                                                aria-current={i + 1 === currentPage ? 'page' : null}
                                                                data-dt-idx={i}
                                                                tabIndex={0}
                                                                className="page-link"
                                                                onClick={() => setCurrentPage(i + 1)}
                                                            >
                                                                {i + 1}
                                                            </a>
                                                        </li>
                                                    ))}
                                                    <li
                                                        className={`paginate_button page-item next ${currentPage === Math.ceil(Leads.length / leadsPerPage) ? 'disabled' : ''
                                                            }`}
                                                        id="datatable_next"
                                                    >
                                                        <a
                                                            href="#"
                                                            aria-controls="datatable"
                                                            aria-disabled={currentPage === Math.ceil(Leads.length / leadsPerPage)}
                                                            role="link"
                                                            data-dt-idx="next"
                                                            tabIndex={0}
                                                            className="page-link"
                                                            onClick={nextPage}
                                                        >
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
                    href="Leads/Add"
                    className="float"
                >
                    <i className="fa fa-plus my-float" />
                </Link>

            </div>


        </RootLayout>


    )
}

export default Leads
