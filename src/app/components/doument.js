import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styles from '../Modal.module.css';
import axios from 'axios';
import SearchableSelect from '../Leads/dropdown';
import 'bootstrap/dist/css/bootstrap.css';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const DocumentModal = ({isOpen, onClose, savedUser }) => {
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setSelectedFiles([...selectedFiles, ...acceptedFiles]);
        }
    });

    const handleRemoveFile = (index) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
    };
    const handleUpload = async () => {
        try {
            setLoading(true);
            const promises = selectedFiles.map(async (file) => {
                const base64String = await fileToBase64(file);
                return { filename: file.name, data: base64String };
            });

            const fileContents = await Promise.all(promises);
            const response = await axios.post('/api/staff/document', { files: fileContents, userid: savedUser });
            setSelectedFiles([]);
            toast.success('Upload successful');
               setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            toast.error('Error uploading files');

        } finally {
            setLoading(false);
            
            
        }
    };
   
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    };



    return (
            <div>

       {isOpen && (
        <div className={styles.modalBackdrop}>
            <ToastContainer />
            <div className={styles.modalContent}>
                <span className={styles.closeButton} onClick={onClose}>
                    &times;
                </span>
                <p>{loading ? "processing" : "Add Documents "}</p>
                <div className="card-body mt-4">
                    <div>
                        <div className="mb-4">
                            <div className="input-group" {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className="form-control">Passport (Front & Back), Visa , Emirate Id, Passport Size Photo, Attested Degree Certificate, Others</div>
                            </div>
                        </div>
                        {selectedFiles.length > 0 && (
                            <div className="mb-4">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="d-flex align-items-center justify-content-between">
                                        <span>{file.name}</span>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleRemoveFile(index)}>Remove</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mb-4">
                            <button className='btn btn-primary w-100' onClick={handleUpload} disabled={loading || selectedFiles.length === 0}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
          )}
           </div>
    );
};

export default DocumentModal;