"use client"
// Import the necessary components
import React, { useEffect, useState } from 'react';
import RootLayout from '@/app/components/layout';
import axios from 'axios';
import SearchableSelect from '../Leads/dropdown';
import BarChart from '../components/bar';
function Report() {
    // State variables
    const [users, setUsers] = useState([]);
    const [options, setOptions] = useState([]);
    const [options2, setOptions2] = useState([]);
    const [options3, setOptions3] = useState([]);
    const [options4, setOptions4] = useState([]);
    const [options5, setOptions5] = useState([{ value: 'all', label: 'Select All' }]);
    const [agentReport, setAgentReport] = useState('');
    const [selectedFos, setselectedFosValue] = useState(null);
    const [interestedCount, setInterestedCount] = useState(0);
    const [followUpCount, setFollowUpCount] = useState(0);
    const [notInterestedCount, setNotInterestedCount] = useState(0);
    const [qualifiedCount, setQualifiedCount] = useState(0);
    const [prospectCount, setProspectCount] = useState(0);
    const [rnrCount, setRnrCount] = useState(0);
    const [notReachableCount, setNotReachableCount] = useState(0);
    const [RSPVCount, setRSPVCount] = useState(0);
    const [showChart, setShowChart] = useState(false);
    const [date, setDate] = useState('');
    const [meetingCount, setMeetingCount] = useState(0);
    const [Todaymeeting, setTodaymeetingCount] = useState(0);
    const [Totalmeeting, setTotalmeeting] = useState(0);
    const [fosTeamReport, setFosTeamReport] = useState([]);
    const [selectedAtlName, setSelectedAtlName] = useState('');

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/staff/BussinessHead');
                setUsers(response.data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Update options when users change
    useEffect(() => {
        const newOptions = users.map(user => ({
            value: user._id,
            label: user.username,
        }));
        setOptions(newOptions);
    }, [users]);

    // Fetch PNL users when a sales head is selected
    const handleSalesHeadSelect = async (selectedOption) => {
        try {
            const response = await axios.get(`/api/staff/filter/PNL?parent=${selectedOption.value}`);
            const pnlUsers = response.data.data.map(user => ({
                value: user._id,
                label: user.username,
            }));
            setOptions2(pnlUsers);
        } catch (error) {
            console.error('Error fetching PNL users:', error);
        }
    };

    const handlePNLSelect = async (selectedOption) => {
        try {
            const response = await axios.get(`/api/staff/filter/TL?parent=${selectedOption.value}`);
            const TlUsers = response.data.data.map(user => ({
                value: user._id,
                label: user.username,
            }));
            setOptions3(TlUsers);
        } catch (error) {
            console.error('Error fetching PNL users:', error);
        }
    };
    const handleTLSelect = async (selectedOption) => {
        try {
            const response = await axios.get(`/api/staff/filter/ATL?parent=${selectedOption.value}`);
            const ATlUsers = response.data.data.map(user => ({
                value: user._id,
                label: user.username,
            }));
            setOptions4(ATlUsers);
        } catch (error) {
            console.error('Error fetching PNL users:', error);
        }
    };
    const handleATLSelect = async (selectedOption) => {
        try {
            const response = await axios.get(`/api/staff/filter/FOS?parent=${selectedOption.value}`);
            const ATLUsers = response.data.data.map(user => ({
                value: user._id,
                label: user.username,
            }));
            setOptions5([...ATLUsers, { value: 'all', label: 'Select All' }]);
            setSelectedAtlName(selectedOption.value);
        } catch (error) {
            console.error('Error fetching PNL users:', error);
        }
    };

    const handleSelectChange = (value) => {
        setselectedFosValue(value.value);
    };
    const fetchAgentReport = () => {

        let url = `/api/users/report/${selectedFos}`;
        if (date) {
            url += `?date=${date}`;
        }
        axios.get(url)
            .then(response => {
                const data = response.data.data;
                console.log(data);

                const counts = data.reduce((acc, item) => {
                    const { leadstatus } = item;
                    acc[leadstatus] = (acc[leadstatus] || 0) + 1;
                    return acc;
                }, {});

                setInterestedCount(counts['Intrested'] || 0);
                setFollowUpCount(counts['Follow up'] || 0);
                setNotInterestedCount(counts['NotIntrested'] || 0);
                setQualifiedCount(counts['Qualified'] || 0);
                setProspectCount(counts['Prospect'] || 0);
                setRnrCount(counts['RNR'] || 0);
                setRSPVCount(counts['RSPV'] || 0);
                setNotReachableCount(counts['NotReachable'] || 0);
                setAgentReport(response.data);
                setShowChart(true);
                fetchMeetingCount();
                fetchTodayMeetingCount();
                fetchTotalMeetingCount();
            })
            .catch(error => {
                console.error('Error fetching agent report:', error);
            });
    };
    const handleDateChange = (event) => {
        setDate(event.target.value);
    };
    const fetchMeetingCount = async () => {
        try {
            let url = `/api/Meeting/upcomhg/${selectedFos}`;
            if (date) {
                url += `?date=${date}`;
            }
            const response = await axios.get(url);
            const meetingCount = response.data.data.length;
            setMeetingCount(meetingCount);
        } catch (error) {
            console.error('Error fetching meeting count:', error);
        }
    };

    const fetchTodayMeetingCount = async () => {
        try {
            let url = `/api/Meeting/today/${selectedFos}`;
            if (date) {
                url += `?date=${date}`;
            }
            const response = await axios.get(url);
            const meetingCount = response.data.data.length;

            setTodaymeetingCount(meetingCount);
        } catch (error) {
            console.error('Error fetching meeting count:', error);
        }
    };
    const fetchTotalMeetingCount = async () => {
        try {
            let url = `/api/Meeting/total/${selectedFos}`;

            const response = await axios.get(url);
            const meetingCount = response.data.data.length;

            setTotalmeeting(meetingCount);
        } catch (error) {
            console.error('Error fetching meeting count:', error);
        }
    };
    const fetchData = async (url) => {
        try {
            const response = await axios.get(url);
            const data = response.data.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return []; // or handle 
        }
    };

    const fetchFosTeamReport = async () => {
        console.log(selectedAtlName);
        if (!selectedAtlName) return;

        try {
            const response = await axios.get(`/api/users/report/fos/${selectedAtlName}`);
            const fosData = response.data.data;

            const fosReports = await Promise.all(
                fosData.map(async (fos) => {
                    let fosUrl = `/api/users/report/${fos._id}`;
                    if (date) {
                        fosUrl += `?date=${date}`;
                    }

                    const fosResponse = await axios.get(fosUrl);
                    const fosCounts = fosResponse.data.data.reduce((acc, item) => {
                        const { leadstatus } = item;
                        acc[leadstatus] = (acc[leadstatus] || 0) + 1;
                        return acc;
                    }, {});

                    const [upcomingMeetingsResponse, todayMeetingsResponse, totalMeetingsResponse] = await Promise.all([
                        axios.get(`/api/Meeting/upcomhg/${fos._id}${date ? `?date=${date}` : ''}`),
                        axios.get(`/api/Meeting/today/${fos._id}${date ? `?date=${date}` : ''}`),
                        axios.get(`/api/Meeting/total/${fos._id}`)
                    ]);

                    const upcomingMeetings = upcomingMeetingsResponse.data.data.length;
                    const todayMeetings = todayMeetingsResponse.data.data.length;
                    const totalMeetings = totalMeetingsResponse.data.data.length;
                    console.log(upcomingMeetings, todayMeetings, totalMeetings)


                    return {
                        ...fos,
                        interestedCount: fosCounts['Intrested'] || 0,
                        followUpCount: fosCounts['Followup'] || 0,
                        notInterestedCount: fosCounts['NotIntrested'] || 0,
                        qualifiedCount: fosCounts['Qualified'] || 0,
                        prospectCount: fosCounts['Prospect'] || 0,
                        rnrCount: fosCounts['RNR'] || 0,
                        rspvCount: fosCounts['RSPV'] || 0,
                        notReachableCount: fosCounts['NotReachable'] || 0,
                        upcomingMeetings: upcomingMeetings,
                        totalMeetings: totalMeetings,
                        todayMeetings: todayMeetings,
                    };
                })
            );

            setFosTeamReport(fosReports);
        } catch (error) {
            console.error('Error fetching FOS team report:', error);
        }
    };


    const handleFetchTeamReport = () => {
        fetchFosTeamReport();
    };
    return (
        <RootLayout>
        
         <div className="flex justify-end w-full mt-20 !px-0">
        <div className="tablet:w-[calc(100%-100px)]  mobile:w-full h-full overflow-x-hidden">
          <div className="w-full   px-4 py-4">
            <p className="text-lg font-[500]  font-Satoshi w-full ">
              Detailed Progress Report
            </p>
            
            <div className={`grid grid-cols-5 gap-x-3 gap-y-3 `}>
                    <SearchableSelect options={options} onChange={handleSalesHeadSelect} placeholder="Business Head..." />
                    
                      <SearchableSelect options={options2} onChange={handlePNLSelect} placeholder="PNL..." />
                      
                      <SearchableSelect options={options3} onChange={handleTLSelect} placeholder="TL..." />
                      
                      <SearchableSelect options={options4} onChange={handleATLSelect} placeholder="ATL..." />
                      
                      <SearchableSelect onChange={handleSelectChange} options={options5} placeholder="FOS..." />
                      
                       <input type='date' onChange={handleDateChange} className='form-control' />
                       
                        <button className='btn btn-primary' onClick={fetchAgentReport}>Fetch Agent Report</button>
                        
                         <button className='btn btn-primary' onClick={handleFetchTeamReport}>Fetch Team Report</button>
            </div>
            
             <div className="col-md-12">
            
                        {fosTeamReport.length > 0 && (
                            <div className="table-container table-responsive">
                                <h4>Team Report for FOS under {selectedAtlName}</h4>
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Agent Name</th>
                                            <th>Total Dialled Calls</th>
                                            <th>Total Connected Calls</th>
                                            <th>Total Follow Up</th>
                                            <th>Meeting Fixed</th>
                                            <th>Todays Meeting</th>
                                            <th>Total Meeting</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fosTeamReport.map(fos => (
                                            <tr key={fos._id}>
                                                <td>{fos.username}</td>
                                                <td> {fos.interestedCount +
                                                    fos.followUpCount +
                                                    fos.notInterestedCount +
                                                    fos.qualifiedCount +
                                                    fos.prospectCount +
                                                    fos.rnrCount +
                                                    fos.rspvCount +
                                                    fos.notReachableCount}</td>
                                                <td>{fos.interestedCount +
                                                    fos.followUpCount +
                                                    fos.notInterestedCount +
                                                    fos.qualifiedCount +
                                                    fos.prospectCount +
                                                    fos.rspvCount +
                                                    fos.notReachableCount}</td>
                                                <td>{fos.followUpCount}</td>
                                                <td>{fos.upcomingMeetings}</td>
                                                <td>{fos.todayMeetings}</td>
                                                <td>{fos.totalMeetings}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    
                    
                      <div className="col-md-12">
                       <p><small > * Note For Team Report Just Select ATL Name And Click Button </small></p>
                        {showChart && (
                            <div className="row">
                                <div className="col-md-12">
                                    <BarChart counts={{
                                        'Intrested': interestedCount,
                                        'FollowUp': followUpCount,
                                        'NotInterested': notInterestedCount,
                                        'Qualified': qualifiedCount,
                                        'Prospect': prospectCount,
                                        'RNR': rnrCount,
                                        'NotReachable': notReachableCount,
                                        'RSPVCount': RSPVCount,
                                        'meetingCount': meetingCount,
                                        'Todaymeeting': Todaymeeting,
                                        'Totalmeeting': Totalmeeting
                                    }} />
                                </div>
                            </div>
                        )}
                    </div>
            </div>
            </div>
            </div>
        </RootLayout>
    );
}

export default Report;
