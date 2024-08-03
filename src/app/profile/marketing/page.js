"use client";
import React, { useState, useEffect } from "react";
import TableOne from "@/app/components/table1";
import { Spin } from "antd";
import RootLayout from "@/app/components/layout";
import axios from "axios";
import TableTwo from "@/app/components/table2";
const Graphs = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [devData, setDevData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/facebook/get");

      setDevData(response.data.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {

      setTimeout(() => {
        setLoading(false);
      }, 1000);
      setLastFetchTime(Date.now());
    }
  };



  useEffect(() => {
    const intervalId = setInterval(() => {
      if (lastFetchTime) {
        const elapsedTime = Date.now() - lastFetchTime;
        const fiveMinutes = 5 * 60 * 1000;
        const remainingTime = Math.max(fiveMinutes - elapsedTime, 0);

        setTimeRemaining(remainingTime);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [lastFetchTime]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const isButtonDisabled = () => {
    if (!lastFetchTime) return false;
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() - lastFetchTime < fiveMinutes;
  };

  const tabs = [
    {
      id: 0,
      name: "Graph 1",
    },
    {
      id: 1,
      name: "Graph 2",
    },
    {
      id: 2,
      name: "Graph 3",
    },
    {
      id: 3,
      name: "Graph 4",
    },
  ];

  return (
    <RootLayout>
      <div className="flex justify-end w-full mt-20 !px-0">
        <div className="tablet:w-[calc(100%-100px)] mobile:w-full h-full overflow-x-hidden">
          <div className="w-full px-4 py-4 gap-3 flex flex-col justify-center items-center">
            <div className={`flex items-center gap-3`}>
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  disabled={loading || devData.length == 0}
                  onClick={() => setTabIndex(index)}
                  className={`!mb-0 !mt-0 px-3 py-2 ${tabIndex == index ? "bg-gray-200" : "disabled:hover:bg-transparent hover:bg-gray-300"
                    } font-Satoshi text-lg rounded-lg`}
                >
                  Data {index + 1}
                </button>
              ))}

              <button
                onClick={getData}
                disabled={loading || isButtonDisabled()}
                className={`!mb-0 !mt-0  ${isButtonDisabled() ? "w-48" : 'w-28'} disabled:bg-gray-300 disabled:hover:border-gray-700  ml-10   py-2  hover:bg-[#42A5F5]  !border-[1px] transition-all duration-300 border-gray-700 hover:border-blue-300 font-[500] font-Satoshi text-lg rounded-lg`}
              >
                {loading ? <Spin /> : devData.length != 0 ? isButtonDisabled() ? 'Refresh in' + ' ' + formatTime(timeRemaining) : 'Refresh' : "Load"}
              </button>
            </div>



            <div className={`w-[80%] `}>
              {tabIndex == 0 && (
                <TableOne devData={devData} loading={loading} />
              )}
              {tabIndex == 1 && (
                <TableTwo devData={devData} loading={loading} />
              )}
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default Graphs;
