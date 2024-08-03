import React, { useState,useEffect  } from 'react';
import styles from '../Modal.module.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { useDropzone } from 'react-dropzone';
import Papa from "papaparse";
import { useRouter } from 'next/navigation'
import ParsedDataTable from '../excel/page';
import { ToastContainer, toast } from 'react-toastify';
import SearchableSelect from './dropdown';
import 'react-toastify/dist/ReactToastify.css';
const Excelmodal = ({ onClose, onParse }) => {
    const router = useRouter()
    const [StatusCount, setStatusCount] = useState([]);
    const [options1, setoptions1] = useState([]);
    const [SourceCount, setSourceCount] = useState([]);
    const [options2, setoptions2] = useState([]);
    const [excel, setexcel] = useState({
        file: null,
        data: null,
        LeadStatus: "",
        Source: ""
    });

    const { getRootProps, getInputProps } = useDropzone({
        accept: '.csv',
        onDrop: acceptedFiles => {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = () => {
                const fileContent = reader.result; // Read the file content
                setexcel(prevData => ({
                    ...prevData,
                    file: fileContent, // Set the file content to the 'file' property
                }));
            };
            reader.readAsDataURL(file);
        }
    });

    const parseCSV = () => {
        if (!excel.file) {
            console.error('No file selected');
            return;
        }
        const csvData = excel.file.split(',')[1]; // Get the base64-encoded CSV data
        const decodedData = atob(csvData); // Decode base64 to CSV string
        const parsedData = Papa.parse(decodedData, { header: true }).data; // Parse CSV data
        setexcel(prevData => ({
            ...prevData,
            data: parsedData,
        }));

        onParse(parsedData); // Pass parsed data to parent component
        onClose(); // Close the modal
    };

    const handleSubmit = async () => {
        try {
            if (!excel.file) {
                console.error('No file selected');
                return;
            }

            const imageData = excel.file.split(',')[1];
            const response = await axios.post('api/Lead/excel', {
                ...excel,
                file: imageData,
            });
            toast.success('Excel Upload successful');
            console.log(response.data);
            onClose();
        } catch (error) {
            toast.error('Error uploading files');
            console.error('Error uploading file:', error);
            // Handle error (e.g., show an error message)
        }
    };

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                let url = `/api/Status/get`;
                const response = await axios.get(url);
                setStatusCount(response.data.data);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        };

        fetchStatus();

    }, []);
    
    
    
    useEffect(() => {
        const newOptions1 = StatusCount.map(StatusCount => ({
            value: StatusCount._id,
            label: StatusCount.Status,
        }));
        setoptions1(newOptions1);
    }, [StatusCount]);


     useEffect(() => {
        const fetchSource = async () => {
            try {
                let url = `/api/Source/get`;
                const response = await axios.get(url);
                setSourceCount(response.data.data);
            } catch (error) {
                console.error('Error fetching Source:', error);
            }
        };

        fetchSource();

    }, []);
    
    
    
    
   useEffect(() => {
        const newOptions2 = SourceCount.map(SourceCount => ({
            value: SourceCount._id,
            label: SourceCount.Source,
        }));
        setoptions2(newOptions2);
    }, [SourceCount]);
    
    
    const handleSelectChange = (property, selectedOption) => {
        setexcel(prevLeads => ({
            ...prevLeads,
            [property]: selectedOption.value
        }));
    };




    return (
        <div className={styles.modalBackdrop}>
            <ToastContainer />

            <div className={styles.modalContent}>
                <span className={styles.closeButton} onClick={onClose}>
                    &times;
                </span>
                <h4>Upload CSV File</h4>
                <div className="card-body mt-4">

                    <div>
                        <div className='d-flex'>
                            <div className='mb-4'>

                                <SearchableSelect className="position-relative" options={options1} onChange={(selectedOption) => handleSelectChange('LeadStatus', selectedOption)} placeholder="Status..." />

                            </div>
                            <div className='mb-4'>

                                <SearchableSelect className="position-relative" options={options2} onChange={(selectedOption) => handleSelectChange('Source', selectedOption)} placeholder="Source..." />

                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="input-group" {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className="form-control">
                                    Drag 'n' drop a CSV file here, or click to select file
                                </div>
                            </div>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <div className="mb-4">
                                <button className="btn btn-primary w-100" onClick={handleSubmit}>
                                    Submit
                                </button>
                            </div>
                            <div className="mb-4">
                                <button className="btn btn-primary w-100" onClick={parseCSV}>
                                    Simulate Data
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Excelmodal;
