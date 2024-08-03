import React, { useEffect, useState } from 'react';
import styles from '../Modal.module.css';
import axios from 'axios';
import SearchableSelect from '../Leads/dropdown';
import 'bootstrap/dist/css/bootstrap.css';
import { ToastContainer, toast } from 'react-toastify';

const MeetingModal = ({ onClose, lead }) => {
    console.log(lead);
    const [users, setUsers] = useState([]);
    const [options4, setOptions4] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/staff/get');
                setUsers(response.data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const options1 = [
        { value: 'Low', label: 'Low' },
        { value: 'Medium', label: 'Medium' },
        { value: 'High', label: 'High' },
        { value: 'Urgent', label: 'Urgent' },
    ];

    const options6 = [
        { value: 'Meeting Scheduled', label: 'Meeting Scheduled' },
        { value: 'Meeting Completed', label: 'Meeting Completed' },
        { value: 'Meeting Cancelled', label: 'Meeting Cancelled' },
    ];

    const options7 = [
        { value: 'Primary', label: 'Primary' },
        { value: 'Secondary', label: 'Secondary' },
    ];

    const options8 = [
        { value: 'Direct', label: 'Direct' },
        { value: 'Agent', label: 'Agent' },
    ];

    useEffect(() => {
        const newOptions = users.map(user => ({
            value: user._id,
            label: user.username,
        }));
        setOptions4(newOptions);
    }, [users]);

    const [Meeting, setMeeting] = useState({
        Subject: "",
        MeetingDate: "",
        Priority: "",
        Lead: lead,
        Assignees: "",
        Followers: "",
        Status: "",
        Comment: "",
        MeetingType: "",
        directoragnet: "",
        agentName: "",
        agentPhone: "",
        agentCompany: "",
        Developer: "",
        Location: ""
    });

    const handleSelectChange = (field, selectedOption) => {
        setMeeting(prevMeeting => ({
            ...prevMeeting,
            [field]: selectedOption.value
        }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post("/api/Meeting/add", Meeting);
        }
        catch (error) {
            console.log(error);
        } finally {
            
            toast.success('Meeting Added successful');
               setTimeout(() => {
                onClose();
            }, 2000);
            onClose()
            setLoading(false);
        }
    };

    const [loading, setLoading] = useState(false);

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <span className={styles.closeButton} onClick={onClose}>
                    &times;
                </span>
                <h4>{loading ? "processing" : "Add Meeting"}</h4>
                <div className="card-body mt-4">
                    <div>
                        <div className="mb-4 text-left">
                            <input className="form-control" id='subject' onChange={(e) => setMeeting({ ...Meeting, Subject: e.target.value })} type="text" placeholder="Subject" />
                        </div>
                        <div className="mb-4 text-left">
                            <input className="form-control" onChange={(e) => setMeeting({ ...Meeting, MeetingDate: e.target.value })} type="date" placeholder="Meeting Date" />
                        </div>
                        <div className="mb-4 text-left">
                            <SearchableSelect options={options1} onChange={(selectedOption) => handleSelectChange('Priority', selectedOption)} placeholder="Priority..." />
                        </div>
                    </div>
                    <div className="mb-4 text-left">
                        <SearchableSelect options={options7} onChange={(selectedOption) => handleSelectChange('MeetingType', selectedOption)} placeholder="Meeting Type..." />
                    </div>
                    {Meeting.MeetingType === 'Secondary' && (
                        <div className="mb-4 text-left">
                            <SearchableSelect options={options8} onChange={(selectedOption) => handleSelectChange('directoragnet', selectedOption)} placeholder="Direct Or Agent To Agent..." />
                        </div>
                    )}
                    {Meeting.directoragnet === 'Agent' && (
                        <>
                            <div className="mb-4 text-left">
                                <input className="form-control" onChange={(e) => setMeeting({ ...Meeting, agentName: e.target.value })} type="text" placeholder="Agent Name" />
                            </div>
                            <div className="mb-4 text-left">
                                <input className="form-control" onChange={(e) => setMeeting({ ...Meeting, agentPhone: e.target.value })} type="text" placeholder="Agent Phone" />
                            </div>
                            <div className="mb-4 text-left">
                                <input className="form-control" onChange={(e) => setMeeting({ ...Meeting, agentCompany: e.target.value })} type="text" placeholder="Agent Company" />
                            </div>
                        </>
                    )}
                    {Meeting.MeetingType === 'Primary' && (
                        <>
                            <div className="mb-4 text-left">
                                <input className="form-control" onChange={(e) => setMeeting({ ...Meeting, Developer: e.target.value })} type="text" placeholder="Developer" />
                            </div>
                            <div className="mb-4 text-left">
                                <input className="form-control" onChange={(e) => setMeeting({ ...Meeting, Location: e.target.value })} type="text" placeholder="Location" />
                            </div>
                        </>
                    )}

                    <div className="mb-4 text-left">
                        <SearchableSelect options={options4} onChange={(selectedOption) => handleSelectChange('Followers', selectedOption)} placeholder="Follower..." />
                    </div>
                    <div className="mb-4 text-left">
                        <SearchableSelect options={options6} onChange={(selectedOption) => handleSelectChange('Status', selectedOption)} placeholder="Status..." />
                    </div>
                    <div className="mb-4 text-left">
                        <input className="form-control" onChange={(e) => setMeeting({ ...Meeting, Comment: e.target.value })} type="text" placeholder="Meeting Comment" />
                    </div>
                    <div className="mb-4">
                        <button className='btn btn-primary w-100' onClick={onSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeetingModal;
