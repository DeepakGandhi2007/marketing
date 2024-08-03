"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import RootLayout from '@/app/components/layout';
import SearchableSelect from '../../dropdown';


const LeadDetails = ({ params }) => {

    const id = params.editype;
    const [Leads, setLead] = useState(null);
    const [statusesArray, setStatusesArray] = useState([null]);
    const [assignedToArray, setAssignedToArray] = useState([null]);
    const [selectedStatus, setSelectedStatus] = useState([null]);
    const [selectedCountry, setselectedCountry] = useState([null]);
    const router = useRouter();

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await axios.get(`/api/Lead/${id}`);
                setLead(response.data.data);
                setSelectedStatus(response.data.data?.LeadStatus || '');
                setAssignedToArray(response.data.data?.Assigned || '');
                setselectedCountry(response.data.data?.Country || '');

            } catch (error) {
                console.error('Error fetching lead:', error);
            }
        };

        fetchLead();
    }, [id]);
    console.log(Leads);

    const updateLead = async () => {
        try {
            const response = await axios.put(`/api/Lead/update/${id}`, Leads);
            router.push('/Leads');
            setLead(response.data.data);
        } catch (error) {
            console.error('Error updating lead:', error);
        }
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        setLead((prevLeads) => ({
            ...prevLeads,
            LeadStatus: e.target.value,
        }));
    };
    const handleAssigneChange = (e) => {
        setAssignedToArray(e.target.value);
        setLead((prevLeads) => ({
            ...prevLeads,
            Assigned: e.target.value,
        }));
    };
    const handleCountryChange = (e) => {
        setselectedCountry(e.target.value);
        setLead((prevLeads) => ({
            ...prevLeads,
            Country: e.target.value,
        }));
    };

    if (Leads === null) {
        return <div>Loading...</div>;
    }

    if (!Leads) {
        return <div>No data available</div>;
    }


    return (
        <RootLayout>
            <div>

                <div className="card-body mt-4">
                    <div>
                        <div className="mb-4">
                            <select
                                className="form-control"
                                id="leadStatus"
                                value={selectedStatus}
                                onChange={handleStatusChange}
                            >
                                <option value={selectedStatus}>{selectedStatus}</option>
                                <option value="Option 1">Option 1</option>
                                <option value="Option 2">Option 2</option>
                                <option value="Option 3">Option 3</option>
                                <option value="Option 4">Option 4</option>
                                <option value="Option 5">Option 5</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <select
                                className="form-control"
                                id="leadStatus"
                                value={assignedToArray}
                                onChange={handleAssigneChange}
                            >
                                <option value={assignedToArray}>{assignedToArray}</option>
                                <option value="Option 1">Option 1</option>
                                <option value="Option 2">Option 2</option>
                                <option value="Option 3">Option 3</option>
                                <option value="Option 4">Option 4</option>
                                <option value="Option 5">Option 5</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Leads.typeprop}
                                placeholder="Property Type" onChange={(e) => {
                                    setLead((prevLeads) => ({
                                        ...prevLeads,
                                        typeprop: e.target.value,
                                    }));
                                }} disabled />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Leads.Source}
                                placeholder="Source" onChange={(e) => {
                                    setLead((prevLeads) => ({
                                        ...prevLeads,
                                        Source: e.target.value,
                                    }));
                                }} disabled />
                        </div>


                        <div className="mb-4">
                            <input className="form-control" type="text" value={Leads.Name}
                                placeholder="Name" onChange={(e) => {
                                    setLead((prevLeads) => ({
                                        ...prevLeads,
                                        Name: e.target.value,
                                    }));
                                }} />
                        </div>

                        <div className="mb-4">
                            <input className="form-control" type="tel" value={Leads.Phone}
                                placeholder="Phone" onChange={(e) => {
                                    setLead((prevLeads) => ({
                                        ...prevLeads,
                                        Phone: e.target.value,
                                    }));
                                }} />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="tel" value={Leads.AltPhone}
                                placeholder="Alt Phone" onChange={(e) => {
                                    setLead((prevLeads) => ({
                                        ...prevLeads,
                                        AltPhone: e.target.value,
                                    }));
                                }} />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Leads.Address}
                                placeholder="Address" onChange={(e) => {
                                    setLead((prevLeads) => ({
                                        ...prevLeads,
                                        Address: e.target.value,
                                    }));
                                }} />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="email" value={Leads.Email}
                                placeholder="Email address" onChange={(e) => {
                                    setLead((prevLeads) => ({
                                        ...prevLeads,
                                        Email: e.target.value,
                                    }));
                                }} />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Leads.City}
                                placeholder="City" onChange={(e) => {
                                    setLead((prevLeads) => ({
                                        ...prevLeads,
                                        City: e.target.value,
                                    }));
                                }} />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Leads.Project}
                                placeholder="Project" onChange={(e) => {
                                    setLead((prevLeads) => ({
                                        ...prevLeads,
                                        Project: e.target.value,
                                    }));
                                }} />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Leads.State}
                                placeholder="State" onChange={(e) => {
                                    setLead((prevLeads) => ({
                                        ...prevLeads,
                                        State: e.target.value,
                                    }));
                                }} />
                        </div>
                        <div className="mb-4">
                            <select
                                className="form-control"
                                id="leadStatus"
                                value={selectedCountry}
                                onChange={handleCountryChange}
                            >
                                <option value={selectedCountry}>{selectedCountry}</option>
                                <option value="Option 1">Option 1</option>
                                <option value="Option 2">Option 2</option>
                                <option value="Option 3">Option 3</option>
                                <option value="Option 4">Option 4</option>
                                <option value="Option 5">Option 5</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="number" value={Leads.Budget}
                                placeholder="Budget/Investment Value" onChange={(e) => {
                                    setLead((prevLeads) => ({
                                        ...prevLeads,
                                        Budget: e.target.value,
                                    }));
                                }} />
                        </div>
                        <div className="mb-4">

                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Leads.Location}
                                placeholder="Prefered Location" onChange={(e) => {
                                    setLead((prevLeads) => ({
                                        ...prevLeads,
                                        Prefered: e.target.value,
                                    }));
                                }} />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Leads.ZipCode}
                                placeholder="Zip Code" onChange={(e) => {
                                    setLead((prevLeads) => ({
                                        ...prevLeads,
                                        Zip: e.target.value,
                                    }));
                                }} />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Leads.Priority}
                                placeholder="Priority" onChange={(e) => {
                                    setLead((prevLeads) => ({
                                        ...prevLeads,
                                        Priority: e.target.value,
                                    }));
                                }} />
                        </div>
                        <div className="mb-4">
                            <input className="form-control" type="text" value={Leads.Type}
                                placeholder="Type" onChange={(e) => {
                                    setLead((prevLeads) => ({
                                        ...prevLeads,
                                        Type: e.target.value,
                                    }));
                                }} />
                        </div>
                        <div className="mb-4">
                            <textarea required="" className="form-control" value={Leads.Description}
                                rows="5" onChange={(e) => {
                                    setLead((prevLeads) => ({
                                        ...prevLeads,
                                        Description: e.target.value,
                                    }));
                                }}></textarea>
                        </div>

                        <div className="mb-4">
                            <button onClick={updateLead} className='btn btn-primary w-100'
                            ></button>
                        </div>
                    </div>
                </div>

            </div>
        </RootLayout>
    );
};

export default LeadDetails;
