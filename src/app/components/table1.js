"use client";
import { useState, useEffect, useCallback } from "react";
import { Spin } from "antd";
const TableOne = ({ devData, loading }) => {
  const dataArray = Object.entries(devData);



  return (
    <div
      className={`w-full transition-all duration-200 h-[500px] mt-10 relative overflow-y-auto  "shadow-md rounded-lg" "flex justify-center items-center"`}
    >

      {devData.length != 0 && !loading ? (
        <table class="w-full   border-collapse  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs sticky top-0 left-0 text-gray-700 uppercase bg-gray-50  ">
            <tr>
              <th scope="col" className="px-3 py-3">
                Campaign Name
              </th>
              <th scope="col" className="px-3 py-3">
                Daily Budget
              </th>
              <th scope="col" className="px-2 py-3">
                Spend
              </th>
              <th scope="col" className="px-2 py-3">
                Results
              </th>
              <th scope="col" className="px-2 py-3">
                Cost Result
              </th>
            </tr>
          </thead>
          <tbody>
            {dataArray.map(([campaignName, details], index) => (
              <tr
                key={index}
                className={`bg-white border-b hover:bg-gray-50 ${index === dataArray.length - 1 ? 'bg-green-500 text-white' : ''
                  }`}
              >
                <td className="px-3 py-3 text-gray-900">{campaignName}</td>
                <td className="px-3 py-3 text-gray-900">{details.dailyBudget}</td>
                <td className="px-3 py-3 text-gray-900">{details.spend}</td>
                <td className="px-2 py-3 text-gray-900">{details.results}</td>
                <td className="px-2 py-3 text-gray-900">{details.costPerResult}</td>
              </tr>

            ))}

          </tbody>
        </table>
      ) : loading ? (
        <Spin />
      ) : (
        <p className="text-3xl !m-0 font-Satoshi font-[500]">
          No data available.
        </p>
      )}
    </div>
  );
};

export default TableOne;
