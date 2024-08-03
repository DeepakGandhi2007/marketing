"use client";
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import RootLayout from '@/app/components/layout';
import TemplateMOdal from '@/app/components/templateModal';


function Whatsapp() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplate, setselectedTemplate] = useState(null);
    const addtemplate = () => {
        setselectedTemplate('')
        setIsModalOpen(!isModalOpen);
    };
    const [Template, setTemplate] = useState([]);
    
     useEffect(() => {
        const fetchTemplate = async () => {
            try {
                let url = `/api/whatsapp/get`;
                const response = await axios.get(url);
                setTemplate(response.data.data);
            } catch (response) {
                console.error('Error fetching Template:', response);
            }
        };

        fetchTemplate();

    }, []);
    
      const toggleModal = (e,Templates = null) => {
        if (e) {
            e.preventDefault();
        }
          setselectedTemplate(Templates);
        setIsModalOpen(!isModalOpen);
    };
    return (


        <RootLayout>
            {isModalOpen && <TemplateMOdal  userdata={selectedTemplate}  onClose={addtemplate} />}
            <div className='container-fluid mt-24'>
                <div className='row'>
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                              <div className='row'>
                                    <div className="col-12 d-flex align-items-center justify-content-between">
                                        <h4 className="card-title">Whatsapp Template</h4>
                                       
                                    </div>
                                </div>

                                <div
                                    id="datatable_wrapper"
                                    className="dataTables_wrapper dt-bootstrap4 no-footer"
                                >
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="table-responsive">
                                                <table className="table mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Name</th>
                                                            <th>Edit</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                      {Template.map((Templates, index) => (
                                                            <tr key={Templates._id}>
                                                                <th scope="row">{index  + 1}</th>
                                                                <td><div dangerouslySetInnerHTML={{ __html: Templates.Template }} /></td>
                                                                <td><button className="btn btn-warning" onClick={(e) => toggleModal(e, Templates)}>Edit</button></td>

    

                                                                {/* <td>
                                                                    <div className="form-check form-switch mb-3" dir="ltr">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-check-input"
                                                                            id={`customSwitch${index}`}
                                                                            defaultChecked={user.active}
                                                                        />
                                                                    </div>
                                                                </td> */}

                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        <button className='float' onClick={addtemplate}> <i className="fa fa-plus my-float my-float" /></button>

            

            </div>


        </RootLayout>


    )
}

export default Whatsapp
