"use client";
import { useState, useEffect } from "react";
import { Spin } from "antd";

const TableTwo = ({ devData, loading }) => {
  const aggregateDataByCountry = (data) => {
    // Step 1: Aggregate data by country
    const aggregated = Object.values(data).reduce(
      (acc, { dailyBudget, spend, results, country }) => {
        if (country) {
          if (!acc[country]) {
            acc[country] = {
              country: country,
              dailyBudget: 0,
              spend: 0,
              results: 0,
            };
          }

          acc[country].dailyBudget += dailyBudget;
          acc[country].spend += spend;
          acc[country].results += results;
        }
        return acc;
      },
      {}
    );

    // Step 2: Calculate total daily budget and total leads
    const totalDailyBudget = Object.values(aggregated).reduce(
      (total, item) => total + item.dailyBudget,
      0
    );
    const totalLeads = Object.values(aggregated).reduce(
      (total, item) => total + item.results,
      0
    );
    const totalLeadCost = Object.values(aggregated).reduce(
      (total, item) => total + item.spend / item.results,
      0
    );

    // Step 3: Add budgetPercent and resultsPercent to each country
    for (const key in aggregated) {
      if (aggregated.hasOwnProperty(key)) {
        const countryData = aggregated[key];
        countryData.budgetPercent =
          totalDailyBudget > 0
            ? ((countryData.dailyBudget * 100) / totalDailyBudget).toFixed(2)
            : 0;
        countryData.resultsPercent =
          totalLeads > 0
            ? ((countryData.results * 100) / totalLeads).toFixed(2)
            : 0;
      }
    }

    // Step 4: Add total row
    const total = {
      country: "Total",
      dailyBudget: totalDailyBudget,
      spend: Object.values(aggregated).reduce(
        (total, item) => total + item.spend,
        0
      ),
      results: totalLeads,
      budgetPercent: 100,
      costPerLead: totalLeadCost,
      resultsPercent: 100,
    };

    aggregated["Total"] = total;

    return aggregated;
  };

  // Aggregated data
  const aggregatedData = aggregateDataByCountry(devData);
  const [dataArray, setDataArray] = useState(Object.entries(aggregatedData));

  return (
    <div
      className={`w-full transition-all duration-200 mt-10 relative overflow-y-auto ${
        devData.length !== 0 && loading
          ? "shadow-md rounded-lg"
          : "flex justify-center items-center"
      }`}
    >
      {dataArray.length !== 0 && !loading ? (
        <table className="w-full border-collapse text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs sticky top-0 left-0 text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3">
                Country
              </th>
              <th scope="col" className="px-3 py-3">
                Total Budget AED
              </th>
              <th scope="col" className="px-2 py-3">
                Budget %
              </th>
              <th scope="col" className="px-2 py-3">
                Total Spend AED
              </th>
              <th scope="col" className="px-2 py-3">
                Total Leads
              </th>
              <th scope="col" className="px-2 py-3">
                Cost/Lead AED
              </th>
              <th scope="col" className="px-2 py-3">
                Lead %
              </th>
            </tr>
          </thead>
          <tbody>
            {dataArray.map(([key, data], index) => {
              return (
                <tr
                  key={index}
                  className={` border-b  ${
                    index == dataArray.length - 1
                      ? "bg-green-500 text-black"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <td className="px-3 py-3 text-gray-900">{data.country}</td>
                  <td className="px-3 py-3 text-gray-900">
                    {data.dailyBudget.toFixed(2)}
                  </td>
                  <td className="px-2 py-3 text-gray-900">
                    {data.budgetPercent}%
                  </td>
                  <td className="px-2 py-3 text-gray-900">
                    {data.spend.toFixed(2)}
                  </td>
                  <td className="px-2 py-3 text-gray-900">{data.results}</td>
                  <td className="px-2 py-3 text-gray-900">
                    {index < dataArray.length - 1
                      ? (data.spend / data.results).toFixed(2)
                      : data.costPerLead.toFixed(2)}
                  </td>
                  <td className="px-2 py-3 text-gray-900">
                    {data.resultsPercent}%
                  </td>
                </tr>
              );
            })}
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

export default TableTwo;
