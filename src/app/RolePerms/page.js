"use client"
import React, { useEffect, useState } from 'react';
import RootLayout from '@/app/components/layout';
import SearchableSelect from '../Leads/dropdown';
import axios from 'axios';
import { Select } from "antd";
function RolePerms() {
    const [selectedRole, setSelectedRole] = useState(null);
    const [permissions, setPermissions] = useState({});
    const [defaultperms, setDefaultPerms] = useState([]);

    const options1 = [
        { value: 'Admin', label: 'Admin' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'SalesHead', label: 'Slaes Head' },
        { value: 'Manager', label: 'Manager' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Operations', label: 'Operations' },
        { value: 'HR', label: 'Human Resource' },
        { value: 'BussinessHead', label: 'Bussiness Head' },
        { value: 'PNL', label: 'PNL' },
        { value: 'TL', label: 'TL' },
        { value: 'ATL', label: 'ATL' },
        { value: 'FOS', label: 'FOS' },

    ]

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await axios.get(`/api/rolepermison/${selectedRole}`);
                console.log(response.data.data);
                const groupedPermissions = {};
                response.data.data.forEach(permission => {
                    if (!groupedPermissions[permission.moduleName]) {
                        groupedPermissions[permission.moduleName] = [];
                    }
                    groupedPermissions[permission.moduleName].push(permission);
                });
                setDefaultPerms(groupedPermissions);
            } catch (error) {
                console.error(error);
            }
        };

        if (selectedRole) {
            fetchPermissions();
        }
    }, [selectedRole]);

    const updatePermissions = async () => {
        try {
            const response = await axios.put(`/api/rolepermison/update/${selectedRole}`, { permissions: permissions });
            console.log('Permissions updated successfully');
        } catch (error) {
            console.error(error);
        }
    };

    const handleTogglePermission = (module, permission) => {
        const updatedPermissions = { ...permissions };
        if (!updatedPermissions[module]) {
            updatedPermissions[module] = {};
        }
        updatedPermissions[module][permission] = !updatedPermissions[module][permission];
        setPermissions(updatedPermissions);
    };

    return (
        <RootLayout>
        <div className="flex justify-end w-full mt-20 !px-0">
        <div className="tablet:w-[calc(100%-100px)]  mobile:w-full h-full overflow-x-hidden">
          <div className="w-full   px-4 py-4">
            <p className="text-lg font-[500]  font-Satoshi w-full ">
              Role Permissions
            </p>
            
            <div>
           
             <Select
            mode="single"
             style={{width:'200px'}}
            onChange={(selectedOption) => setSelectedRole(selectedOption)}
            options={options1}
            placeholder="Select Role..."
           
          />
            </div>
           
            
            <div className={`mt-3`}>
                 
                                <table className="table table-bordered roles no-margin">
                                    <thead>
                                        <tr>
                                            <th>Modules</th>
                                            <th>Permission</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(defaultperms).map((moduleName, index) => (
                                            <tr key={index} data-name={moduleName}>
                                                <td>
                                                    <b>{moduleName}</b>
                                                </td>
                                                <td>
                                                    {defaultperms[moduleName].map((permission, idx) => (
                                                        <div className="checkbox" key={idx}>
                                                            <div className="form-check form-switch mb-3">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    id={`customSwitch-${moduleName}-${idx}`}
                                                                    onClick={() => handleTogglePermission(moduleName, permission.permissionName)}
                                                                    defaultChecked={permission.value === true ? true : false}
                                                                />
                                                                <label className="form-check-label" htmlFor={`customSwitch-${moduleName}-${idx}`}>
                                                                    {permission.permissionName}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                           
            </div>
             <button className='btn btn-primary' onClick={updatePermissions}>Save Permission</button>
            </div>
           
            </div>
            </div>
         

        </RootLayout>
    );
};



export default RolePerms;
