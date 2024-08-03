"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import $ from "jquery";
import Calendar from "../components/calender";
import RootLayout from "../components/layout";
import TokenDecoder from "../components/Cookies";
import AnimatedNumbers from "react-animated-numbers";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "react-toastify/dist/ReactToastify.css";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import { Line } from "react-chartjs-2";
function ProfilePage() {
  const [sales, setsales] = useState(0);
  const [tsales, settsales] = useState(0);
  const [tLeads, settLeads] = useState(0);
  const [tfollow, settfollow] = useState(0);
  const [tmeeting, settmeeting] = useState(0);
  const [tintrested, settintrested] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState({});
  const [topdeveloper, setTopDevelopers] = useState([]);
  const [percentageContribution, setPercentageContribution] = useState([]);
  const userdata = TokenDecoder();
  const userid = userdata ? userdata.id : null;
  const userrole = userdata ? userdata.role : null;
  const [personalSales, setPersonalSales] = useState(0);
  const [newLeads, setNewLeads] = useState(0)
  const [graphData, setGraphData] = useState([]);
  const [yourSalesRevenue, setYourSalesRevenue] = useState(0);

  const [salesRevenue, setSalesRevenue] = useState(0);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          // User has granted permission
        }
      });
    }
  }, []);

  const [yourDeals, setYourDeal] = useState(0);

  const toastify = () => {};
  useEffect(() => {
    const fetchLead = async () => {
      try {
        let url;
        if (userrole === "Admin") {
          url = `/api/invoice/get`;
        }
        if (userrole === "superAdmin") {
          url = `/api/invoice/get`;
        } else if (userrole === "FOS") {
          url = `/api/invoice/FOS/${userid}`;
        } else if (userrole === "BussinessHead") {
          url = `/api/invoice/parentstaff?role=ATL&userid=${userid}`;
        } else if (userrole === "PNL") {
          url = `/api/invoice/parentstaff?role=PNL&userid=${userid}`;
        } else if (userrole === "TL") {
          url = `/api/invoice/parentstaff?role=TL&userid=${userid}`;
        } else if (userrole === "ATL") {
          url = `/api/invoice/parentstaff?role=ATL&userid=${userid}`;
        }

        const response = await axios.get(url);

        let totalPrice = 0;
        response.data.data.forEach((item) => {
          totalPrice += parseFloat(item.Price.replace(/,/g, ""));
        });

        let totalRevenue = 0;

        const monthlyRevenue = Array.from({ length: 12 }, () => 0);

        if (
          userrole.toLowerCase() === "superadmin" ||
          userrole.toLowerCase() === "admin"
        ) {
          response.data.data.forEach((invoice) => {
            const month = new Date(invoice.timestamp).getMonth() + 1;
            if (invoice.netcom) {
              const revenue = parseFloat(invoice.netcom.replace(/,/g, ""));
              monthlyRevenue[month - 1] += revenue;
            }
          });
        } else {
          response.data.data.forEach((invoice) => {
            const month = new Date(invoice.timestamp).getMonth() + 1;
            // Assuming here invoice.Price is always defined as per your logic
            const revenue = parseFloat(invoice.Price.replace(/,/g, ""));
            monthlyRevenue[month - 1] += revenue;
          });
        }

        const developers = response.data.data.reduce((acc, invoice) => {
          const developerName = invoice.Developer;
          acc[developerName] = (acc[developerName] || 0) + 1;
          return acc;
        }, {});

        const topDevelopers = Object.keys(developers)
          .sort((a, b) => developers[b] - developers[a])
          .slice(0, 3)
          .map((name) => ({ name, deals: developers[name] }));

        const totalTopDevelopersSales = topDevelopers.reduce(
          (acc, dev) => acc + developers[dev],
          0
        );
        const percentageContribution = topDevelopers.map((dev) => ({
          name: dev,
          percentage:
            ((developers[dev] / totalTopDevelopersSales) * 100).toFixed(2) +
            "%",
        }));

        const yours = response.data.data.filter((data) =>
          data.submittedBy.includes(userid)
        );
        const yourtempSales = response.data.data.filter((data) =>
          data.submittedBy.includes(userid)
        );

        let tempSales = 0;
        yourtempSales.forEach((item) => {
          tempSales += parseFloat(item.Price.replace(/,/g, ""));
        });

        let yourTempSalesRevenue = 0;

        setPersonalSales(tempSales);
        setYourDeal(yours.length);
        setGraphData(monthlyRevenue);
        setTopDevelopers(topDevelopers);
        settsales(totalPrice);
        setMonthlyRevenue(monthlyRevenue);
        setPercentageContribution(percentageContribution);

        setsales(response.data.data.length);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchLead();
  }, [userrole]);

  useEffect(() => {
    const fetchdocument = async () => {
      try {
        let url = `/api/staff/get`;
        if (userrole !== "HR") {
          url = `/api/staff/document/get/${userid}`;
        }
        const response = await axios.get(url);
        const staffWithoutDocument = response.data.data.filter(
          (staff) => !staff.documents
        );
        staffWithoutDocument.forEach((staff) => {
          toast.error(`${staff.username} does not have a document Uploaded.`);
        });
      } catch (error) {
        // Handle error
      }
    };

    fetchdocument();
  }, [userrole]);

  const revenueRef = useRef(null);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        let url;
        if (userrole === "Admin") {
          url = `/api/Lead/get`;
        }
        if (userrole === "superAdmin") {
          url = `/api/Lead/get`;
        } else if (userrole === "FOS") {
          url = `/api/Lead/FOS/${userid}`;
        } else if (userrole === "BussinessHead") {
          url = `/api/Lead/hiearchy?role=ATL&userid=${userid}`;
        } else if (userrole === "PNL") {
          url = `/api/Lead/hiearchy?role=PNL&userid=${userid}`;
        } else if (userrole === "TL") {
          url = `/api/Lead/hiearchy?role=TL&userid=${userid}`;
        } else if (userrole === "ATL") {
          url = `/api/Lead/hiearchy?role=ATL&userid=${userid}`;
        }
        const response = await axios.get(url);
        
        
        const leadArray = []
        
        response.data.data.map((lead, index)=>{
            if(lead.LeadStatus._id == '669901be09b3b0c976dabedf'){
                leadArray.push(lead)
            }
        })
        setNewLeads(leadArray.length )
        
        
        
        const followUpLeads = response.data.data.filter(
          (lead) => lead.LeadStatus === "Follow up"
        );
        const intretsedLeads = response.data.data.filter(
          (lead) => lead.LeadStatus === "Intrested"
        );
        settLeads(response.data.data.length);
        settfollow(followUpLeads.length);
        settintrested(intretsedLeads.length);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchLead();
  }, [userrole]);
 
  console.log(newLeads, 'new Leads')
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const chartData = {
    labels: monthNames,
    datasets: [
      {
        data: [617594, 181045, 153060, 106519, 105162, 95072],
        //backgroundColor:'green',
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(75,192,192,0.4)");
          gradient.addColorStop(1, "rgba(75,192,192,0)");
          return gradient;
        },
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
  };
  const [dealCards, setDealCards] = useState([]);

  useEffect(() => {
    setDealCards([
      {
        id: 0,
        name: "Number of Deals",
        subName: "Your`s",
        data: sales,
        type: null,
        subData: yourDeals,
        color: "#D8EFD3",
        show: false,
      },
      {
        id: 1,
        name: "CRM Usage",
        subName: "Your`s",
        type: null,
        data: 20,
        subData: 30,
        color: "#D2E0FB",
        show: false,
      },
      {
        id: 2,
        name: "Sales Value",
        subName: "Your`s",
        type: "AED",
        data: tsales,
        subData: personalSales,
        color: "#FFF2D7",
        show: false,
      },
      {
        id: 3,
        name: "Sales Revenue",
        subName: "Your`s",
        type: "AED",
        data: 204054545,
        subData: 85433,
        color: "#CAF4FF",
        show: false,
      },
    ]);
    console.log(sales);
  }, [sales, yourDeals, tsales, personalSales]);

  const leadData = [
    { id: 0, name: "Total Leads", data: tLeads },
    { id: 1, name: "New Leads", data: newLeads },
    { id: 2, name: "Total Intrested", data: tintrested },
    { id: 3, name: "Total Follow Up", data: tfollow },
  ];
  const toggleCardShow = (id, e) => {
    setDealCards((prevState) =>
      prevState.map((card) =>
        card.id === id ? { ...card, show: !card.show } : card
      )
    );
    e.stopPropagation();
  };
  const toggleParentCardShow = (id) => {
    setDealCards((prevState) =>
      prevState.map((card) =>
        card.id === id ? { ...card, show: !card.show } : card
      )
    );
  };

  const formatNumber = (value, index) => {
    if (index === 0) {
      return value;
    } else {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else {
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      }
    }
  };
  const [revenueAnalytics, setRevenueAnalytics] = useState(false);
  return (
    <RootLayout>
      <div className="  flex justify-end  w-full mt-20   !px-0">
        <div className=" tablet:w-[calc(100%-100px)] mobile:w-full h-full">
          <div className=" w-full px-4 py-4 h-full">
            <p className="font-Satoshi tablet:text-lg mobile:text-lg text-black font-bold">
              Dashboard
            </p>
            <div className="w-full tablet:mt-6 mobile:mt-5">
              <div className="grid w-full tablet:grid-cols-4 mobile:grid-cols-2 mobile:gap-y-4 tablet:gap-x-5 mobile:gap-x-2 justify-center">
                {dealCards.map((deal, index) => {
                  return (
                    <div
                      key={index}
                      className={`tablet:py-4 mobile:py-2 cursor-pointer text-gray-900 px-3 hover:shadow-md transition-all group duration-200   w-full flex flex-col justify-start tablet:gap-4 mobile:gap-3 rounded-2xl `}
                      style={{ backgroundColor: deal.color }}
                      onClick={() => toggleParentCardShow(deal.id)}
                    >
                      <div className="flex items-center">
                        <p className="font-Satoshi inline-block !mb-0 tablet:text-lg w-full mobile:text-md font-[500] relative group-hover:after:absolute group-hover:after:border-black group-hover:after:h-3  after:transition-all after:duration-300 group-hover:after:content-[''] group-hover:after:top-0 group-hover:after:left-0 group-hover:after:w-full after:w-0 ">
                          {deal.name}{" "}
                          <span className="font-Satoshi mobile:text-sm  tablet:ml-1">
                            {deal.type == "AED" ? `[${deal.type}]` : ""}{" "}
                          </span>
                        </p>

                        <motion.div
                          onClick={(e) => toggleCardShow(deal.id, e)}
                          className={`w-12 h-6 flex justify-start items-center px-[2px] py-[2px] cursor-pointer  rounded-full ${
                            deal.show ? "bg-green-400" : "bg-gray-400"
                          } `}
                        >
                          <motion.div
                            animate={{ x: deal.show ? "95%" : 0 }}
                            className="size-5 rounded-full bg-white"
                          ></motion.div>
                        </motion.div>
                      </div>

                      <p className="!mb-0">
                        <motion.span
                          className={`  after:h-full transition duration-150  tablet:text-4xl mobile:text-xl font-[500] inline-block font-Ranade tracking-tight`}
                        >
                          {deal.show ? formatNumber(deal.data, index) : "*****"}
                        </motion.span>
                        {deal.show ? (
                          <span className="font-Satoshi mobile:text-sm tablet:text-4xl">
                            {deal.type == "%" ? deal.type : ""}{" "}
                          </span>
                        ) : null}
                      </p>
                      <p className="mobile:text-md tablet:text-md !mb-0">
                        <span className="font-[600] mobile:!text-sm tablet:!text-lg">
                          {deal.subName}
                        </span>{" "}
                        :{" "}
                        <span
                          className={`font-Ranade mobile:text-[14px]     transition-all duration-300   tablet:text-lg font-[500]`}
                        >
                          {deal.show
                            ? formatNumber(deal.subData, index)
                            : "***"}
                        </span>
                        {deal.show ? (
                          <span className="font-Satoshi mobile:text-sm tablet:ml-1 font-[500] tablet:text-md">
                            {deal.type == "%" ? deal.type : ""}{" "}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid  tablet:grid-cols-2 mobile:grid-cols-1 tablet:gap-x-5 mobile:gap-y-2 justify-center w-full mt-3">
              <div className="py-4 px-4 bg-white font-Satoshi grid  grid-cols-1 rounded-2xl font-[500]">
                <p className="tablet:text-lg mobile:text-xl">
                  Top 3 Developers
                </p>
                <div className="w-full flex  gap-4 justify-center h-fit py-2 ">
                  <div className="w-full flex flex-col justify-center gap-3">
                    {topdeveloper?.map((dev, index) => {
                      return (
                        <div
                          key={index}
                          className={`flex w-full  items-center ${
                            index == topdeveloper.length - 1
                              ? "border-0"
                              : "border-b"
                          } pt-2 pb-4 justify-between`}
                        >
                          <div className="flex w-full items-center gap-3">
                            <p className="!mb-0 tablet:text-2xl mobile:text-lg">{index+1}.)</p>
                            <p className="!mb-0 tablet:text-2xl mobile:text-lg">
                              {dev.name}
                            </p>
                          </div>
                          <div className="w-auto flex items-center text-right gap-2">
                            <p className="font-[600] !mb-0 tablet:!text-2xl mobile:!text-sm">
                              {dev.deals}
                            </p>
                            <p className="tablet:!text-lg mobile:!text-sm !mb-0">
                              Leads
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className=" flex  tablet:h-auto justify-center items-center bg-white rounded-xl w-full">
                <div className=" w-full py-4 px-4">
                  <div className="flex items-center">
                    {" "}
                    <p
                      className={`!mb-0 !mt-0 font-Satoshi font-[500] w-full tablet:text-lg mobile:text-xl`}
                      ref={revenueRef}
                    >
                      Revenue Analytics
                    </p>
                    <motion.div
                      onClick={() => setRevenueAnalytics(!revenueAnalytics)}
                      className={`w-12 h-6 flex justify-start items-center px-[2px] py-[2px] cursor-pointer  rounded-full ${
                        revenueAnalytics ? "bg-green-400" : "bg-gray-400"
                      } `}
                    >
                      <motion.div
                        animate={{ x: revenueAnalytics ? "98%" : 0 }}
                        className="size-5 rounded-full bg-white"
                      ></motion.div>
                    </motion.div>
                  </div>

                  <Line
                    style={{
                      height: `calc(100% - ${
                        revenueRef.current
                          ? revenueRef.current.clientHeight + "px"
                          : "0px"
                      })`,
                    }}
                    data={{
                      labels: monthNames,
                      datasets: [
                        {
                          data: revenueAnalytics ? graphData : 0,
                          fill: true,
                          tension: 0.6,
                          label: "Revenue",
                          backgroundColor: (ctx) => {
                            const gradient = ctx.chart.ctx.createLinearGradient(
                              0,
                              90,
                              0,
                              400
                            );
                            gradient.addColorStop(0, "rgba(254, 56, 158, 0.8)");
                            gradient.addColorStop(
                              1,
                              "rgba(255, 163, 211, 0.4)"
                            );
                            return gradient;
                          },
                        },
                      ],
                    }}
                    options={options}
                  />
                </div>
              </div>
            </div>
            <div className="grid w-full mt-3 tablet:grid-cols-4 mobile:grid-cols-2 gap-x-5 gap-y-4 justify-center">
              {leadData.map((lead, index) => {
                return (
                  <div
                    key={index}
                    className={`tablet:py-3 mobile:py-2  text-gray-900 px-3 hover:shadow-md bg-white transition-all group duration-200 cursor-pointer w-full flex flex-col justify-start tablet:gap-4 mobile:gap-3 rounded-2xl `}
                  >
                    <p className="font-Satoshi inline-block !mb-0 tablet:text-lg w-full mobile:text-md font-[500] relative group-hover:after:absolute group-hover:after:border-black group-hover:after:h-3  after:transition-all after:duration-300 group-hover:after:content-[''] group-hover:after:top-0 group-hover:after:left-0 group-hover:after:w-full after:w-0 ">
                      {lead.name}
                    </p>
                    <p className="!mb-0 py-2 tablet:text-2xl mobile:text-lg">
                      <span className="tablet:text-4xl mobile:text-xl font-[500] inline-block font-Ranade tracking-tight">
                        <AnimatedNumbers
                          transitions={(index) => ({
                            type: "spring",
                            duration: index + 0.3,
                          })}
                          animateToNumber={parseFloat(lead.data)}
                          includeComma={true}
                        />
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>{" "}
            <div className="grid tablet:grid-cols-3 mobile:grid-cols-1 gap-x-5 gap-y-4  justify-center w-full mt-3">
              <div className="py-4 px-4 bg-white font-Satoshi h-auto tablet:col-span-2 mobile:col-span-1 rounded-2xl font-[500]">
                <Calendar />
              </div>

              <div className="py-4 px-4 bg-white rounded-xl w-full ">
                <p className="text-xl !mb-0 tablet:text-2xl mobile:text-xl font-[500] font-Satoshi">
                  Acitivity Status
                </p>
                <div className="w-full mt-4 py-3 flex justify-between border-b border-slate-400 items-center gap-3">
                  <div className="tablet:size-10 mobile:size-8 rounded-full bg-gray-300"></div>
                  <div className="">
                    <p className="!mb-0  mobile:text-sm laptop:text-sm  bigDisplay:text-lg">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do
                    </p>
                    <p className="!mb-0 mobile:text-sm laptop:text-sm  bigDisplay:text-lg">
                      28-05-2024
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}

export default ProfilePage;
