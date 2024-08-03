import React, { useEffect, useState } from 'react';
import styles from '../Modal.module.css';
import axios from 'axios';
import SearchableSelect from '../Leads/dropdown';
import 'bootstrap/dist/css/bootstrap.css';
import { ToastContainer, toast } from 'react-toastify';

const ReminderModal = ({ onClose, lead }) => {

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
    useEffect(() => {
        const newOptions = users.map(user => ({
            value: user._id,
            label: user.username,
        }));
        setOptions4(newOptions);
    }, [users]);

    const [Reminder, setReminder] = React.useState({
        DateTime: "",
        Assignees: "",
        Leadid: lead,
        Comment: "",

    })

    const handleSelectChange = (Reminder, selectedOption) => {
        setReminder(prevReminder => ({
            ...prevReminder,
            [Reminder]: selectedOption.value
        }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post("/api/Reminder/add", Reminder);
            console.log("Reminder add success", response.data);

        }
        catch (error) {
            console.log(error);

        } finally {
             toast.success('Reminder Added successful');
               setTimeout(() => {
                onClose();
            }, 2000);
            onClose()
            setLoading(false);
        }

    }

    const [loading, setLoading] = React.useState(false);

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <span className={styles.closeButton} onClick={onClose}>
                    &times;
                </span>
                <h4>{loading ? "processing" : "Add Reminder"}</h4>
                <div className="card-body mt-4">

                    <div className="mb-4 text-left">
                        <input className="form-control" type="datetime-local" onChange={(e) => setReminder({ ...Reminder, DateTime: e.target.value })} id="example-datetime-local-input" />
                    </div>

                    <div className="mb-4 text-left">
                        <SearchableSelect options={options4} onChange={(selectedOption) => handleSelectChange('Assignees', selectedOption)} placeholder="Assignees..." />

                    </div>

                    <div className="mb-4 text-left">
                        <input className="form-control" onChange={(e) => setReminder({ ...Reminder, Comment: e.target.value })} type="text" placeholder="Reminder Description" />

                    </div>

                    <div className="mb-4">
                        <button className='btn btn-primary w-100' onClick={onSubmit}>Submit</button>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default ReminderModal;
