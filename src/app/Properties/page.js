"use client";
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import RootLayout from '../components/layout';
import Modal from '../components/modal';
import PropertyModal from '../components/PropertyModal';

function Property() {
    const [properties, setProperties] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);

    const togglePropertyModal = (propertyId) => {
        const selected = properties.find(property => property._id === propertyId);
        setSelectedProperty(selected);
        toggleModal();
    };

    useEffect(() => {
        axios.get("/api/Property/get")
            .then(response => {
                setProperties(response.data.data);
            })
            .catch(error => {
                console.error("Error fetching properties:", error);
            });
    }, []);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const deleteProperty = (propertyId) => {
        axios.delete(`/api/Property/delete/${propertyId}`)
            .then(response => {
                setProperties(properties.filter(property => property._id !== propertyId));
            })
            .catch(error => {
                console.error("Error deleting property:", error);
            });
    };

    return (
        <RootLayout>
            {isModalOpen && <PropertyModal propertyId={selectedProperty} onClose={toggleModal} />}
            <div className='container-fluid'>
                <div className='row'>
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Properties</h4>

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
                                                            <th>Project</th>
                                                            <th>Developer</th>
                                                            <th>Location</th>
                                                            <th>Rate</th>
                                                            <th>Type</th>
                                                            <th>Bedroom</th>
                                                            <th>Bathroom</th>
                                                            <th>Area</th>
                                                            <th>Catalog</th>
                                                            <th>Agent</th>
                                                            <th>Action</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(properties) && properties.map((property, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{property.Project}</td>
                                                                <td>{property.Developer}</td>
                                                                <td>{property.Location}</td>
                                                                <td>{property.Rate}</td>
                                                                <td>{property.Type}</td>
                                                                <td>{property.Bedroom}</td>
                                                                <td>{property.Bathroom}</td>
                                                                <td>{property.Area}</td>
                                                                <td>{property.Catalog}</td>
                                                                <td>{property.Agent}</td>
                                                                <td>
                                                                    <div className='d-flex'>
                                                                        <div>
                                                                            <i className='fa fa-trash' onClick={() => deleteProperty(property._id)}></i>
                                                                        </div>
                                                                        <div className='px-2'>
                                                                            <i className='fa fa-edit' onClick={() => togglePropertyModal(property._id)}></i>
                                                                        </div>
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
                            </div>
                        </div>
                    </div>

                </div>
                <Link
                    href="Properties/Add"
                    className="float"
                >
                    <i className="fa fa-plus my-float" />
                </Link>

            </div>


        </RootLayout>


    )
}

export default Property
