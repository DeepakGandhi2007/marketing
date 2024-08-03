"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import RootLayout from '@/app/components/layout';
import ScrollableTabsButtonForce from '@/app/components/Tabs';

const LeadDetails = ({ params }) => {
    const id = params?.id;
    const [lead, setLead] = useState(null);
    const [activityLog, setactivityLog] = useState(null);

    useEffect(() => {
        const fetchLead = async () => {
            try {

                const response = await axios.get(`/api/Lead/${id}`);
                setLead(response.data.data);

            } catch (error) {
                console.error('Error fetching lead:', error);
            }
        };

        fetchLead();
    }, [id]);

    useEffect(() => {
        const fetchLog = async () => {
            try {

                const response = await axios.get(`/api/log/${id}`);
                setactivityLog(response.data.data);

            } catch (error) {
                console.error('Error fetching Log:', error);
            }
        };

        fetchLog();
    }, [id]);


    if (!lead) {
        return <div>Loading...</div>;
    }

    return (
        <RootLayout>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='lead-header bg-white p-3 border-bottom'>
                            <h3 className='text-center font-size-24 text-uppercase'>{lead.Name}</h3>
                        </div>
                        <div className='lead-header bg-white p-3'>
                            <div className="top-lead-menu">
                                <ScrollableTabsButtonForce lead={lead} activityLog={activityLog} />
                            </div>


                        </div>

                    </div>
                </div>
            </div>

        </RootLayout>
    );
};

export default LeadDetails;
