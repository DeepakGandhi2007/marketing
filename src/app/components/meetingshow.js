import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styles from '../Modal.module.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Meetingshowmodal = ({ onClose, lead }) => {
    const [Meeting, setMeetings] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/Meeting/get/${lead}`);
                setMeetings(response.data.data);
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
                <h4>Meeting</h4>
                <span className={styles.closeButton} onClick={onClose}>
                    &times;
                </span>
                <div className="card-body mt-4">
                    <div>
                        <div className='bg-light-grey mt-2'>
                            {Meeting.map(Meeting => (
                                <p key={Meeting._id}>Subject {Meeting.Subject} With Developer  {Meeting.Developer} On Date {Meeting.MeetingDate}</p>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Meetingshowmodal;