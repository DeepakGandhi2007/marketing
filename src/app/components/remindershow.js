import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styles from '../Modal.module.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Remindershowmodal = ({ onClose, lead }) => {
    const [Reminders, setReminders] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/Reminder/get/${lead}`);
                console.log(response);
                setReminders(response.data.data);
            } catch (error) {
                console.error('Error fetching meetings:', error);
            }
        };

        fetchData();

    }, [lead]);

    return (

        <div className={styles.modalBackdrop}>
            <ToastContainer />
            <div className={styles.modalContent}>
                <h4>Reminder</h4>
                <span className={styles.closeButton} onClick={onClose}>
                    &times;
                </span>
                <div className="card-body mt-4">
                    <div>
                        <div className='bg-light-grey mt-2'>
                            {Reminders.map(Reminders => (
                                <p key={Reminders._id}>Reminder {Reminders.Comment} Assigned to {Reminders.Assignees.username} Date and time  {Reminders.DateTime}</p>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Remindershowmodal;