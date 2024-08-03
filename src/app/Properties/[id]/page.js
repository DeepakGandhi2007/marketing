"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

const LeadDetails = ({ params }) => {
    const id = params.id;
    const [lead, setLead] = useState(null);

    useEffect(() => {
        const fetchLead = async () => {
            try {

                const response = await axios.get(`/api/Lead/${id}`);
                console.log(response.data);
                setLead(response.data.data);

            } catch (error) {
                console.error('Error fetching lead:', error);
            }
        };

        fetchLead();
    }, [id]);

    if (!lead) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{lead.Name}</h1>
            <p>Phone: {lead.Phone}</p>
            <p>Email: {lead.Email}</p>
            {/* Display other lead details */}
        </div>
    );
};

export default LeadDetails;
