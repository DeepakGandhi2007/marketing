"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchableSelect from '../dropdown';
import 'bootstrap/dist/css/bootstrap.css';
import RootLayout from '@/app/components/layout';

function Add() {
    const options1 = [
        { value: 'Primary', label: 'Primary' },
        { value: 'Secondary', label: 'Secondary' },
    ];

    const [Property, setProperty] = React.useState({
        Project: "",
        Developer: "",
        Location: "",
        Rate: "",
        Type: "",
        Bedroom: "",
        Bathroom: "",
        Area: "",
        Handover: "",
        Description: "",
        lDescription: "",
        Catalog: "",
        Agent: "",
    })
    const [buttonDisabled, SetButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post("/api/Property/add", Property);
            console.log("Property add success", response.data);

        }
        catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }

    }
    const handleSelectChange = (property, selectedOption) => {
        setProperty(prevProperty => ({
            ...prevProperty,
            [property]: selectedOption.value
        }));
    };
    return (
        <RootLayout>
            <div>

                <div className="card-body mt-4">
                    <div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Property.Project}
                                onChange={(e) => setProperty({ ...Property, Project: e.target.value })}
                                placeholder="Project" />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Property.Developer}
                                onChange={(e) => setProperty({ ...Property, Developer: e.target.value })} placeholder="Developer" />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="tel" value={Property.Location}
                                onChange={(e) => setProperty({ ...Property, Location: e.target.value })} placeholder="Location" />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="tel" value={Property.Rate}
                                onChange={(e) => setProperty({ ...Property, Rate: e.target.value })} placeholder="Rate - AED (Base Currency)" />
                        </div>
                        <div className="mb-4">
                            <   SearchableSelect options={options1} onChange={(selectedOption) => handleSelectChange('Type', selectedOption)} placeholder="Type..." />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="email" value={Property.Bedroom}
                                onChange={(e) => setProperty({ ...Property, Bedroom: e.target.value })} placeholder="Bedroom" />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Property.Bathroom}
                                onChange={(e) => setProperty({ ...Property, Bathroom: e.target.value })} placeholder="Bathroom" />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Property.Area}
                                onChange={(e) => setProperty({ ...Property, Area: e.target.value })} placeholder="Area (Sqft)" />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Property.Handover}
                                onChange={(e) => setProperty({ ...Property, Handover: e.target.value })} placeholder="Handover" />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Property.Description}
                                onChange={(e) => setProperty({ ...Property, Description: e.target.value })} placeholder="Description" />
                        </div>

                        <div className="mb-4">
                            <input className="form-control" type="text" value={Property.lDescription}
                                onChange={(e) => setProperty({ ...Property, lDescription: e.target.value })} placeholder="Long Description" />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Property.Catalog}
                                onChange={(e) => setProperty({ ...Property, Catalog: e.target.value })} placeholder="Catalog link" />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Property.Agent}
                                onChange={(e) => setProperty({ ...Property, Agent: e.target.value })} placeholder="Agent" />
                        </div>

                        <div className="mb-4">
                            <button className='btn btn-primary w-100' onClick={onSubmit}
                            >Submit</button>
                        </div>
                    </div>
                </div>

            </div>
        </RootLayout>
    );
};

export default Add;
