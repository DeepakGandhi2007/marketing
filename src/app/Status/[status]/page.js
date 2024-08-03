"use client";
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import RootLayout from '@/app/components/layout';
import StatusModal from '@/app/components/StatusModal';
import ReactDragListView from "react-drag-listview/lib/index.js";
 
import { List } from "antd";
function Status() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [StatusCount, setStatusCount] = useState([]);
    const [Statusnumber, setStatusnumber] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [StatusCountPerPage] = useState(100);
      const [input, setInput] = useState({});
    const AddStatus = () => {
        setIsModalOpen(!isModalOpen);
    };
    
    console.log(Statusnumber);
    
    
     useEffect(() => {
        const fetchStatus = async () => {
            try {
                let url = `/api/Status/get`;
                const response = await axios.get(url);
                setStatusCount(response.data.data);
            } catch (error) {
                console.error('Error fetching Tags:', error);
            }
        };

        fetchStatus();

    }, []);
    
    
     useEffect(() => {
        StatusCount.forEach((status) => fetchLeadsCount(status._id));
    }, [StatusCount]);

    const fetchLeadsCount = async (statusId) => {
        try {
            const response = await axios.get(`/api/Lead/statuscount?status=${statusId}`);
            setStatusnumber((prevCounts) => ({
                ...prevCounts,
                [statusId]: response.data.count,
            }));
        } catch (error) {
            console.error(`Error fetching leads count for status ${statusId}:`, error);
        }
    };
    
    
    const dragProps = {
    async onDragEnd(fromIndex, toIndex) {
      const newData = [...StatusCount];
      const item = newData.splice(fromIndex, 1)[0];
      newData.splice(toIndex, 0, item);
      const orderedIds = newData.map((item) => item._id);
      console.log(orderedIds,"orderedIds");
      try {
            await axios.put('/api/Status/saveOrder', { orderedIds });
        } catch (error) {
            console.error('Error in draggable POST request:', error);
        }
      setStatusCount(newData);
    },
    nodeSelector: ".ant-list-item.draggble",
    handleSelector: "div",
  };
  
  
    const [editId, setEditId] = useState(null)
   const getId = (id) => {
        if (id == editId) {
            setEditId(null);
        } else {
            setEditId(id);
            setInput({ [id]: StatusCount.find((Status) => Status._id === id)?.Status || "" });
        }
    };
     const handleInputChange = (id, value) => {
        setInput((prevInput) => ({
            ...prevInput,
            [id]: value,
        }));
    };
    
    
        const indexOfLastTag = currentPage * StatusCountPerPage;
        const indexOfFirstTag = indexOfLastTag - StatusCountPerPage;
        const currentTag = StatusCount.slice(indexOfFirstTag, indexOfLastTag);

    // Change page
        const nextPage = () => {
            if (currentPage < Math.ceil(StatusCount.length / currentTag)) {
                setCurrentPage(currentPage + 1);
            }
        };

        const prevPage = () => {
            if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        };
    return (
        <RootLayout>
                {isModalOpen && <StatusModal onClose={AddStatus} />}

                
      <div className="flex justify-end w-full mt-20 !px-0">
        <script
          id="DragDropTouch"
          src="https://bernardo-castilho.github.io/DragDropTouch/DragDropTouch.js"
        ></script>
        <div className="tablet:w-[calc(100%-100px)]  mobile:w-full h-full overflow-x-hidden">
          <div className="w-full relative  px-4 py-4">
            <p className="text-lg !mb-0 !mt-0 font-[500] px-2 font-Satoshi w-full ">
              Status
            </p>
            
            
            
            
            <ReactDragListView {...dragProps}>
              <List
                dataSource={StatusCount}
                renderItem={(item, index) => {
                  const draggble =
                    item !== "Racing car sprays burning fuel into crowd.";
                  return (
                    <List.Item
                      className={draggble ? "draggble" : ""}
                      key={index}
                    > 
                        <div className='w-full flex justify-between items-center cursor-pointer px-3 py-3 bg-white rounded-xl'>
                            <div className='flex items-center gap-2'>
                                <p className='!mb-0 !mt-0 px-2 py-2 bg-slate-100 rounded-md'>{Statusnumber[item._id] !== undefined && Statusnumber[item._id]}</p>
                                <input  value={input[item._id] || item.Status} onChange={(e) => handleInputChange(item._id, e.target.value)} className={` px-3 py-2 rounded-lg border-1 border-transparent disabled:!bg-transparent  ${item._id == editId ? '!border-slate-600 bg-slate-100' : ''}`} disabled={item._id != editId}/>
                            </div>
                          <div className='flex items-center gap-2'>
                           <button className={`px-3 py-2 bg-green-400 text-gray-900  rounded-md ' ${item._id == editId ? 'visible' : 'hidden'} `} onClick={() => updateSource(item._id)} >Done</button>
                            <button className={`px-3 py-2 bg-yellow-200 text-gray-900 rounded-md ' ${item._id != editId ? 'visible' : 'hidden'} `} onClick={()=>{getId(item._id)}} >Edit</button>
                            <button className={`px-3 py-2 bg-red-500 text-slate-100 rounded-md  ${item._id != editId ? 'visible' : 'hidden'} `} onClick={() => handleDelete(item._id)}>Delete</button>
                            
                            </div>

                        </div>
                      
                    </List.Item>
                  );
                }}
              />
            </ReactDragListView>
          </div>
        </div>
                              <button className='float' onClick={AddStatus}> <i className="fa fa-plus my-float my-float" /></button>

      </div>

               



         


        </RootLayout>


    )
}

export default Status
