"use client"
import React, { useEffect, useState } from 'react';
import RootLayout from '@/app/components/layout';
import UserActivityGraph from '../components/UserActivityGraph';
import axios from 'axios';
import SearchableSelect from '../Leads/dropdown';
import * as XLSX from 'xlsx';
import { Select } from "antd";
function Timesheet() {
    const [userTimelineData, setUserTimelineData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedmonth, setctedmonth] = useState('');
    const [users, setUsers] = useState([]);
    const [options4, setOptions4] = useState([]);
    console.log(selectedUser);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/staff/get');
                setUsers(response.data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);
    useEffect(() => {
        const newOptions = users.map(user => ({
            value: user._id,
            label: user.username,
        }));
        setOptions4(newOptions);
    }, [users]);


    useEffect(() => {
        let url = '/api/users/timeline';
        if (selectedUser && selectedDate) {
            url += `?userId=${selectedUser}&date=${selectedDate}`;
        }

        axios.get(url)
            .then(response => {
                if (response.data && response.data.data) {
                    setUserTimelineData(response.data.data);
                } else {
                    console.error('Invalid user timeline data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Failed to fetch user timeline data:', error);
            });
    }, [selectedDate]);


    const fetchUsermonthTimelineData = () => {
        let url = '/api/users/timeline/month';
        if (selectedUser && selectedmonth) {
            url += `?userId=${selectedUser}&date=${selectedmonth}`;
        }

        axios.get(url)
            .then(response => {
                if (response.data && response.data.data) {
                    const data = response.data.data;
                    const csv = convertToCSV(data);
                    downloadCSV(csv);
                } else {
                    console.error('Invalid user timeline data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Failed to fetch user timeline data:', error);
            });
    };

    const convertToCSV = (data) => {
        if (data.length === 0) {
            return '';
        }

        // Define the fields to exclude
        const excludedFields = ['_id', 'userId', 'timestamp', '__v'];

        const headers = Object.keys(data[0]).filter(key => !excludedFields.includes(key));

        const rows = [headers.join(',')];
        for (const item of data) {
            const values = [];
            for (const key of headers) {
                if (key === 'location.city') {
                    const cityValue = item.location && item.location.city ? item.location.city : '';
                    values.push(cityValue);
                } else {
                    values.push(item[key]);
                }
            }
            rows.push(values.join(','));
        }

        return rows.join('\n');
    };
    const downloadCSV = (csv) => {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user_timeline_data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };
    return (
        <RootLayout>
         <div className="flex justify-end w-full mt-20 !px-0">
        <div className="tablet:w-[calc(100%-100px)]  mobile:w-full h-full overflow-x-hidden">
          <div className="w-full   px-4 py-4">
            <p className="text-lg font-[500]  font-Satoshi w-full ">
              Timeline Activity
            </p>
            
            
                <div className='flex justify-start gap-6 items-center   '>
                    
                         
                       <Select
                            mode="single"
                            allowClear
                            style={{ width: "150px" }}
                           onChange={(value) => setSelectedUser(value)}
                            options={options4}
                             placeholder="Select Staff..."
                           
                          />
                   
                        <div className=" ">
                            <input type='date' className='form-control' value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)} />
                        </div>
                    
                   
                        <div className=" ">
                            <input type='month' className='form-control' value={selectedmonth}
                                onChange={(e) => setctedmonth(e.target.value)} />
                        </div>
                   
                   
                        <div className=" ">
                            <button className='btn btn-primary' onClick={fetchUsermonthTimelineData}>Monthly Report</button>
                        </div>
                     
                </div>
                <div className=" mt-5">
                  

                        {userTimelineData.length > 0 ? (
                            <UserActivityGraph userTimelineData={userTimelineData} />
                        ) : (
                            <div>No Data Availabel for this date...</div>
                        )}
                   
            </div>
            </div>
          
            </div>
          
            </div>
          
  
            
 
        </RootLayout>
    );
}

export default Timesheet;
