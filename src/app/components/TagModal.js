import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styles from '../Modal.module.css';
import axios from 'axios';
import SearchableSelect from '../Leads/dropdown';
import 'bootstrap/dist/css/bootstrap.css';
import { useDropzone } from 'react-dropzone';

const TagMOdal = ({ onClose }) => {

    const [loading, setLoading] = useState(false);

    const [Tags, setTags] = React.useState({
        Tags: "",
    })
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post("/api/tags/add", Tags);
            console.log("Tags add success", response.data);

        }
        catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }

    }

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <span className={styles.closeButton} onClick={onClose}>
                    &times;
                </span>
                <h4>{loading ? "processing" : "Add Tags"}</h4>
                <div className="card-body mt-4">
                    <div>
                        <div className="mb-4">
                            <input className='form-control' onChange={(e) => setTags({ ...Tags, Tags: e.target.value })} type='text' placeholder='Tag Name' />
                        </div>

                        <div className="mb-4">
                            <button className='btn btn-primary w-100' onClick={onSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TagMOdal;