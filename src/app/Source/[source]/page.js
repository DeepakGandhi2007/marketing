"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactDragListView from "react-drag-listview/lib/index.js";
import RootLayout from "@/app/components/layout";
import { AiOutlineHolder } from "react-icons/ai";
import { List } from "antd";
import Loader from "@/app/components//Loader";
import SourceModal from '@/app/components/SourceModal';

function Source() {
   const [isModalOpen, setIsModalOpen] = useState(false);
    const [SourceCount, setSourceCount] = useState([]);
    const [Sourcenumber, setSourcenumber] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [SourceCountPerPage] = useState(100);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [input, setInput] = useState({});

    const AddSource = () => {
        setIsModalOpen(!isModalOpen);
    };
    

    
     useEffect(() => {
        const fetchSource = async () => {
            try {
                let url = `/api/Source/get`;
                const response = await axios.get(url);
                setSourceCount(response.data.data);
            } catch (error) {
                console.error('Error fetching Tags:', error);
            }
        };

        fetchSource();

    }, []);
    
    
     useEffect(() => {
        SourceCount.forEach((Source) => fetchLeadsCount(Source._id));
    }, [SourceCount]);

    const fetchLeadsCount = async (SourceId) => {
        try {
            const response = await axios.get(`/api/Lead/sourcecount?Source=${SourceId}`);
            setSourcenumber((prevCounts) => ({
                ...prevCounts,
                [SourceId]: response.data.count,
            }));
        } catch (error) {
            console.error(`Error fetching leads count for Source ${SourceId}:`, error);
        }
    };
    
    
    
        const indexOfLastTag = currentPage * SourceCountPerPage;
        const indexOfFirstTag = indexOfLastTag - SourceCountPerPage;
        const currentTag = SourceCount.slice(indexOfFirstTag, indexOfLastTag);

     
        const nextPage = () => {
            if (currentPage < Math.ceil(SourceCount.length / currentTag)) {
                setCurrentPage(currentPage + 1);
            }
        };

        const prevPage = () => {
            if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        };
         const [loading, setLoading] = useState(false)
     const handleStop = async (e, data, index) => {
        const updatedSourceCount = [...SourceCount];

        const [movedItem] = updatedSourceCount.splice(draggingIndex, 1);
        updatedSourceCount.splice(index, 0, movedItem);
        setSourceCount(updatedSourceCount);
        const orderedIds = updatedSourceCount.map((item) => item._id);
        try {
            setLoading(true)
            await axios.put('/api/Source/saveOrder', { orderedIds });
            setDraggingIndex(null);
            setLoading(false)
        } catch (error) {
            console.error('Error in draggable POST request:', error);
           
        }
    };

 
  const dragProps = {
    async onDragEnd(fromIndex, toIndex) {
      const newData = [...SourceCount];
      const item = newData.splice(fromIndex, 1)[0];
      newData.splice(toIndex, 0, item);
      const orderedIds = newData.map((item) => item._id);
      console.log(orderedIds,"orderedIds");
      try {
            await axios.put('/api/Source/saveOrder', { orderedIds });
        } catch (error) {
            console.error('Error in draggable POST request:', error);
        }
      setSourceCount(newData);
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
            setInput({ [id]: SourceCount.find((source) => source._id === id)?.Source || "" });
        }
    };
     const handleInputChange = (id, value) => {
        setInput((prevInput) => ({
            ...prevInput,
            [id]: value,
        }));
    };

const updateSource = async (id) => {
    try {
        const response = await axios.put(`/api/Source/update/${id}`, { id, source: input[id] });
        window.location.reload();
        setEditId(null);
    } catch (error) {
        console.error(`Error updating source ${id}:`, error);
    }
};
    
      const handleDelete = async(id) => {
          try {
            const response = await axios.delete(`/api/Source/delete/${id}`);
            window.location.reload()
       
            }
           catch (error) {
            console.error(`Error updating source ${id}:`, error);
        }
    };
  return (
    <RootLayout>
                    {isModalOpen && <SourceModal onClose={AddSource} />}

      <div className="flex justify-end w-full mt-20 !px-0">
        <script
          id="DragDropTouch"
          src="https://bernardo-castilho.github.io/DragDropTouch/DragDropTouch.js"
        ></script>
        <div className="tablet:w-[calc(100%-100px)]  mobile:w-full h-full overflow-x-hidden">
          <div className="w-full relative  px-4 py-4">
            <p className="text-lg !mb-0 !mt-0 font-[500] px-2 font-Satoshi w-full ">
              Sources
            </p>
            
            
            
            {
                loading &&  <div className={'w-full  fixed h-[100vh] z-[9] top-0 left-0 !bg-red-500'}> <Loader />
            </div>
                
            }
            <ReactDragListView {...dragProps}>
              <List
                dataSource={SourceCount}
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
                                <p className='!mb-0 !mt-0 px-2 py-2 bg-slate-100 rounded-md'>{Sourcenumber[item._id] !== undefined && Sourcenumber[item._id]}</p>
                                <input  value={input[item._id] || item.Source} onChange={(e) => handleInputChange(item._id, e.target.value)} className={` px-3 py-2 rounded-lg border-1 border-transparent disabled:!bg-transparent  ${item._id == editId ? '!border-slate-600 bg-slate-100' : ''}`} disabled={item._id != editId}/>
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
                              <button className='float' onClick={AddSource}> <i className="fa fa-plus my-float my-float" /></button>

      </div>

    </RootLayout>
  );
}

export default Source;
