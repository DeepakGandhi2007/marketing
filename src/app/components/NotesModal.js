import React, { useEffect, useState } from 'react';
import styles from '../Modal.module.css';
import axios from 'axios';
import SearchableSelect from '../Leads/dropdown';
import 'bootstrap/dist/css/bootstrap.css';
const NotesModal = ({ onClose, lead }) => {



    const [Notes, setNotes] = React.useState({
        Comment: "",
        Leadid: lead,


    })

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post("/api/notes/add", Notes);
            console.log("Notes add success", response.data);

        }
        catch (error) {
            console.log(error);

        } finally {
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
                <h4>{loading ? "processing" : "Add Notes"}</h4>
                <div className="card-body mt-4">


                    <div className="mb-4 text-left">
                        <input className="form-control" onChange={(e) => setNotes({ ...Notes, Comment: e.target.value })} type="text" placeholder="Notes Description" />

                    </div>

                    <div className="mb-4">
                        <button className='btn btn-primary w-100' onClick={onSubmit}>Submit</button>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default NotesModal;
