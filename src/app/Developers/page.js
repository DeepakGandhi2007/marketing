"use client";
import axios from 'axios';
import RootLayout from '../components/layout';
import React, { useState, useEffect } from 'react';

function Developers() {
    const [invoice, setinvoice] = useState([]);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                let url = `/api/invoice/get`;
                const response = await axios.get(url);
                setinvoice(response.data.data);

            } catch (error) {
                console.error('Error fetching leads:', error);
            }
        };

        fetchLead();

    }, []);
    const totalInvoiceValue = invoice.reduce((total, item) => total + parseFloat(item.Price), 0);
    console.log(totalInvoiceValue);
    const groupedInvoices = invoice.reduce((groups, invoice) => {
        const { Developername, Price } = invoice;
        if (!groups[Developername]) {
            groups[Developername] = { Developername, totalValue: 0, invoices: [] };
        }
        groups[Developername].invoices.push(invoice);
        groups[Developername].totalValue += parseFloat(Price);
        return groups;
    }, {});


    return (
        <RootLayout>

            <div className='container-fluid'>
                <div className='row'>
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Staff Members</h4>

                                <div
                                    id="datatable_wrapper"
                                    className="dataTables_wrapper dt-bootstrap4 no-footer"
                                >

                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="table-responsive">
                                                <table className="table mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Developer </th>
                                                            <th>Project </th>
                                                            <th>Number of units </th>
                                                            <th>Value</th>
                                                            <th>Company revenue</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.values(groupedInvoices).map((group, index) => (
                                                            <React.Fragment key={index}>
                                                                <tr>
                                                                    <td colSpan="6" style={{ fontWeight: 'bold' }}>{group.Developername}</td>
                                                                </tr>
                                                                {group.invoices.map((item, subIndex) => (
                                                                    <tr key={subIndex}>
                                                                        <td>{subIndex + 1}</td>
                                                                        <td>{item.Developername}</td>
                                                                        <td>{item.Property}</td>
                                                                        <td>{item.unitNumber}</td>
                                                                        <td>{item.Price}</td>
                                                                        <td>{((item.Price / group.totalValue) * 100).toFixed(2)}%</td>
                                                                    </tr>
                                                                ))}
                                                            </React.Fragment>
                                                        ))}

                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>


            </div>


        </RootLayout >


    )
}

export default Developers
