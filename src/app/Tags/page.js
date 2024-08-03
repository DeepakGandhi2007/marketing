"use client";
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import RootLayout from '@/app/components/layout';
import TagMOdal from '../components/TagModal';

function Tags() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [TagsCount, setTagsCount] = useState([]);
    const [Tagsnumber, setTagsnumber] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [TagsCountPerPage] = useState(100);
    const AddTags = () => {
        setIsModalOpen(!isModalOpen);
    };
    useEffect(() => {
        const fetchTags = async () => {
            try {
                let url = `/api/tags/get`;
                const response = await axios.get(url);
                setTagsCount(response.data.data);
            } catch (error) {
                console.error('Error fetching Tags:', error);
            }
        };

        fetchTags();

    }, []);


    useEffect(() => {
        TagsCount.forEach((tag) => fetchLeadsCount(tag._id));
    }, [TagsCount]);

    const fetchLeadsCount = async (tagId) => {
        try {
            const response = await axios.get(`/api/Lead/TagCount?tag=${tagId}`);
            setTagsnumber((prevCounts) => ({
                ...prevCounts,
                [tagId]: response.data.count,
            }));
        } catch (error) {
            console.error(`Error fetching leads count for tag ${tagId}:`, error);
        }
    };



    const indexOfLastTag = currentPage * TagsCountPerPage;
    const indexOfFirstTag = indexOfLastTag - TagsCountPerPage;
    const currentTag = TagsCount.slice(indexOfFirstTag, indexOfLastTag);

    // Change page
    const nextPage = () => {
        if (currentPage < Math.ceil(TagsCount.length / currentTag)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleDeleteTag = (tagId) => {
        axios.delete(`/api/tags/delete/${tagId}`)
            .then(response => {
               setTagsCount(TagsCount.filter(tag => tag._id !== tagId));
                setTagsnumber(prevCounts => {
                    const newCounts = { ...prevCounts };
                    delete newCounts[tagId];
                    return newCounts;
                });
            })
            .catch(error => {
                console.error("Error deleting tags:", error);
            });
    };

    return (
        <RootLayout>
 {isModalOpen && <TagMOdal onClose={AddTags} />}
            <div className='container-fluid'>
               
        <div className="flex justify-end w-full mt-20 !px-0">
        <div className="tablet:w-[calc(100%-100px)]  mobile:w-full h-full overflow-x-hidden">
          <div className="w-full   px-4 py-4">
            <p className="text-lg font-[500]  font-Satoshi w-full ">
              Tags
            </p>
            
            {currentTag.map((currentTags) => {

                                    return (
                                        <div key={currentTags._id} className="mb-3 position-relative">
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="validationTooltipUsernamePrepend">
                                                        {Tagsnumber[currentTags._id] !== undefined && Tagsnumber[currentTags._id]}
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="validationTooltipUsername"
                                                    value={currentTags.Tag}
                                                    aria-describedby="validationTooltipUsernamePrepend"
                                                    required=""
                                                />
                                                     <div className="input-group-append">
                                                    <button className="btn btn-danger" onClick={() => handleDeleteTag(currentTags._id)}>Delete</button>
                                                </div>
                                                <div className="invalid-tooltip"></div>
                                            </div>
                                        </div>
                                    );
                                })}
            
            </div>
            <button className='float' onClick={AddTags}> <i className="fa fa-plus my-float my-float" /></button>
            </div>
            </div>
            </div>
            
               


        </RootLayout>


    )
}

export default Tags
