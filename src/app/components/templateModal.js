import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import TextEditor from '../components/editor'; // Update the path as per your actual file structure
import styles from '../Modal.module.css';

const TemplateModal = ({ onClose,userdata }) => {
    const [loading, setLoading] = useState(false);
    const [TemplateData, setTemplateData] = useState('');

      const handleEditorChange = (value) => {
        setTemplateData(value);
      };

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post("/api/whatsapp/add", { TemplateData });
            toast.success('Template add successful');
        } catch (error) {
            console.error('Error adding template:', error);
            toast.error('Failed to add template');
        } finally {
            setLoading(false);
        }
    };
     useEffect(() => {
        if (userdata) {
            setTemplateData({
                TemplateData: userdata.Template || '',
            });
        }
    }, [userdata]);
    
    
    console.log(TemplateData)
    
     const handleUpdate = async () => {
        try {
            setLoading(true);
            const response = await axios.put(`/api/whatsapp/update/${userdata._id}`, {TemplateData});
            setShowModal(false);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };
    console.log(userdata, 'sadfasdfasdfasdfasdfasdfdsf')
    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <span className={styles.closeButton} onClick={onClose}>
                    &times;
                </span>
                <h4>{loading ? "Processing" : "Add Whatsapp Template"}</h4>
                <div className="card-body mt-4">
                    <div>
                        <div className="mb-4">
                            <TextEditor defaultValue={userdata?.Template ? userdata?.Template : ''} onChange={handleEditorChange}/>
                        </div>

                        <div className="mb-4">
                         {userdata ? (
                                                <button className='btn btn-primary w-100' onClick={handleUpdate}>Submit</button>
                                            ) : (
                                                <button className='btn btn-primary w-100' onClick={onSubmit}>Submit</button>
                                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateModal;
