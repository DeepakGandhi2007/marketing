"use client";
import React from "react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import RootLayout from "@/app/components/layout";
import SearchableSelect from "@/app/Leads/dropdown";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from "next/navigation";
import { LuPlus } from "react-icons/lu";
import { ImPlus } from "react-icons/im";
import { FaRegEye } from "react-icons/fa";
import TokenDecoder from '../components/Cookies';
import { IoMdClose } from "react-icons/io";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";

function Invoice() {
  const router = useRouter();
  const[submitting, setSubmitting] = useState(false)
  const [myData, setMyData] = useState([]);
  const [formCounter, setFormCounter] = useState(1);
  const [buyerKycImages, setBuyerKycImages] = useState([[
  ]]);
  const [buyerKycImages1, setBuyerKycImages1] = useState([
    [],
  ]);
  const [extraBuyers, setExtraBuyers] = useState([]);
  const [orgData, setOrgData] = useState([]);
  const [buyerImagesApi1, setBuyerImagesApi1] = useState([[null, null, null, null]]);
  const [buyerImagesApi2, setBuyerImagesApi2] = useState([[null, null, null, null]]);
    
  const toggleInputType = () => {
    setIsDateInput((prevIsDateInput) => !prevIsDateInput);
  };
 const [isDateInput, setIsDateInput] = useState(false);
  const options1 = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];
    const [submitError, setSubmitError] = useState(false)
  const searchParams = useSearchParams();

  const leadId = searchParams.get("leadId");
  
  console.log(formCounter);
    
  useEffect(() => {
    axios
      .get("/api/invoice/get")
      .then((resp) => {
        const data = resp?.data?.data;
        const buyerData = data.filter((buyer) => buyer._id === leadId);

        const imagesArrays = [];
        let imageIndex = 0; // Track the current index of buyerImages

        buyerData[0].additionalBuyers.forEach((buyer, index) => {
          const imagesArray = [];
          const numberOfImages = buyer?.Resident === "Yes" ? 4 : 3;
          const startIndex = imageIndex; // Start index should be the current value of imageIndex
          const endIndex = Math.min(
            startIndex + numberOfImages,
            buyerData[0].buyerImages.length
          );

          for (let i = startIndex; i < endIndex; i++) {
            imagesArray.push(buyerData[0].buyerImages[i]);
            imageIndex++; // Increment imageIndex for each included image
          }

          imagesArrays.push(imagesArray);
          
        });

        const kycImages2 = [];

        const imagesPerBuyer = 4;

        buyerData[0].additionalBuyers.forEach((buyer, index) => {
          const startIndex = index * imagesPerBuyer;
          const endIndex = startIndex + imagesPerBuyer;
          const imagesArray = buyerData[0]?.additinalkyc.slice(
            startIndex,
            endIndex
          );
          kycImages2.push(imagesArray);
        });

        setBuyerImagesApi2(imagesArrays);
        setBuyerKycImages1(kycImages2);
        setMyData(buyerData);
        setOrgData(buyerData);
        setExtraBuyers(buyerData[0]?.additionalBuyers);
      
      })
      .catch((err) => console.log(err));
  }, []);
  
  const path = "https://crm-milestonehomes.com/public/kyc/";

    const [buyerExtraDocs, setBuyerExtraDocs] = useState([[null, null, null, null]])
  useEffect(() => {
    if (orgData && orgData.length > 0) {
      const passFront1 = orgData[0]?.passfront?.split("kyc/");
      const passBack1 = orgData[0]?.passback?.split("kyc/");
      const visa = orgData[0]?.visaphoto?.split("kyc/");
      const emirates =
        orgData[0]?.emiratephoto != "" && orgData[0]?.emiratephoto != null
          ? orgData[0]?.emiratephoto?.split("kyc/")
          : " ";
      setBuyerImagesApi1([
        [path + passFront1[1], path + passBack1[1], path + visa[1] ,path + emirates[1]],
      ]);
    }
  }, [orgData]);

  useEffect(() => {
    if (orgData && orgData.length > 0) {
      const eoiimage = orgData[0]?.eoiimage?.split("kyc/");
      const bookingmage = orgData[0]?.bookingmage?.split("kyc/");
      const SPAmage =
        orgData[0]?.SPAmage != "" && orgData[0]?.SPAmage != null
          ? orgData[0]?.SPAmage?.split("kyc/")
          : " ";
      setBuyerExtraDocs([
        [path + eoiimage[1], path + bookingmage[1],path + SPAmage[1] ],
      ]);
    }
  }, [orgData]);
  
  useEffect(() => {
    if (orgData && orgData.length > 0) {
      const kyc1 = orgData[0]?.KYCimage != "" && orgData[0]?.KYCimage != null
          ? orgData[0]?.KYCimage?.split("kyc/")
          : " ";
      const unSanction = orgData[0]?.Sanctionimage != "" && orgData[0]?.Sanctionimage != null
          ? orgData[0]?.Sanctionimage?.split("kyc/")
          : " ";
      const riskform =
        orgData[0]?.Riskimage != "" && orgData[0]?.Riskimage != null
          ? orgData[0]?.Riskimage?.split("kyc/")
          : " ";
         const uaeSanction =
        orgData[0]?.UNimage != "" && orgData[0]?.UNimage != null
          ? orgData[0]?.UNimage?.split("kyc/")
          : " ";
        
      setBuyerKycImages([
        [path + kyc1[1] != null ? path+ kyc1[1] : '', path + unSanction[1] != null ? path+unSanction[1] :'', path + riskform[1] != null ? path+riskform[1] :'', path+uaeSanction[1] != null ? path+uaeSanction[1] : ''],
      ]);
    }
  }, [orgData]);
 
    
    
  const handleFileChange1 = (index, fileIndex, files) => {
    setBuyerKycImages((prev) => {
      const updatedImages = [...prev];
      updatedImages[index] = [...(updatedImages[index] || [])];
      updatedImages[index][fileIndex] = files[0];
      return updatedImages;
    });
  };
  
  const handleExtraDocs = (index, fileIndex, files) => {
    setBuyerExtraDocs((prev) => {
      const updatedImages = [...prev];
      updatedImages[index] = [...(updatedImages[index] || [])];
      updatedImages[index][fileIndex] = files[0];
      return updatedImages;
    });
  };
  
  
  
  const handleFileChange2 = (index, fileIndex, files) => {
    setBuyerKycImages1((prev) => {
      const updatedImages = [...prev];
      updatedImages[index] = [...(updatedImages[index] || [])];
      updatedImages[index][fileIndex] = files[0];
      return updatedImages;
    });
  };

  const handleApiFileChange1 = (index, fileIndex, files) => {
    setBuyerImagesApi1((prev) => {
      const updatedImages = [...prev];
      updatedImages[index] = [...(updatedImages[index] || [])];
      updatedImages[index][fileIndex] = files[0];
      return updatedImages;
    });
  };

  const handleApiFileChange2 = (index, fileIndex, files) => {
    setBuyerImagesApi2((prev) => {
      const updatedImages = [...prev];
      updatedImages[index] = [...(updatedImages[index] || [])];
      updatedImages[index][fileIndex] = files[0];
      return updatedImages;
    });
  };

  const data = {
    buyerOneData: myData,
    additionalBuyers: extraBuyers,
  };
 
  const HandleSubmit = async (e) => {
      setSubmitting(true)
      const imagePromises = [];
       e.preventDefault()
   

    // Convert buyerKycImages to Base64
    const buyerImagesBase64 = buyerKycImages.map((images) =>
      images.map((image) => {
        if (image instanceof File) {
          const reader = new FileReader();
          reader.readAsDataURL(image);
          return new Promise((resolve) => {
            reader.onloadend = () => {
              resolve(reader.result);
            };
          });
        } else {
          return Promise.resolve(image); // If not a File, assume it's already a link
        }
      })
    );
    buyerKycImages.forEach((images, index) => {
    images.forEach((image) => {
      if (typeof image === 'string' && image.includes('https://crm-milestonehomes.com/public/kyc/undefined')) {
        toast.error("Buyer KYC / Customer Due Diligence are Mandatory Fields");
        setSubmitError(true);
        window.location.reload();
      }
    });
  });
  

    // Convert buyerKycImages1 to Base64
  const buyerImages1Base64 = buyerKycImages1.map((innerArray) => {
  if (Array.isArray(innerArray) && innerArray.length > 0) {
    return innerArray.map((image) => {
      if (image instanceof File) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        return new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
        });
      } else {
        return Promise.resolve(image); // If not a File, assume it's already a link
      }
    });
  } else {
    return []; // Return an empty array if innerArray is not defined or empty
  }
});



    const buyerRegImagesBase64 = buyerImagesApi1.map((innerArray) =>
      innerArray.map((image) => {
        if (image instanceof File) {
          const reader = new FileReader();
          reader.readAsDataURL(image);
          return new Promise((resolve) => {
            reader.onloadend = () => {
              resolve(reader.result);
            };
          });
        } else {
          return Promise.resolve(image); // If not a File, assume it's already a link
        }
      })
    );
    const extraDocsBase64 = buyerExtraDocs.map((innerArray) =>
      innerArray.map((image) => {
        if (image instanceof File) {
          const reader = new FileReader();
          reader.readAsDataURL(image);
          return new Promise((resolve) => {
            reader.onloadend = () => {
              resolve(reader.result);
            };
          });
        } else {
          return Promise.resolve(image); // If not a File, assume it's already a link
        }
      })
    );

    // Convert buyerImagesApi2[0] to Base64

    const buyerAdditionRegImages1Base64 = buyerImagesApi2.map((innerArray) =>
      innerArray.map((image) => {
        if (image instanceof File) {
          const reader = new FileReader();
          reader.readAsDataURL(image);
          return new Promise((resolve) => {
            reader.onloadend = () => {
              resolve(reader.result);
            };
          });
        } else {
          return Promise.resolve(image); // If not a File, assume it's already a link
        }
      })
    );

    // Flatten the nested arrays and push to imagePromises
    imagePromises.push(Promise.all(buyerImagesBase64.flat()));
    imagePromises.push(Promise.all(buyerImages1Base64.flat()));
    imagePromises.push(Promise.all(buyerAdditionRegImages1Base64.flat()));
    imagePromises.push(Promise.all(buyerRegImagesBase64.flat()));
    imagePromises.push(Promise.all(extraDocsBase64.flat()));

    // Wait for all Base64 conversion to finish
    const resolvedImages = await Promise.all(imagePromises);

    const imageData = {
      buyerOneKycImages: resolvedImages[0],
      additionalBuyerKycImages: resolvedImages[1],
      buyerRegImages: resolvedImages[3],
      additionalbuyerRegImages: resolvedImages[2],
      extraDocsImages: resolvedImages[4],
    };

    const updatedData = {
      ...data,
    };

     try {
      const response = await axios.put(
        `/api/invoice/update/${leadId}`,
        {
          buyerImages1Base64: imageData,
          data: updatedData,
        }
      );
       
    setFormCounter((curr) => curr + 1);
    } catch (error) {
      console.error(error);
      setSubmitError(true)
    }
   setSubmitting(false)
  };

  const updateLead = async () => {
    try {
      const response = await axios.put(`/api/invoice/update/${leadId}`);
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };
  const [showPassFront, setShowpassFront] = useState(false);
  const [showPassback, setShowpassBack] = useState(false);
  const [showemirates, setShowemirates] = useState(false);
  const [showEOI, setShowEOI] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showSPA, setShowSPA] = useState(false);
const [showVisa1, setShowVisa1] = useState(false);
const [showVisa2, setShowVisa2] = useState(false);
  const [showKyc1, setShowKyc1] = useState(false);
  const [showRiskForm1, setShowRiskForm1] = useState(false);
  const [showUnSanction1, setShowUnSanction1] = useState(false);
  const [showUaeSanction1, setShowUaeSanction1] = useState(false);
  const [showKyc2, setShowKyc2] = useState(false);
  const [showRiskForm2, setShowRiskForm2] = useState(false);
  const [showUnSanction2, setShowUnSanction2] = useState(false);
  const [showUaeSanction2, setShowUaeSanction2] = useState(false);
  const [showPassFront1, setShowpassFront1] = useState(false);
  const [showPassback1, setShowpassBack1] = useState(false);
  const [showemirates1, setShowemirates1] = useState(false);
  const decodedToken = TokenDecoder();
  const approvedBy = decodedToken ? decodedToken.id : null;
  const [finalReason, setFinalReason] = useState('')
  const approved = async () => {
        try {
                await axios.put(`/api/invoice/status/${myData[0]._id}`, { status: 50, approvedBy, Resons:finalReason })
                window.location.href = 'http://crm-milestonehomes.com:8080/KYC-and-Sanctions';
            }

         catch (error) {
            console.error('Error updating lead status:', error);
        }
        
    };
  const Reject = async () => {
        try {
             
                await axios.put(`/api/invoice/status/${myData[0]._id}`, { status: 51, approvedBy, Resons:finalReason })
                window.location.href = 'http://crm-milestonehomes.com:8080/KYC-and-Sanctions';
            }

         catch (error) {
            console.error('Error updating lead status:', error);
        }
    };
   const isDisabled = extraBuyers.some(buyer => {return(!buyer.buyername || !buyer.buyerContact || !buyer.buyerEmail || !buyer.buyerdob || !buyer.buyerpassport || !buyer.nationality || !buyer.address 
 )});
    const handleKeyDown = (event) => {
    event.preventDefault();
  };
  
  
  
    
    
  return (
    <RootLayout>
      <div className={`w-full mt-4`}>
        <div className={`w-full relative`}>
          <div className="w-full flex justify-center  items-center">
            <div className=" w-full flex flex-col justify-center items-center">
              <div className="bg-blue w-full ">
                <h4 className="text-white mb-0 text-center">Deal Type</h4>
              </div>
              {formCounter === 1 && (
                <form action={HandleSubmit} className="w-full max-w-[85%] mt-3 !bg-transparent">
                  <Accordion allowZeroExpanded>
                    {myData.map((buyer, index) => {
                      return (
                        <AccordionItem key={index} className="mt-4">
                          <AccordionItemHeading className="bg-white !border !border-gray-400 rounded-md py-2 px-2">
                            <AccordionItemButton className="flex w-full justify-between items-center">
                              Buyer {index + 1}
                              <ImPlus className="!mb-0"/>
                            </AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div className="grid grid-cols-2 gap-x-5 gap-y-3 mt-4">
                              <div className="">
                                <label className="!mb-0">
                                  Full name{" "}
                                  <span className="text-red-500 !mb-0">
                                      *
                                    </span>
                                </label>
                                <input
                                  className="form-control"
                                  required
                                  type="text"
                                  value={buyer?.buyername}
                                  onChange={(e) =>
                                    setMyData(
                                      myData.map((item) => ({
                                        ...item,
                                        buyername: e.target.value,
                                      }))
                                    )
                                  }
                                  placeholder="Buyer Cutomer Name"
                                />
                              </div>
                              <div className="">
                                <label className="!mb-0">
                                  Phone{" "}
                                  <span className="text-red-500 !mb-0">
                                      *
                                    </span>
                                </label>
                                <input
                                  className="form-control"
                                  type="number"
                                  required
                                  value={buyer?.buyerContact}
                                  onChange={(e) =>
                                    setMyData(
                                      myData.map((item) => ({
                                        ...item,
                                        buyerContact: e.target.value,
                                      }))
                                    )
                                  }
                                  placeholder="Contact Number"
                                />
                              </div>
                              <div className="">
                                <label className="!mb-0">
                                  Email{" "}
                                  
                                </label>
                                <input
                                  className="form-control"
                                  required
                                  value={buyer?.buyerEmail}
                                  onChange={(e) =>
                                    setMyData(
                                      myData.map((item) => ({
                                        ...item,
                                        buyerEmail: e.target.value,
                                      }))
                                    )
                                  }
                                  placeholder="Email"
                                />
                              </div>

                              <div className="">
                                <label className="!mb-0">
                                  Date of Birth{" "}
                                  <span className="text-red-500 !mb-0">
                                        *
                                      </span>
                                </label>
                                <input
                                  className="form-control"
                                  required
                                  type="date"
                                  onKeyDown={handleKeyDown}
                                  onFocus={toggleInputType}
                                  value={buyer?.buyerdob}
                                  onChange={(e) =>
                                    setMyData(
                                      myData.map((item) => ({
                                        ...item,
                                        buyerdob: e.target.value,
                                      }))
                                    )
                                  }
                                  placeholder="Date of Closure"
                                  max={new Date().toISOString().split("T")[0]}
                                />
                              </div>

                              <div className="">
                                <label className="!mb-0">
                                  Passport Number{" "}
                                  <span className="text-red-500 !mb-0">
                                        *
                                      </span>
                                </label>
                                <input
                                  className="form-control"
                                  required
                                  type="text"
                                  value={buyer?.buyerpassport}
                                  onChange={(e) =>
                                    setMyData(
                                      myData.map((item) => ({
                                        ...item,
                                        buyerpassport: e.target.value,
                                      }))
                                    )
                                  }
                                  placeholder="Passport Number"
                                />
                              </div>

                              <div className="">
                                <label className="!mb-0">
                                  Passport Expiry{" "}
                                  <span className="text-red-500 !mb-0">
                                        *
                                      </span>
                                </label>
                                <input
                                  className="form-control"
                                  required
                                  type="date"
                                  onKeyDown={handleKeyDown}
                                  onFocus={toggleInputType}
                                  value={buyer?.passportexpiry}
                                  onChange={(e) =>
                                    setMyData(
                                      myData.map((item) => ({
                                        ...item,
                                        passportexpiry: e.target.value,
                                      }))
                                    )
                                  }
                                  placeholder="Emirates Expiry"
                                  min={new Date().toISOString().split("T")[0]}
                                />
                              </div>
                              <div className="">
                                <label className="!mb-0">
                                  Nationality{" "}
                                  <span className="text-red-500 !mb-0">
                                        *
                                      </span>
                                </label>
                                <input
                                  className="form-control"
                                  value={buyer?.nationality}
                                  required
                                  type="text"
                                  onChange={(e) =>
                                    setMyData(
                                      myData.map((item) => ({
                                        ...item,
                                        nationality: e.target.value,
                                      }))
                                    )
                                  }
                                  placeholder="Nationality"
                                />
                              </div>
                              <div className="">
                                <label className="!mb-0">
                                  UAE Resident/Non Resident{" "}
                                  <span className="text-red-500 !mb-0">
                                        *
                                      </span>
                                </label>

                                <SearchableSelect
                                  options={options1}
                                    disabled
                                  className={`form-control disabled:!bg-slate-200`}
                                  defaultValue={buyer?.Resident}
                                  value={buyer?.Resident}
                                    
                                ></SearchableSelect>
                              </div>
                              <div className="">
                                <label className="!mb-0">Emirates ID </label>
                                <input
                                  disabled
                                  className={`form-control disabled:!bg-gray-200`}
                                  type="text"
                                  placeholder="Emirates ID"
                                  value={buyer?.emiratesid}
                                />
                              </div>
                              <div className="">
                                <label className="!mb-0">Emirates Expiry</label>
                                <input
                                  type="date"
                                  onKeyDown={handleKeyDown}
                                  onFocus={toggleInputType}
                                  value={buyer?.emiratesExpiry}
                                  placeholder="Emirates Expiry"
                                  min={new Date().toISOString().split("T")[0]}
                                  disabled
                                  className={`form-control disabled:!bg-gray-200`}
                                />
                              </div>

                              <div className="col-span-2">
                                <label className="!mb-0">
                                  Address{" "}
                                  <span className="text-red-500 !mb-0">
                                        *
                                      </span>
                                </label>
                                <input
                                  className="form-control"
                                  required
                                  type="text"
                                  onChange={(e) =>
                                    setMyData(
                                      myData.map((item) => ({
                                        ...item,
                                        address: e.target.value,
                                      }))
                                    )
                                  }
                                  value={buyer?.address}
                                  placeholder="Address"
                                />
                              </div>
                            </div>
                            <div className="w-full mt-4">
                              <div className="w-full flex items-center justify-between ">
                                <p className="w-full relative overflow-hidden block text-xl font-bold">
                                  <span className='block relative after:content-[" "] align-baseline  after:absolute after:w-full after:h-2 after:border-t-4 after:ml-3 after:border-slate-400 after:top-[50%]'>
                                    Documents to Upload
                                  </span>
                                </p>
                              </div>
                              <div className="w-full grid grid-cols-2 gap-x-5 gap-y-3">
                                <div>
                                  <div className="flex  gap-3">
                                    <p className="block mb-0 text-lg font-medium  text-gray-900 leading-normal w-[200px]">
                                      Buyer's Passport{" "}
                                      <span className="text-red-500 !mb-0">
                                        *
                                      </span>
                                    </p>
                                    <div>
                                      <div className="flex items-center gap-2 ">
                                        <div className="input-group relative">
                                            <p className={`text-gray-700 !mr-2` }>Front:</p>
                                          <div className="relative">
                                            <input
                                              type="text"
                                              className="px-2"
                                              placeholder="Front"
                                              readOnly
                                              required
                                              value={
                                                buyerImagesApi1[0] &&
                                                buyerImagesApi1[0][0] &&
                                                buyerImagesApi1[0][0]?.name
                                                  ? buyerImagesApi1[0][0]?.name
                                                  : buyerImagesApi1[0][0]
                                                      ?.split("kyc/")
                                                      .pop()
                                              }
                                            />
                                            <label
                                              for="front"
                                              className="absolute !bg-slate-50  px-1 !mb-0 cursor-pointer text-xl right-0 mx-auto my-auto"
                                            >
                                              <LuPlus />
                                            </label>
                                          
                                          </div>

                                          <input
                                            onChange={(e) =>
                                              handleApiFileChange1(
                                                0,
                                                0,
                                                e.target.files
                                              )
                                            }
                                            className="!hidden  text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                            aria-describedby="file_input_help"
                                            id="front"
                                            type="file"
                                            accept=".jpg, .jpeg, .png, .pdf"
                                            
                                          />
                                          <FaRegEye
                                            className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                            onClick={() =>
                                              setShowpassFront(true)
                                            }
                                          />

                                       {showPassFront && (
                                          <div className="!flex !flex-col gap-2 w-full !h-screen !rounded-md h-screen fixed items-end top-0 left-0 z-[9999]">
                                            <div className={`w-full h-full aspect-auto bg-slate-800/20`}>
                                              <div className='flex justify-end w-full'>
                                                <IoMdClose
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300 !text-gray-900"
                                                  onClick={() => setShowpassFront(false)}
                                                />
                                              </div>
                                              <div className="w-full h-full flex justify-center items-center">
                                                <div className="w-full !h-screen flex justify-center items-start overflow-auto">
                                                 {buyerImagesApi1[0][0] ? (
          // Check if it's a file object (assuming buyerImagesApi1[0][0] is a File object)
                                                          buyerImagesApi1[0][0] instanceof File && buyerImagesApi1[0][0].name ? (
                                                            buyerImagesApi1[0][0].name.endsWith('.pdf') ? (
                                                              // Render PDF if it's a PDF file
                                                              <embed
                                                                src={URL.createObjectURL(buyerImagesApi1[0][0])}
                                                                type="application/pdf"
                                                                className="w-[90%] !h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if it's an image file
                                                              <img
                                                                src={URL.createObjectURL(buyerImagesApi1[0][0])}
                                                                alt="Image"
                                                                className="w-auto "
                                                              />
                                                            )
                                                          ) : (
                                                            // Assume it's a URL, check extension from the URL
                                                            buyerImagesApi1[0][0].endsWith('.pdf') ? (
                                                              // Render PDF if URL ends with .pdf
                                                              <embed
                                                                src={buyerImagesApi1[0][0]}
                                                                type="application/pdf"
                                                                className="w-[90%] h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if URL ends with .jpg or .jpeg (adjust as needed)
                                                              <img
                                                                src={buyerImagesApi1[0][0]}
                                                                alt="Image"
                                                                className="w-auto"
                                                              />
                                                            )
                                                          )
                                                        ) : null}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}


                                        </div>
                                      </div>

                                      <div className="flex items-top gap-2 mt-2">
                                        <div className="input-group relative">
                                        <p className={`text-gray-700 !mr-2` }>Back:&nbsp;</p>
                                          <div className="relative">
                                            <input
                                              type="text"
                                              className="px-2"
                                              placeholder="Back"
                                              readOnly
                                              value={
                                                buyerImagesApi1[0] &&
                                                buyerImagesApi1[0][1] &&
                                                buyerImagesApi1[0][1]?.name
                                                  ? buyerImagesApi1[0][1]?.name
                                                  : buyerImagesApi1[0][1]
                                                      ?.split("kyc/")
                                                      .pop()
                                              }
                                            />
                                            <label
                                              for="back"
                                              className="absolute px-1 !bg-slate-50 !mb-0 cursor-pointer text-xl right-0 mx-auto my-auto"
                                            >
                                              <LuPlus />
                                            </label>
                                          </div>
                                          <input
                                            onChange={(e) =>
                                              handleApiFileChange1(
                                                0,
                                                1,
                                                e.target.files
                                              )
                                            }
                                            className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                            aria-describedby="file_input_help"
                                            id="back"
                                            type="file"
                                             accept=".jpg, .jpeg, .png, .pdf"
                                          />
                                          <FaRegEye
                                            className="absolute  cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                            onClick={() =>
                                              setShowpassBack(true)
                                            }
                                          />
                                          {showPassback && (  
                                               <div className="!flex !flex-col gap-2 w-full !h-screen !rounded-md h-screen fixed items-end top-0 left-0 z-[9999]">
                                            <div className={`w-full h-full aspect-auto bg-slate-800/20`}>
                                              <div className='flex justify-end w-full'>
                                                <IoMdClose
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300 !text-gray-900"
                                                  onClick={() => setShowpassBack(false)}
                                                />
                                              </div>
                                              <div className="w-full h-full flex justify-center items-center">
                                                <div className="max-w-full max-h-full overflow-auto">
                                                 {buyerImagesApi1[0][1] ? (
          // Check if it's a file object (assuming buyerImagesApi1[0][0] is a File object)
                                                          buyerImagesApi1[0][1] instanceof File && buyerImagesApi1[0][1].name ? (
                                                            buyerImagesApi1[0][1].name.endsWith('.pdf') ? (
                                                              // Render PDF if it's a PDF file
                                                              <embed
                                                                src={URL.createObjectURL(buyerImagesApi1[0][1])}
                                                                type="application/pdf"
                                                                className="w-[90%] !h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if it's an image file
                                                              <img
                                                                src={URL.createObjectURL(buyerImagesApi1[0][1])}
                                                                alt="Image"
                                                                className="w-auto "
                                                              />
                                                            )
                                                          ) : (
                                                            // Assume it's a URL, check extension from the URL
                                                            buyerImagesApi1[0][1].endsWith('.pdf') ? (
                                                              // Render PDF if URL ends with .pdf
                                                              <embed
                                                                src={buyerImagesApi1[0][1]}
                                                                type="application/pdf"
                                                                className="w-[90%] h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if URL ends with .jpg or .jpeg (adjust as needed)
                                                              <img
                                                                src={buyerImagesApi1[0][1]}
                                                                alt="Image"
                                                                className="w-auto"
                                                              />
                                                            )
                                                          )
                                                        ) : null}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {buyer?.Resident == "" ||
                                buyer?.Resident == "No" ? null : (
                                  <div>
                                    <div className="flex items-center gap-4">
                                      <p className="block text-lg mb-0 leading-normal font-medium text-gray-900 w-[195px]">
                                        Emirates ID{" "}
                                        <span className="text-red-500 !mb-0">
                                          *
                                        </span>
                                      </p>
                                      <div>
                                        <div className="flex items-center relative gap-2">
                                          <div className="relative">
                                            <input
                                              required={
                                                buyer?.Resident == "Yes"
                                                  ? true
                                                  : false
                                              }
                                              value={
                                                buyerImagesApi1[0] &&
                                                buyerImagesApi1[0][3] &&
                                                buyerImagesApi1[0][3]?.name
                                                  ? buyerImagesApi1[0][3]?.name
                                                  : buyerImagesApi1[0][3]
                                                      ?.split("kyc/")
                                                      .pop()
                                              }
                                              disabled={
                                                buyer?.Resident == "Yes"
                                                  ? false
                                                  : true
                                              }
                                              type="text"
                                              className="px-2 py-1"
                                              placeholder="Emirates ID"
                                              readOnly
                                            />
                                              <label
                                              for="emirateID"
                                              className="absolute px-1 !bg-slate-50 !mb-0 cursor-pointer text-xl right-0 mx-auto my-auto"
                                            >
                                              <LuPlus />
                                            </label>
                                          </div>

                                          <input
                                            onChange={(e) =>
                                              handleApiFileChange1(
                                                0,
                                                3,
                                                e.target.files
                                              )
                                            }
                                            className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                            aria-describedby="file_input_help"
                                            id="emirateID"
                                            type="file"
                                             accept=".jpg, .jpeg, .png, .pdf"
                                          />
                                          <FaRegEye
                                            className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                            onClick={() => setShowemirates(true)}
                                          />
                                          {showemirates && (
                                             <div className="!flex !flex-col gap-2 w-full !h-screen !rounded-md h-screen fixed items-end top-0 left-0 z-[9999]">
                                            <div className={`w-full h-full aspect-auto bg-slate-800/20`}>
                                              <div className='flex justify-end w-full'>
                                                <IoMdClose
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300 !text-gray-900"
                                                  onClick={() => setShowemirates(false)}
                                                />
                                              </div>
                                              <div className="w-full h-full flex justify-center items-center">
                                                <div className="w-full h-screen overflow-auto flex justify-center items-center">
                                                   {buyerImagesApi1[0][3] ? (
          // Check if it's a file object (assuming buyerImagesApi1[0][0] is a File object)
                                                          buyerImagesApi1[0][3] instanceof File && buyerImagesApi1[0][3].name ? (
                                                            buyerImagesApi1[0][3].name.endsWith('.pdf') ? (
                                                              // Render PDF if it's a PDF file
                                                              <embed
                                                                src={URL.createObjectURL(buyerImagesApi1[0][3])}
                                                                type="application/pdf"
                                                                className="w-[90%] !h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if it's an image file.
                                                              <img
                                                                src={URL.createObjectURL(buyerImagesApi1[0][3])}
                                                                alt="Image"
                                                                className="w-auto "
                                                              />
                                                            )
                                                          ) : (
                                                            // Assume it's a URL, check extension from the URL
                                                            buyerImagesApi1[0][3].endsWith('.pdf') ? (
                                                              // Render PDF if URL ends with .pdf
                                                              <embed
                                                                src={buyerImagesApi1[0][3]}
                                                                type="application/pdf"
                                                                className="w-[90%] h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if URL ends with .jpg or .jpeg (adjust as needed)
                                                              <img
                                                                src={buyerImagesApi1[0][3]}
                                                                alt="Image"
                                                                className="w-auto"
                                                              />
                                                            )
                                                          )
                                                        ) : null}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                            
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                            <div className={`mt-2 grid grid-cols-2 gap-x-2 gap-y-3`}>
                              
                                    <div className="flex items-center gap-4">
                                      <p className="block text-lg mb-0 leading-normal font-medium text-gray-900 w-[195px]">
                                        Visa{" "}
                                        <span className="text-red-500 !mb-0">
                                          *
                                        </span>
                                      </p>
                                      <div>
                                        <div className="flex items-center relative gap-2">
                                          <div className="relative">
                                            <input
                                               
                                              
                                              value={
                                                buyerImagesApi1[0] &&
                                                buyerImagesApi1[0][2] &&
                                                buyerImagesApi1[0][2]?.name
                                                  ? buyerImagesApi1[0][2]?.name
                                                  : buyerImagesApi1[0][2]
                                                      ?.split("kyc/")
                                                      .pop()
                                              }
                                             
                                              type="text"
                                              className="px-2 py-1"
                                              placeholder="Visa"
                                              readOnly
                                            />
                                              <label
                                              for="Visa"
                                              className="absolute px-1 !bg-slate-50 !mb-0 cursor-pointer text-xl right-0 mx-auto my-auto"
                                            >
                                              <LuPlus />
                                            </label>
                                          </div>

                                          <input
                                            onChange={(e) =>
                                              handleApiFileChange1(
                                                0,
                                                2,
                                                e.target.files
                                              )
                                            }
                                            className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                            aria-describedby="file_input_help"
                                            id="Visa"
                                            type="file"
                                             accept=".jpg, .jpeg, .png, .pdf"
                                          />
                                          <FaRegEye
                                            className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                            onClick={() => setShowVisa1(true)}
                                          />
                                          {showVisa1 && (
                                             <div className="!flex !flex-col gap-2 w-full !h-screen !rounded-md h-screen fixed items-end top-0 left-0 z-[9999]">
                                            <div className={`w-full h-full aspect-auto bg-slate-800/20`}>
                                              <div className='flex justify-end w-full'>
                                                <IoMdClose
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300 !text-gray-900"
                                                  onClick={() => setShowVisa1(false)}
                                                />
                                              </div>
                                              <div className="w-full h-full flex justify-center items-center">
                                                <div className=" !w-[80%] !h-screen overflow-auto flex justify-center items-center">
                                                  {buyerImagesApi1[0][2] ? (
          // Check if it's a file object (assuming buyerImagesApi1[0][0] is a File object)
                                                          buyerImagesApi1[0][2] instanceof File && buyerImagesApi1[0][2].name ? (
                                                            buyerImagesApi1[0][2].name.endsWith('.pdf') ? (
                                                              // Render PDF if it's a PDF file
                                                              <embed
                                                                src={URL.createObjectURL(buyerImagesApi1[0][2])}
                                                                type="application/pdf"
                                                                className="w-[90%] !h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if it's an image file.
                                                              <img
                                                                src={URL.createObjectURL(buyerImagesApi1[0][2])}
                                                                alt="Image"
                                                                className="w-auto "
                                                              />
                                                            )
                                                          ) : (
                                                            // Assume it's a URL, check extension from the URL
                                                            buyerImagesApi1[0][2].endsWith('.pdf') ? (
                                                              // Render PDF if URL ends with .pdf
                                                              <embed
                                                                src={buyerImagesApi1[0][2]}
                                                                type="application/pdf"
                                                                className="w-[90%] h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if URL ends with .jpg or .jpeg (adjust as needed)
                                                              <img
                                                                src={buyerImagesApi1[0][2]}
                                                                alt="Image"
                                                                className="w-auto"
                                                              />
                                                            )
                                                          )
                                                        ) : null}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  
                                  
                                  <div className="flex items-center gap-4">
                                      <p className="block text-lg mb-0 leading-normal font-medium text-gray-900 w-[200px]">
                                        EOI Receipt{" "}
                                        <span className="text-red-500 !mb-0">
                                          *
                                        </span>
                                      </p>
                                      <div>
                                        <div className="flex items-center relative gap-2">
                                          <div className="relative">
                                            <input
                                               
                                              
                                              value={
                                                buyerExtraDocs[0] &&
                                                buyerExtraDocs[0][0] &&
                                                buyerExtraDocs[0][0]?.name
                                                  ? buyerExtraDocs[0][0]?.name
                                                  : buyerExtraDocs[0][0]
                                                      ?.split("kyc/")
                                                      .pop()
                                              }
                                             
                                              type="text"
                                              className="px-2 py-1"
                                              placeholder="EOI Receipt"
                                              readOnly
                                            />
                                              <label
                                              for="EOIR"
                                              className="absolute px-1 !bg-slate-50 !mb-0 cursor-pointer text-xl right-0 mx-auto my-auto"
                                            >
                                              <LuPlus />
                                            </label>
                                          </div>

                                          <input
                                            onChange={(e) =>
                                              handleExtraDocs(
                                                0,
                                                0,
                                                e.target.files
                                              )
                                            }
                                            className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                            aria-describedby="file_input_help"
                                            id="EOIR"
                                            type="file"
                                             accept=".jpg, .jpeg, .png, .pdf"
                                          />
                                          <FaRegEye
                                            className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                            onClick={() => setShowEOI(true)}
                                          />
                                          {showEOI && ( 
                                            <div className="!flex !flex-col gap-2 w-full !h-screen !rounded-md h-screen fixed items-end top-0 left-0 z-[9999]">
                                            <div className={`w-full h-full aspect-auto bg-slate-800/20`}>
                                              <div className='flex justify-end w-full'>
                                                <IoMdClose
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300 !text-gray-900"
                                                  onClick={() => setShowEOI(false)}
                                                />
                                              </div>
                                              <div className="w-full h-full flex justify-center items-center">
                                                <div className="w-full h-screen overflow-auto flex justify-center items-center">
                                                  {buyerExtraDocs[0][0] ? (
          // Check if it's a file object (assuming buyerImagesApi1[0][0] is a File object)
                                                          buyerExtraDocs[0][0] instanceof File && buyerExtraDocs[0][0].name ? (
                                                            buyerExtraDocs[0][0].name.endsWith('.pdf') ? (
                                                              // Render PDF if it's a PDF file
                                                              <embed
                                                                src={URL.createObjectURL(buyerExtraDocs[0][0])}
                                                                type="application/pdf"
                                                                className="w-[90%] !h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if it's an image file
                                                              <img
                                                                src={URL.createObjectURL(buyerExtraDocs[0][0])}
                                                                alt="Image"
                                                                className="w-auto "
                                                              />
                                                            )
                                                          ) : (
                                                            // Assume it's a URL, check extension from the URL
                                                            buyerExtraDocs[0][0].endsWith('.pdf') ? (
                                                              // Render PDF if URL ends with .pdf
                                                              <embed
                                                                src={buyerExtraDocs[0][0]}
                                                                type="application/pdf"
                                                                className="w-[90%] h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if URL ends with .jpg or .jpeg (adjust as needed)
                                                              <img
                                                                src={buyerExtraDocs[0][0]}
                                                                alt="Image"
                                                                className="w-auto"
                                                              />
                                                            )
                                                          )
                                                        ) : null}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                            
                                            
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    
                                                                      <div className="flex items-center gap-4">
                                      <p className="block text-lg mb-0 leading-normal font-medium text-gray-900 w-[195px]">
                                        Booking Form{" "}
                                        <span className="text-red-500 !mb-0">
                                          *
                                        </span>
                                      </p>
                                      <div>
                                        <div className="flex items-center relative gap-2">
                                          <div className="relative">
                                            <input
                                              value={
                                                buyerExtraDocs[0] &&
                                                buyerExtraDocs[0][1] &&
                                                buyerExtraDocs[0][1]?.name
                                                  ? buyerExtraDocs[0][1]?.name
                                                  : buyerExtraDocs[0][1]
                                                      ?.split("kyc/")
                                                      .pop()
                                              }
                                             
                                              type="text"
                                              className="px-2 py-1"
                                              placeholder="Booking Form"
                                              readOnly
                                            />
                                              <label
                                              for="Booking"
                                              className="absolute px-1 !bg-slate-50 !mb-0 cursor-pointer text-xl right-0 mx-auto my-auto"
                                            >
                                              <LuPlus />
                                            </label>
                                          </div>

                                          <input
                                            onChange={(e) =>
                                              handleExtraDocs(
                                                0,
                                                1,
                                                e.target.files
                                              )
                                            }
                                            className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                            aria-describedby="file_input_help"
                                            id="Booking"
                                            type="file"
                                             accept=".jpg, .jpeg, .png, .pdf"
                                          />
                                          <FaRegEye
                                            className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                            onClick={() => setShowBooking(true)}
                                          />
                                          {showBooking && (
                                          
                                          <div className="!flex !flex-col gap-2 w-full !h-screen !rounded-md h-screen fixed items-end top-0 left-0 z-[9999]">
                                            <div className={`w-full h-full aspect-auto bg-slate-800/20`}>
                                              <div className='flex justify-end w-full'>
                                                <IoMdClose
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300 !text-gray-900"
                                                  onClick={() => setShowBooking(false)}
                                                />
                                              </div>
                                              <div className="w-full h-full flex justify-center items-center">
                                                <div className="w-full h-screen overflow-auto flex justify-center items-center">
                                                   {buyerExtraDocs[0][0] ? (
          // Check if it's a file object (assuming buyerImagesApi1[0][0] is a File object)
                                                          buyerExtraDocs[0][1] instanceof File && buyerExtraDocs[0][1].name ? (
                                                            buyerExtraDocs[0][1].name.endsWith('.pdf') ? (
                                                              // Render PDF if it's a PDF file
                                                              <embed
                                                                src={URL.createObjectURL(buyerExtraDocs[0][1])}
                                                                type="application/pdf"
                                                                className="!w-[90%] !h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if it's an image file
                                                              <img
                                                                src={URL.createObjectURL(buyerExtraDocs[0][1])}
                                                                alt="Image"
                                                                className="w-auto "
                                                              />
                                                            )
                                                          ) : (
                                                            // Assume it's a URL, check extension from the URL
                                                            buyerExtraDocs[0][1].endsWith('.pdf') ? (
                                                              // Render PDF if URL ends with .pdf
                                                              <embed
                                                                src={buyerExtraDocs[0][1]}
                                                                type="application/pdf"
                                                                className="!w-[90%] h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if URL ends with .jpg or .jpeg (adjust as needed)
                                                              <img
                                                                src={buyerExtraDocs[0][1]}
                                                                alt="Image"
                                                                className="w-auto"
                                                              />
                                                            )
                                                          )
                                                        ) : null}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                            
                                            
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    
                                    
                                                                      <div className="flex items-center gap-4">
                                      <p className="block text-lg mb-0 leading-normal font-medium text-gray-900 w-[200px]">
                                        SPA Copy{" "}
                                        
                                      </p>
                                      <div>
                                        <div className="flex items-center relative gap-2">
                                          <div className="relative">
                                            <input
                                               
                                                                                  
                                            value={
                                                buyerExtraDocs[0] && buyerExtraDocs[0][2] && buyerExtraDocs[0][2]?.name ? buyerExtraDocs[0][2]?.name : buyerExtraDocs[0][2]?.split("kyc/").pop() == 'undefined' ? ' ' : buyerExtraDocs[0][2]?.split("kyc/").pop()
                                              }

                                             
                                              type="text"
                                              className="px-2 py-1"
                                              placeholder="SPA"
                                              readOnly
                                            />
                                              <label
                                              for="SPA"
                                              className="absolute px-1 !bg-slate-50 !mb-0 cursor-pointer text-xl right-0 mx-auto my-auto"
                                            >
                                              <LuPlus />
                                            </label>
                                          </div>

                                          <input
                                            onChange={(e) =>
                                              handleExtraDocs(
                                                0,
                                                2,
                                                e.target.files
                                              )
                                            }
                                            className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                            aria-describedby="file_input_help"
                                            id="SPA"
                                            type="file"
                                             accept=".jpg, .jpeg, .png, .pdf"
                                          />
                                          <FaRegEye
                                            className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                           onClick={() => {
                                                  // Check if buyerExtraDocs[0] exists and is truthy
                                                  if (buyerExtraDocs[0]) {
                                                    // Check if buyerExtraDocs[0][2] exists and is not null
                                                    if (buyerExtraDocs[0][2] !== null) {
                                                      // Check if buyerExtraDocs[0][2] is an instance of File
                                                      if (buyerExtraDocs[0][2] instanceof File) {
                                                        // If buyerExtraDocs[0][2] is a File object, check if it has a name
                                                        if (buyerExtraDocs[0][2]?.name) {
                                                          setShowSPA(true);
                                                        } else {
                                                          setShowSPA(false);
                                                        }
                                                      } else {
                                                        // If buyerExtraDocs[0][2] is not a File object, but not null, show SPA
                                                        setShowSPA(true);
                                                      }
                                                    } else {
                                                      // If buyerExtraDocs[0][2] is null, hide SPA
                                                      setShowSPA(false);
                                                    }
                                                  } else {
                                                    // If buyerExtraDocs[0] does not exist or is falsy, hide SPA
                                                    setShowSPA(false);
                                                  }
                                                }}

                                          />
                                          {buyerExtraDocs[0] && buyerExtraDocs[0][2] && showSPA && (
                                            
                                             <div className="!flex !flex-col gap-2 w-full !h-screen !rounded-md h-screen fixed items-end top-0 left-0 z-[9999]">
                                            <div className={`w-full h-full aspect-auto bg-slate-800/20`}>
                                              <div className='flex justify-end w-full'>
                                                <IoMdClose
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300 !text-gray-900"
                                                  onClick={() => setShowSPA(false)}
                                                />
                                              </div>
                                              <div className="w-full h-full flex justify-center items-center">
                                                <div className="w-full h-screen overflow-auto flex justify-center items-center">
                                                  {buyerExtraDocs[0][0] ? (
          // Check if it's a file object (assuming buyerImagesApi1[0][0] is a File object)
                                                          buyerExtraDocs[0][2] instanceof File && buyerExtraDocs[0][2].name ? (
                                                            buyerExtraDocs[0][2].name.endsWith('.pdf') ? (
                                                              // Render PDF if it's a PDF file.
                                                              <embed
                                                                src={URL.createObjectURL(buyerExtraDocs[0][2])}
                                                                type="application/pdf"
                                                                className="w-[90%] !h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if it's an image file
                                                              <img
                                                                src={URL.createObjectURL(buyerExtraDocs[0][2])}
                                                                alt="Image"
                                                                className="w-auto "
                                                              />
                                                            )
                                                          ) : (
                                                            // Assume it's a URL, check extension from the URL
                                                            buyerExtraDocs[0][0].endsWith('.pdf') ? (
                                                              // Render PDF if URL ends with .pdf
                                                              <embed
                                                                src={buyerExtraDocs[0][2]}
                                                                type="application/pdf"
                                                                className="w-[90%] h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if URL ends with .jpg or .jpeg (adjust as needed)
                                                              <img
                                                                src={buyerExtraDocs[0][2]}
                                                                alt="Image"
                                                                className="w-auto"
                                                              />
                                                            )
                                                          )
                                                        ) : null}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                            
                                            
                                            
                                            
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    
                                  
                                  
                                  
                            </div>
                            
                              <p className="text-xl mt-8 font-bold">
                                Buyer KYC / Customer Due Diligence
                              </p>

                              <div className="w-full grid grid-cols-2 mt-4 gap-x-5 gap-y-3">
                                <div>
                                  <div className="flex  gap-3">
                                    <p className="block mb-0 text-lg font-medium  text-gray-900 leading-normal w-[200px]">
                                      KYC{" "}
                                      <span className="text-red-500 !mb-0">
                                        *
                                      </span>

                                    </p>

                                    <div className="flex items-center gap-2 ">
                                      <div className="input-group relative">
                                        <div className="relative flex items-center">
                                          <input
                                            type="text"
                                            className="px-2 bg-gray-50"
                                             
                                            
                                             value={
                                                buyerKycImages[0] && buyerKycImages[0][0] && buyerKycImages[0][0]?.name ? buyerKycImages[0][0]?.name : buyerKycImages[0][0]?.split("kyc/").pop() == 'undefined' ? ' ' : buyerKycImages[0][0]?.split("kyc/").pop()
                                              }
                                            placeholder="KYC"
                                            readOnly
                                          />
                                          <label
                                            for="KYC"
                                            className="absolute !bg-slate-50 px-1 cursor-pointer text-xl right-0 mx-auto my-auto"
                                          >
                                            <LuPlus />
                                          </label>
                                          <input
                                            onChange={(e) =>
                                              handleFileChange1(
                                                0,
                                                0,
                                                e.target.files
                                              )
                                            }
                                            required
                                            className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                            aria-describedby="file_input_help"
                                            id="KYC"
                                            type="file"
                                            accept=".pdf"
                                          />
                                          <FaRegEye
                                            onClick={() =>
                                              buyerKycImages[0] &&
                                              buyerKycImages[0][0] &&
                                              setShowKyc1(true)
                                            }
                                            className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                          />
                                          {buyerKycImages[0][0] && showKyc1 && (
                                            <div className="!flex !flex-col gap-2 !w-[80%] !rounded-md !h-[95%] fixed items-end bottom-5 left-[12%] z-[9999]">
                                              <IoMdClose
                                                className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300  !text-gray-900"
                                                onClick={() =>
                                                  setShowKyc1(false)
                                                }
                                              />
                                              <embed
                                                src={
                                                  buyerKycImages[0][0]?.name
                                                    ? URL.createObjectURL(
                                                        buyerKycImages[0][0]
                                                      )
                                                    : path +
                                                      buyerKycImages[0][0]
                                                        ?.split("kyc/")
                                                        .pop()
                                                }
                                                type="application/pdf"
                                                className="w-full h-full"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <div className="flex  gap-3">
                                    <p className="block mb-0 text-lg font-medium  text-gray-900 leading-normal w-[200px]">
                                      UN Sanction Report{" "}
                                        <span className="text-red-500 !mb-0">
                                        *
                                      </span>
                                    </p>

                                    <div className="flex items-center gap-2 ">
                                      <div className="input-group relative">
                                        <div className="relative flex items-center">
                                          <input
                                            type="text"
                                            className="px-2 !bg-gray-50"
                                            value={
                                                buyerKycImages[0] && buyerKycImages[0][1] && buyerKycImages[0][1]?.name ? buyerKycImages[0][1]?.name : buyerKycImages[0][1]?.split("kyc/").pop() == 'undefined' ? ' ' : buyerKycImages[0][1]?.split("kyc/").pop()
                                              }
                                            placeholder="UN report"
                                            readOnly
                                          />
                                          <label
                                            for="UN report"
                                            className="absolute !bg-slate-50 px-1 cursor-pointer text-xl right-0 mx-auto my-auto"
                                          >
                                            <LuPlus />
                                          </label>
                                          <input
                                            onChange={(e) =>
                                              handleFileChange1(
                                                0,
                                                1,
                                                e.target.files
                                              )
                                            }
                                            required
                                            className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                            aria-describedby="file_input_help"
                                            id="UN report"
                                            type="file"
                                            accept=".pdf"
                                          />
                                          <FaRegEye
                                            onClick={() =>
                                              buyerKycImages[0] &&
                                              buyerKycImages[0][1] &&
                                              setShowUnSanction1(true)
                                            }
                                            className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                          />
                                          {buyerKycImages[0][1] &&
                                            showUnSanction1 && (
                                              <div className="!flex !flex-col gap-2 !w-[80%] !rounded-md !h-[95%] fixed items-end bottom-5 left-[12%] z-[9999]">
                                                <IoMdClose
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300  !text-gray-900"
                                                  onClick={() =>
                                                    setShowUnSanction1(false)
                                                  }
                                                />
                                                <embed
                                                  src={
                                                    buyerKycImages[0][1]?.name
                                                      ? URL.createObjectURL(
                                                          buyerKycImages[0][1]
                                                        )
                                                      : path +
                                                        buyerKycImages[0][1]
                                                          ?.split("kyc/")
                                                          .pop()
                                                  }
                                                  type="application/pdf"
                                                  className="w-full h-full"
                                                />
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <div className="flex  gap-3">
                                    <p className="block mb-0 text-lg font-medium  text-gray-900 leading-normal w-[200px]">
                                      Risk Anaylysis Form{" "}
                                      <span className="text-red-500 !mb-0">
                                        *
                                      </span>

                                    </p>

                                    <div className="flex items-center gap-2 ">
                                      <div className="input-group relative">
                                        <div className="relative flex items-center">
                                          <input
                                            type="text"
                                             value={
                                                buyerKycImages[0] && buyerKycImages[0][2] && buyerKycImages[0][2]?.name ? buyerKycImages[0][2]?.name : buyerKycImages[0][2]?.split("kyc/").pop() == 'undefined' ? ' ' : buyerKycImages[0][2]?.split("kyc/").pop()
                                              }
                                            className="px-2 !bg-gray-50"
                                            placeholder="Risk Form"
                                            readOnly
                                          />
                                          <label
                                            for="Risk form"
                                            className="absolute !bg-slate-50 px-1  cursor-pointer text-xl right-0 mx-auto my-auto"
                                          >
                                            <LuPlus />
                                          </label>
                                          <input
                                            required={
                                              buyerKycImages[0] &&
                                              buyerKycImages[0][2] != null
                                                ? false
                                                : true
                                            }
                                            onChange={(e) =>
                                              handleFileChange1(
                                                0,
                                                2,
                                                e.target.files
                                              )
                                            }
                                            className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                            aria-describedby="file_input_help"
                                            id="Risk form"
                                            type="file"
                                            accept=".pdf"
                                          />
                                          <FaRegEye
                                            onClick={() =>
                                              buyerKycImages[0] &&
                                              buyerKycImages[0][2] &&
                                              setShowRiskForm1(true)
                                            }
                                            className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                          />
                                          {buyerKycImages[0][2] &&
                                            showRiskForm1 && (
                                              <div className="!flex !flex-col gap-2 !w-[80%] !rounded-md !h-[95%] fixed items-end bottom-5 left-[12%] z-[9999]">
                                                <IoMdClose
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300  !text-gray-900"
                                                  onClick={() =>
                                                    setShowRiskForm1(false)
                                                  }
                                                />
                                                <embed
                                                  src={
                                                    buyerKycImages[0][2]?.name
                                                      ? URL.createObjectURL(
                                                          buyerKycImages[0][2]
                                                        )
                                                      : path +
                                                        buyerKycImages[0][2]
                                                          ?.split("kyc/")
                                                          .pop()
                                                  }
                                                  type="application/pdf"
                                                  className="w-full h-full"
                                                />
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <div className="flex  gap-3">
                                    <p className="block mb-0 text-lg font-medium  text-gray-900 leading-normal w-[200px]">
                                      UAE Sanction Report {" "}
                                      <span className="text-red-500 !mb-0">
                                        *
                                      </span>

                                    </p>

                                    <div className="flex items-center gap-2 ">
                                      <div className="input-group relative">
                                        <div className="relative flex items-center">
                                          <input
                                            type="text"
                                             value={
                                                buyerKycImages[0] && buyerKycImages[0][3] && buyerKycImages[0][3]?.name ? buyerKycImages[0][3]?.name : buyerKycImages[0][3]?.split("kyc/").pop() == 'undefined' ? ' ' : buyerKycImages[0][3]?.split("kyc/").pop()
                                              }
                                            className="px-2 !bg-gray-50"
                                            placeholder="UAE Sanction Report"
                                            readOnly
                                          />
                                          <label
                                            for="UAE Sanction"
                                            className="absolute !bg-slate-50 px-1 cursor-pointer text-xl right-0 mx-auto my-auto"
                                          >
                                            <LuPlus />
                                          </label>
                                          <input
                                            required={
                                              buyerKycImages[0] &&
                                              buyerKycImages[0][3] != null
                                                ? false
                                                : true
                                            }
                                            onChange={(e) =>
                                              handleFileChange1(
                                                0,
                                                3,
                                                e.target.files
                                              )
                                            }
                                            className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                            aria-describedby="file_input_help"
                                            id="UAE Sanction"
                                            type="file"
                                            accept=".pdf"
                                          />
                                          <FaRegEye
                                            onClick={() =>
                                              buyerKycImages[0] &&
                                              buyerKycImages[0][3] &&
                                              setShowUaeSanction1(true)
                                            }
                                            className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                          />
                                          {buyerKycImages[0][3] &&
                                            showUaeSanction1 && (
                                              <div className="!flex !flex-col gap-2 !w-[80%] !rounded-md !h-[95%] fixed items-end bottom-5 left-[12%] z-[9999]">
                                                <IoMdClose
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300  !text-gray-900"
                                                  onClick={() =>
                                                    setShowUaeSanction1(false)
                                                  }
                                                />
                                                <embed
                                                  src={
                                                    buyerKycImages[0][3]?.name
                                                      ? URL.createObjectURL(
                                                          buyerKycImages[0][3]
                                                        )
                                                      : path +
                                                        buyerKycImages[0][3]
                                                          ?.split("kyc/")
                                                          .pop()
                                                  }
                                                  type="application/pdf"
                                                  className="w-full h-full"
                                                />
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex w-full gap-5 justify-start mt-3">
                                <p className="text-lg text-black">
                                  Additional Comments
                                </p>
                                <textarea
                                  className="w-[60%] h-[20vh] !border !border-gray-400 rounded-md  resize-none px-2 py-2"
                                  placeholder="Add Comments here"
                                  value={buyer.External}
                                  onChange={(e) =>
                                    setMyData(
                                      myData.map((item) => ({
                                        ...item,
                                        External: e.target.value,
                                      }))
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>

                  <Accordion allowZeroExpanded>
                    {extraBuyers[0] &&
                      extraBuyers.map((addBuyers, id) => {
                        return (
                          <AccordionItem key={id} className="mt-4">
                            <AccordionItemHeading className="bg-white !border !border-gray-400 rounded-md py-2 px-2">
                              <AccordionItemButton className="flex w-full justify-between items-center">
                                Buyer {id + 2}
                                <ImPlus className="!mb-0"/>
                              </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                              <div className="grid grid-cols-2 gap-x-5 gap-y-3 mt-4">
                                <div className="">
                                  <label className="!mb-0">
                                    Full name{" "}
                                    <span className="text-red-500 !mb-0">
                                      *
                                    </span>
                                  </label>
                                  <input
                                    className="form-control"
                                    required
                                    type="text"
                                    value={addBuyers?.buyername}
                                    onChange={(e) => {
                                      const updatedBuyers = extraBuyers.map(
                                        (buyer, index) => {
                                          if (index === id) {
                                            // replace `desiredIndex` with the correct index you want to update
                                            return {
                                              ...buyer,
                                              buyername: e.target.value,
                                            };
                                          }
                                          return buyer;
                                        }
                                      );
                                      setExtraBuyers(updatedBuyers);
                                    }}
                                    placeholder="Buyer Cutomer Name"
                                  />
                                </div>
                                <div className="">
                                  <label className="!mb-0">
                                    Phone{" "}
                                    <span className="text-red-500 !mb-0">
                                      *
                                    </span>
                                  </label>
                                  <input
                                    className="form-control"
                                    required
                                    value={addBuyers?.buyerContact}
                                    onChange={(e) => {
                                      const updatedBuyers = extraBuyers.map(
                                        (buyer, index) => {
                                          if (index === id) {
                                            // replace `desiredIndex` with the correct index you want to update
                                            return {
                                              ...buyer,
                                              buyerContact: e.target.value,
                                            };
                                          }
                                          return buyer;
                                        }
                                      );
                                      setExtraBuyers(updatedBuyers);
                                    }}
                                    placeholder="Contact Number"
                                    type="number"
                                  />
                                </div>
                                <div className="">
                                  <label className="!mb-0">
                                    Email{" "}
                                    
                                  </label>
                                  <input
                                    className="form-control"
                                    required
                                    value={addBuyers?.buyerEmail}
                                    onChange={(e) => {
                                      const updatedBuyers = extraBuyers.map(
                                        (buyer, index) => {
                                          if (index === id) {
                                            // replace `desiredIndex` with the correct index you want to update
                                            return {
                                              ...buyer,
                                              buyerEmail: e.target.value,
                                            };
                                          }
                                          return buyer;
                                        }
                                      );
                                      setExtraBuyers(updatedBuyers);
                                    }}
                                    placeholder="Email"
                                  />
                                </div>

                                <div className="">
                                  <label className="!mb-0">
                                    Date of Birth{" "}
                                    
                                  </label>
                                  <input
                                    className="form-control"
                                    required
                                    type="date"
                                   onKeyDown={handleKeyDown}
                                    onFocus={toggleInputType}
                                    value={addBuyers?.buyerdob}
                                    onChange={(e) => {
                                      const updatedBuyers = extraBuyers.map(
                                        (buyer, index) => {
                                          if (index === id) {
                                            // replace `desiredIndex` with the correct index you want to update
                                            return {
                                              ...buyer,
                                              buyerdob: e.target.value,
                                            };
                                          }
                                          return buyer;
                                        }
                                      );
                                      setExtraBuyers(updatedBuyers);
                                    }}
                                    placeholder="Date of Birth"
                                  />
                                </div>

                                <div className="">
                                  <label className="!mb-0">
                                    Passport Number{" "}
                                   
                                  </label>
                                  <input
                                    className="form-control"
                                    required
                                    type="text"
                                    value={addBuyers?.buyerpassport}
                                    onChange={(e) => {
                                      const updatedBuyers = extraBuyers.map(
                                        (buyer, index) => {
                                          if (index === id) {
                                            // replace `desiredIndex` with the correct index you want to update
                                            return {
                                              ...buyer,
                                              buyerpassport: e.target.value,
                                            };
                                          }
                                          return buyer;
                                        }
                                      );
                                      setExtraBuyers(updatedBuyers);
                                    }}
                                    placeholder="Passport Number"
                                  />
                                </div>

                                <div className="">
                                  <label className="!mb-0">
                                    Passport Expiry{" "}
                                    
                                  </label>
                                  <input
                                    className="form-control"
                                    required
                                    type="date"
                                    onKeyDown={handleKeyDown}
                                    onFocus={toggleInputType}
                                    value={addBuyers?.passportexpiry}
                                    onChange={(e) => {
                                      const updatedBuyers = extraBuyers.map(
                                        (buyer, index) => {
                                          if (index === id) {
                                            // replace `desiredIndex` with the correct index you want to update
                                            return {
                                              ...buyer,
                                              passportexpiry: e.target.value,
                                            };
                                          }
                                          return buyer;
                                        }
                                      );
                                      setExtraBuyers(updatedBuyers);
                                    }}
                                    placeholder="Passport Expiry"
                                  />
                                </div>
                                <div className="">
                                  <label className="!mb-0">
                                    Nationality{" "}
                                   
                                  </label>
                                  <input
                                    className="form-control"
                                    required
                                    type="text"
                                    onChange={(e) => {
                                      const updatedBuyers = extraBuyers.map(
                                        (buyer, index) => {
                                          if (index === id) {
                                            // replace `desiredIndex` with the correct index you want to update
                                            return {
                                              ...buyer,
                                              nationality: e.target.value,
                                            };
                                          }
                                          return buyer;
                                        }
                                      );
                                      setExtraBuyers(updatedBuyers);
                                    }}
                                    value={addBuyers?.nationality}
                                    placeholder="Nationality"
                                  />
                                </div>
                                <div className="">
                                  <label className="!mb-0">
                                    UAE Resident/Non Resident{" "}
                                   
                                  </label>

                                  <SearchableSelect
                                    options={options1}
                                    defaultValue={addBuyers?.Resident}
                                    onChange={(e) => {
                                      setExtraBuyers(updatedBuyers);
                                    }}
                                    disabled
                                  ></SearchableSelect>
                                </div>
                                <div className="">
                                  <label className="!mb-0">Emirates ID</label>
                                  <input
                                    disabled
                                    className={`form-control disabled:!bg-slate-200 }`}
                                    type="text"
                                    value={addBuyers?.emiratesid}
                                    placeholder="Emirates ID"
                                  />
                                </div>
                                <div className="">
                                  <label className="!mb-0">
                                    Emirates Expiry
                                  </label>
                                  <input
                                    disabled
                                    className={`form-control disabled:!bg-slate-200 }`}
                                    type="date"
                                    onKeyDown={handleKeyDown}
                                    onFocus={toggleInputType}
                                    value={addBuyers?.emiratesExpiry}
                                    placeholder="Emirates Expiry"
                                  />
                                </div>

                                <div className="col-span-2">
                                  <label className="!mb-0">
                                    Address{" "}
                                   
                                  </label>
                                  <input
                                    className="form-control"
                                    required
                                    type="text"
                                    onChange={(e) => {
                                      const updatedBuyers = extraBuyers.map(
                                        (buyer, index) => {
                                          if (index === id) {
                                            // replace `desiredIndex` with the correct index you want to update
                                            return {
                                              ...buyer,
                                              address: e.target.value,
                                            };
                                          }
                                          return buyer;
                                        }
                                      );
                                      setExtraBuyers(updatedBuyers);
                                    }}
                                    value={addBuyers?.address}
                                    placeholder="Address"
                                  />
                                </div>
                              </div>
                              <div className="w-full mt-4">
                                <div className="w-full flex items-center justify-between ">
                                  <p className="w-full relative overflow-hidden block text-xl font-bold">
                                    <span className='block relative after:content-[" "] align-baseline  after:absolute after:w-full after:h-2 after:border-t-4 after:ml-3 after:border-slate-400 after:top-[50%]'>
                                      Documents to Upload
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full grid grid-cols-2 gap-x-5 gap-y-3">
                                  <div>
                                    <div className="flex  gap-3">
                                      <p className="block mb-0 text-lg font-medium  text-gray-900 leading-normal ">
                                        Buyer's Passport{" "}
                                        <span className="text-red-500 !mb-0">
                                          *
                                        </span>
                                      </p>
                                      <div>
                                        <div className="flex items-center gap-2 ">
                                          <div className="input-group relative">
                                          <p className={`text-gray-700 !mr-2` }>Front:</p>
                                            <div className="relative">
                                              <input
                                                type="text"
                                                className="px-2 !bg-gray-50"
                                                
                                                value={
                                                  buyerImagesApi2 &&
                                                  buyerImagesApi2[id] &&
                                                  buyerImagesApi2[id][0] &&
                                                  typeof buyerImagesApi2[
                                                    id
                                                  ][0] === "string"
                                                    ? buyerImagesApi2[id][0]
                                                        .split("kyc/")
                                                        .pop()
                                                    : buyerImagesApi2[id] &&
                                                      buyerImagesApi2[id][0]
                                                        ?.name
                                                    ? buyerImagesApi2[id][0]
                                                        ?.name
                                                    : ""
                                                }
                                                placeholder="Front"
                                                readOnly
                                              />
                                              <label
                                                for={`front${id}`}
                                                className="absolute !bg-slate-50 px-1 cursor-pointer text-xl right-0 mx-auto my-auto"
                                              >
                                                <LuPlus />
                                              </label>
                                            </div>

                                            <input
                                              className="!hidden  text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                              onChange={(e) =>
                                                handleApiFileChange2(
                                                  id,
                                                  0,
                                                  e.target.files
                                                )
                                              }
                                              aria-describedby="file_input_help"
                                              id={`front${id}`}
                                              type="file"
                                            
                                            />
                                            <FaRegEye
                                              className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                              onClick={() =>
                                                setShowpassFront1(true)
                                              }
                                            />
                                            {showPassFront1 && (
                                               <div className="!flex !flex-col gap-2 w-full !h-screen !rounded-md h-screen fixed items-end top-0 left-0 z-[9999]">
                                            <div className={`w-full h-full aspect-auto bg-slate-800/20`}>
                                              <div className='flex justify-end w-full'>
                                                <IoMdClose
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300 !text-gray-900"
                                                  onClick={() => setShowpassFront1(false)}
                                                />
                                              </div>
                                              <div className="w-full h-full flex justify-center items-center">
                                                <div className="w-full h-screen overflow-auto flex justify-center items-center">
                                                   {buyerImagesApi2[id][0] ? (
                                                     // Check if it's a file object (assuming buyerImagesApi1[0][0] is a File object)
                                                          buyerImagesApi2[id][0] instanceof File && buyerImagesApi2[id][0].name ? (
                                                            buyerImagesApi2[id][0].name.endsWith('.pdf') ? (
                                                              // Render PDF if it's a PDF file
                                                              <embed
                                                                src={URL.createObjectURL(+buyerImagesApi2[id][0])}
                                                                type="application/pdf"
                                                                className="w-[90%] !h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if it's an image file
                                                              <img
                                                                src={URL.createObjectURL(buyerImagesApi2[id][0])}
                                                                alt="Image"
                                                                className="w-auto "
                                                              />
                                                            )
                                                          ) : (
                                                            // Assume it's a URL, check extension from the URL
                                                            buyerImagesApi2[id][0].endsWith('.pdf') ? (
                                                              // Render PDF if URL ends with .pdf
                                                              <embed
                                                                src={path+buyerImagesApi2[id][0]?.split("kyc/").pop()}
                                                                type="application/pdf"
                                                                className="w-[90%] h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if URL ends with .jpg or .jpeg (adjust as needed)
                                                              <img
                                                                src={path+buyerImagesApi2[id][0]?.split("kyc/").pop()}
                                                                alt="Image"
                                                                className="w-auto"
                                                              />
                                                            )
                                                          )
                                                        ) : null}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                              
                                              
                                              
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex items-top gap-2 mt-2">
                                          <div className="input-group relative">
                                          <p className={`text-gray-700 !mr-2` }>Back:&nbsp;</p>
                                            <div className="relative">
                                              <input
                                                type="text"
                                                className="px-2 !bg-gray-50"
                                                
                                                value={
                                                  buyerImagesApi2 &&
                                                  buyerImagesApi2[id] &&
                                                  buyerImagesApi2[id][1] &&
                                                  typeof buyerImagesApi2[
                                                    id
                                                  ][1] === "string"
                                                    ? buyerImagesApi2[id][1]
                                                        .split("kyc/")
                                                        .pop()
                                                    : buyerImagesApi2[id] &&
                                                      buyerImagesApi2[id][1]
                                                        ?.name
                                                    ? buyerImagesApi2[id][1]
                                                        ?.name
                                                    : "loading"
                                                }
                                                placeholder="Back"
                                                readOnly
                                              />
                                              <label
                                                for={`back${id}`}
                                                className="absolute !bg-slate-50 px-1 cursor-pointer text-xl right-0 mx-auto my-auto"
                                              >
                                                <LuPlus />
                                              </label>
                                            </div>
                                            <input
                                              className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                              onChange={(e) =>
                                                handleApiFileChange2(
                                                  id,
                                                  1,
                                                  e.target.files
                                                )
                                              }
                                              aria-describedby="file_input_help"
                                              id={`back${id}`}
                                              type="file"
                                             
                                            />
                                            <FaRegEye
                                              className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                              onClick={() =>
                                                setShowpassBack1(true)
                                              }
                                            />
                                            {showPassback1 && (
                                             <div className="!flex !flex-col gap-2 w-full !h-screen !rounded-md h-screen fixed items-end top-0 left-0 z-[9999]">
                                            <div className={`w-full h-full aspect-auto bg-slate-800/20`}>
                                              <div className='flex justify-end w-full'>
                                                <IoMdClose
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300 !text-gray-900"
                                                  onClick={() => setShowpassBack1(false)}
                                                />
                                              </div>
                                              <div className="w-full h-full flex justify-center items-center">
                                                <div className=" w-full h-screen overflow-auto flex justify-center items-center">
                                                 {buyerImagesApi2[id][1] ? (
          // Check if it's a file object (assuming buyerImagesApi1[0][0] is a File object)
                                                          buyerImagesApi2[id][1] instanceof File && buyerImagesApi2[id][1].name ? (
                                                            buyerImagesApi2[id][1].name.endsWith('.pdf') ? (
                                                              // Render PDF if it's a PDF file
                                                              <embed
                                                                src={URL.createObjectURL(buyerImagesApi2[id][1])}
                                                                type="application/pdf"
                                                                className="w-[90%] !h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if it's an image file
                                                              <img
                                                                src={URL.createObjectURL(buyerImagesApi2[id][1])}
                                                                alt="Image"
                                                                className="w-auto "
                                                              />
                                                            )
                                                          ) : (
                                                            // Assume it's a URL, check extension from the URL
                                                            buyerImagesApi2[id][1].endsWith('.pdf') ? (
                                                              // Render PDF if URL ends with .pdf
                                                              <embed
                                                                src={path+buyerImagesApi2[id][0]?.split("kyc/").pop()}
                                                                type="application/pdf"
                                                                className="w-[90%] h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if URL ends with .jpg or .jpeg (adjust as needed)
                                                              <img
                                                                src={path+buyerImagesApi2[id][1]?.split("kyc/").pop()}
                                                                alt="Image"
                                                                className="w-auto"
                                                              />
                                                            )
                                                          )
                                                        ) : null}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                              
                                              
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {addBuyers?.Resident === "" ||
                                  addBuyers?.Resident == "No" ? null : (
                                    <div>
                                      <div className="flex items-center gap-4">
                                        <p className="block text-lg mb-0 leading-normal font-medium text-gray-900 w-[195px]">
                                          Emirates ID{" "}
                                          <span className="text-red-500 !mb-0">
                                            *
                                          </span>
                                        </p>
                                        <div>
                                          <div className="flex items-center relative gap-2">
                                            <div className="relative">
                                              <input
                                                type="text"
                                                className="px-2 !bg-gray-50"
                                                
                                                value={
                                                  buyerImagesApi2 &&
                                                  buyerImagesApi2[id] &&
                                                  buyerImagesApi2[id][3] &&
                                                  typeof buyerImagesApi2[
                                                    id
                                                  ][3] === "string"
                                                    ? buyerImagesApi2[id][3]
                                                        .split("kyc/")
                                                        .pop()
                                                    : buyerImagesApi2[id] &&
                                                      buyerImagesApi2[id][3]
                                                        ?.name
                                                    ? buyerImagesApi2[id][3]
                                                        ?.name
                                                    : "loading"
                                                }
                                                placeholder="Emirates ID"
                                                readOnly
                                              />
                                              <label
                                                for={`emirateID${id}`}
                                                className="absolute !bg-slate-50 px-1 cursor-pointer text-xl right-0 mx-auto my-auto"
                                              >
                                                <LuPlus />
                                              </label>
                                            </div>

                                            <input
                                              className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                              onChange={(e) =>
                                                handleApiFileChange2(
                                                  id,
                                                  3,
                                                  e.target.files
                                                )
                                              }
                                              aria-describedby="file_input_help"
                                              id={`emirateID${id}`}
                                              type="file"
                                             
                                            />
                                            <FaRegEye
                                              className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                              onClick={() => setShowemirates1(true)}
                                            />
                                            {showemirates1 && (
                                             <div className="!flex !flex-col gap-2 w-full !h-screen !rounded-md h-screen fixed items-end top-0 left-0 z-[9999]">
                                            <div className={`w-full h-full aspect-auto bg-slate-800/20`}>
                                              <div className='flex justify-end w-full'>
                                                <IoMdClose
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300 !text-gray-900"
                                                  onClick={() => setShowemirates1(false)}
                                                />
                                              </div>
                                              <div className="w-full h-full flex justify-center items-center">
                                                <div className=" w-full h-screen overflow-auto flex justify-center items-center">
                                                 {buyerImagesApi2[id][0] ? (
          // Check if it's a file object (assuming buyerImagesApi1[0][0] is a File object)
                                                          buyerImagesApi2[id][3] instanceof File && buyerImagesApi2[id][3].name ? (
                                                            buyerImagesApi2[id][3].name.endsWith('.pdf') ? (
                                                              // Render PDF if it's a PDF file
                                                              <embed
                                                                src={URL.createObjectURL(buyerImagesApi2[id][3])}
                                                                type="application/pdf"
                                                                className="w-[90%] !h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if it's an image file
                                                              <img
                                                                src={URL.createObjectURL(buyerImagesApi2[id][3])}
                                                                alt="Image"
                                                                className="w-auto "
                                                              />
                                                            )
                                                          ) : (
                                                            // Assume it's a URL, check extension from the URL
                                                            buyerImagesApi2[id][3].endsWith('.pdf') ? (
                                                              // Render PDF if URL ends with .pdf
                                                              <embed
                                                                src={path+buyerImagesApi2[id][3]?.split("kyc/").pop()}
                                                                type="application/pdf"
                                                                className="w-[90%] h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if URL ends with .jpg or .jpeg (adjust as needed)
                                                              <img
                                                                src={path+buyerImagesApi2[id][3]?.split("kyc/").pop()}
                                                                alt="Image"
                                                                className="w-auto"
                                                              />
                                                            )
                                                          )
                                                        ) : null}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                 <div className={`mt-2`}>
                              
                                    <div className="flex items-center gap-4">
                                      <p className="block text-lg mb-0 leading-normal font-medium text-gray-900 w-[140px]">
                                        Visa{" "}
                                        <span className="text-red-500 !mb-0">
                                          *
                                        </span>
                                      </p>
                                      <div>
                                        <div className="flex items-center relative gap-2">
                                          <div className="relative">
                                            <input
                                               
                                              
                                              value={
                                                buyerImagesApi2[id] &&
                                                buyerImagesApi2[id][2] &&
                                                buyerImagesApi2[id][2]?.name
                                                  ? buyerImagesApi2[id][2]?.name
                                                  : buyerImagesApi2[id][2]
                                                      ?.split("kyc/")
                                                      .pop()
                                              }
                                             
                                              type="text"
                                              className="px-2 py-1"
                                              placeholder="Visa"
                                              readOnly
                                            />
                                              <label
                                              for={`Visa${id}`}
                                              className="absolute px-1 !bg-slate-50 !mb-0 cursor-pointer text-xl right-0 mx-auto my-auto"
                                            >
                                              <LuPlus />
                                            </label>
                                          </div>

                                          <input
                                            onChange={(e) =>
                                              handleApiFileChange2(
                                                id,
                                                2,
                                                e.target.files
                                              )
                                            }
                                            className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                            aria-describedby="file_input_help"
                                            id={`Visa${id}`}
                                            type="file"
                                            accept=".pdf"
                                          />
                                          <FaRegEye
                                            className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                            onClick={() => setShowVisa2(true)}
                                          />
                                          {showVisa2 && (
                                             <div className="!flex !flex-col gap-2 w-full !h-screen !rounded-md h-screen fixed items-end top-0 left-0 z-[9999]">
                                            <div className={`w-full h-full aspect-auto bg-slate-800/20`}>
                                              <div className='flex justify-end w-full'>
                                                <IoMdClose
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300 !text-gray-900"
                                                  onClick={() => setShowVisa2(false)}
                                                />
                                              </div>
                                              <div className="w-full h-full flex justify-center items-center">
                                                <div className="w-full h-screen overflow-auto flex justify-center items-center">
                                                 {buyerImagesApi2[id][2] ? (
                                                    // Check if it's a file object (assuming buyerImagesApi1[0][0] is a File object)
                                                          buyerImagesApi2[id][2] instanceof File && buyerImagesApi2[id][2].name ? (
                                                            buyerImagesApi2[id][2].name.endsWith('.pdf') ? (
                                                              // Render PDF if it's a PDF file
                                                              <embed
                                                                src={URL.createObjectURL(buyerImagesApi2[id][2])}
                                                                type="application/pdf"
                                                                className="w-[90%] !h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if it's an image file
                                                              <img
                                                                src={URL.createObjectURL(buyerImagesApi2[id][2])}
                                                                alt="Image"
                                                                className="w-auto "
                                                              />
                                                            )
                                                          ) : (
                                                            // Assume it's a URL, check extension from the URL
                                                            buyerImagesApi2[id][2].endsWith('.pdf') ? (
                                                              // Render PDF if URL ends with .pdf
                                                              <embed
                                                                src={path+buyerImagesApi2[id][2]?.split("kyc/").pop()}
                                                                type="application/pdf"
                                                                className="w-[90%] h-[80%]"
                                                              />
                                                            ) : (
                                                              // Render image if URL ends with .jpg or .jpeg (adjust as needed)
                                                              <img
                                                                src={path+buyerImagesApi2[id][2]?.split("kyc/").pop()}
                                                                alt="Image"
                                                                className="w-auto"
                                                              />
                                                            )
                                                          )
                                                        ) : null}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  
                            </div>

                                <p className="text-xl mt-8 font-bold">
                                  Buyer KYC / Customer Due Diligence
                                </p>

                                <div className="w-full grid grid-cols-2 mt-4 gap-x-5 gap-y-3">
                                  <div>
                                    <div className="flex  gap-3">
                                      <p className="block mb-0 text-lg font-medium  text-gray-900 leading-normal w-[200px]">
                                        KYC{" "}
                                        <span className="text-red-500 !mb-0">
                                        *
                                      </span>

                                      </p>

                                      <div className="flex items-center gap-2 ">
                                        <div className="input-group relative">
                                          <div className="relative">
                                            <input
                                              type="text"
                                              className="px-2 :bg-gray-50"
                                              value={
                                                buyerKycImages1[id] &&
                                                buyerKycImages1[id][0]?.name
                                              }
                                              value={
                                                  buyerKycImages1 &&
                                                  buyerKycImages1[id] &&
                                                  buyerKycImages1[id][0] &&
                                                  typeof buyerKycImages1[
                                                    id
                                                  ][0] === "string"
                                                    ? buyerKycImages1[id][0]
                                                        .split("kyc/")
                                                        .pop()
                                                    : buyerKycImages1[id] &&
                                                      buyerKycImages1[id][0]
                                                        ?.name
                                                    ? buyerKycImages1[id][0]
                                                        ?.name
                                                    : ""
                                                }
                                              placeholder="KYC"
                                              readOnly
                                            />
                                            <label
                                              for={`KYC${id}`}
                                              className="absolute !bg-slate-50 px-1 cursor-pointer text-xl right-0 mx-auto my-auto"
                                            >
                                              <LuPlus />
                                            </label>
                                          </div>
                                          <input
                                            onChange={(e) =>
                                              handleFileChange2(
                                                id,
                                                0,
                                                e.target.files
                                              )
                                            }
                                            required
                                            className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                            aria-describedby="file_input_help"
                                            id={`KYC${id}`}
                                            type="file"
                                            accept=".pdf"
                                          />
                                          <FaRegEye
                                            className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                            onClick={() =>
                                              buyerKycImages1[id] &&
                                              buyerKycImages1[id][0] &&
                                              setShowKyc2(true)
                                            }
                                          />

                                          {buyerKycImages1[id] &&
                                            buyerKycImages1[id][0] &&
                                            showKyc2 && (
                                              <div className="!flex !flex-col gap-2 !w-[80%] !rounded-md !h-[95%] fixed items-end bottom-5 left-[12%] z-[9999]">
                                                <IoMdClose
                                                  onClick={() =>
                                                    setShowKyc2(false)
                                                  }
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300  !text-gray-900"
                                                />
                                                <embed
                                                  src={
                                                    buyerKycImages1[id][0]?.name
                                                      ? URL.createObjectURL(
                                                          buyerKycImages1[id][0]
                                                        )
                                                      : path +
                                                        buyerKycImages1[id][0]
                                                          ?.split("kyc/")
                                                          .pop()
                                                  }
                                                  type="application/pdf"
                                                  className="w-full h-full"
                                                />
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex  gap-3">
                                      <p className="block mb-0 text-lg font-medium  text-gray-900 leading-normal w-[200px]">
                                        UN Sanction Report{" "}
                                        <span className="text-red-500 !mb-0">
                                        *
                                      </span>

                                      </p>

                                      <div className="flex items-center gap-2 ">
                                        <div className="input-group relative">
                                          <div className="relative">
                                            <input
                                              type="text"
                                              className="px-2 :bg-gray-50"
                                               value={
                                                  buyerKycImages1 &&
                                                  buyerKycImages1[id] &&
                                                  buyerKycImages1[id][1] &&
                                                  typeof buyerKycImages1[
                                                    id
                                                  ][1] === "string"
                                                    ? buyerKycImages1[id][1]
                                                        .split("kyc/")
                                                        .pop()
                                                    : buyerKycImages1[id] &&
                                                      buyerKycImages1[id][1]
                                                        ?.name
                                                    ? buyerKycImages1[id][1]
                                                        ?.name
                                                    : ""
                                                }
                                              placeholder="UN report"
                                              readOnly
                                            />
                                            <label
                                              for={`UN report${id}`}
                                              className="absolute !bg-slate-50 px-1  cursor-pointer text-xl right-0 mx-auto my-auto"
                                            >
                                              <LuPlus />
                                            </label>
                                          </div>
                                          <input
                                            onChange={(e) =>
                                              handleFileChange2(
                                                id,
                                                1,
                                                e.target.files
                                              )
                                            }
                                            required
                                            className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                            aria-describedby="file_input_help"
                                            id={`UN report${id}`}
                                            type="file"
                                            accept=".pdf"
                                          />
                                          <FaRegEye
                                            className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                            onClick={() =>
                                              buyerKycImages1[id] &&
                                              buyerKycImages1[id][1] &&
                                              setShowUnSanction2(true)
                                            }
                                          />

                                          {buyerKycImages1[id] &&
                                            buyerKycImages1[id][1] &&
                                            showUnSanction2 && (
                                              <div className="!flex !flex-col gap-2 !w-[80%] !rounded-md !h-[95%] fixed items-end bottom-5 left-[12%] z-[9999]">
                                                <IoMdClose
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300  !text-gray-900"
                                                  onClick={() =>
                                                    setShowUnSanction2(false)
                                                  }
                                                />
                                                <embed
                                                  src={
                                                    buyerKycImages1[id][1]?.name
                                                      ? URL.createObjectURL(
                                                          buyerKycImages1[id][1]
                                                        )
                                                      : path +
                                                        buyerKycImages1[id][1]
                                                          ?.split("kyc/")
                                                          .pop()
                                                  }
                                                  type="application/pdf"
                                                  className="w-full h-full"
                                                />
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex  gap-3">
                                      <p className="block mb-0 text-lg font-medium  text-gray-900 leading-normal w-[200px]">
                                        Risk Anaylysis Form{" "}
                                        <span className="text-red-500 !mb-0">
                                        *
                                      </span>
                                      </p>

                                      <div className="flex items-center gap-2 ">
                                        <div className="input-group relative">
                                          <div className="relative">
                                            <input
                                              type="text"
                                                value={
                                                  buyerKycImages1 &&
                                                  buyerKycImages1[id] &&
                                                  buyerKycImages1[id][2] &&
                                                  typeof buyerKycImages1[
                                                    id
                                                  ][2] === "string"
                                                    ? buyerKycImages1[id][2]
                                                        .split("kyc/")
                                                        .pop()
                                                    : buyerKycImages1[id] &&
                                                      buyerKycImages1[id][2]
                                                        ?.name
                                                    ? buyerKycImages1[id][2]
                                                        ?.name
                                                    : ""
                                                }
                                              className="px-2 :bg-gray-50"
                                              placeholder="Risk Form"
                                              readOnly
                                            />
                                            <label
                                              for={`Risk form${id}`}
                                              className="absolute !bg-slate-50 px-1 cursor-pointer text-xl right-0 mx-auto my-auto"
                                            >
                                              <LuPlus />
                                            </label>
                                          </div>
                                          <input
                                            onChange={(e) =>
                                              handleFileChange2(
                                                id,
                                                2,
                                                e.target.files
                                              )
                                            }
                                            required
                                            className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                            aria-describedby="file_input_help"
                                            id={`Risk form${id}`}
                                            type="file"
                                            accept=".pdf"
                                          />
                                          <FaRegEye
                                            className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                            onClick={() =>
                                              buyerKycImages1[id] &&
                                              buyerKycImages1[id][2] &&
                                              setShowRiskForm2(true)
                                            }
                                          />

                                          {buyerKycImages1[id] &&
                                            buyerKycImages1[id][2] &&
                                            buyerKycImages1[id][2] &&
                                            showRiskForm2 && (
                                              <div className="!flex !flex-col gap-2 !w-[80%] !rounded-md !h-[95%] fixed items-end bottom-5 left-[12%] z-[9999]">
                                                <IoMdClose
                                                  onClick={() =>
                                                    setShowRiskForm2(false)
                                                  }
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300  !text-gray-900"
                                                />
                                                <embed
                                                  src={
                                                    buyerKycImages1[id][2]?.name
                                                      ? URL.createObjectURL(
                                                          buyerKycImages1[id][2]
                                                        )
                                                      : path +
                                                        buyerKycImages1[id][2]
                                                          ?.split("kyc/")
                                                          .pop()
                                                  }
                                                  type="application/pdf"
                                                  className="w-full h-full"
                                                />
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex  gap-3">
                                      <p className="block mb-0 text-lg font-medium  text-gray-900 leading-normal w-[200px]">
                                        UAE Sanction Report{" "}
                                        <span className="text-red-500 !mb-0">
                                        *
                                      </span>

                                      </p>

                                      <div className="flex items-center gap-2 ">
                                        <div className="input-group relative">
                                          <div className="relative">
                                            <input
                                              type="text"
                                                 value={
                                                  buyerKycImages1 &&
                                                  buyerKycImages1[id] &&
                                                  buyerKycImages1[id][3] &&
                                                  typeof buyerKycImages1[
                                                    id
                                                  ][3] === "string"
                                                    ? buyerKycImages1[id][3]
                                                        .split("kyc/")
                                                        .pop()
                                                    : buyerKycImages1[id] &&
                                                      buyerKycImages1[id][3]
                                                        ?.name
                                                    ? buyerKycImages1[id][3]
                                                        ?.name
                                                    : ""
                                                }
                                              className="px-2 :bg-gray-50"
                                              placeholder="UAE Sanction Report"
                                              readOnly
                                            />
                                            <label
                                              for={`Uae sanction${id}`}
                                              className="absolute !bg-slate-50 px-1 cursor-pointer text-xl right-0 mx-auto my-auto"
                                            >
                                              <LuPlus />
                                            </label>
                                          </div>
                                          <input
                                            onChange={(e) =>
                                              handleFileChange2(
                                                id,
                                                3,
                                                e.target.files
                                              )
                                            }
                                            required
                                            className="!hidden text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                            aria-describedby="file_input_help"
                                            id={`Uae sanction${id}`}
                                            type="file"
                                            accept=".pdf"
                                          />
                                          <FaRegEye
                                            className="absolute cursor-pointer text-xl right-[-30px] mx-auto my-auto"
                                            onClick={() =>
                                              buyerKycImages1[id] &&
                                              buyerKycImages1[id][3] &&
                                              setShowUaeSanction2(true)
                                            }
                                          />

                                          {buyerKycImages1[id] &&
                                            buyerKycImages1[id][3] &&
                                            showUaeSanction2 && (
                                              <div className="!flex !flex-col gap-2 !w-[80%] !rounded-md !h-[95%] fixed items-end bottom-5 left-[12%] z-[9999]">
                                                <IoMdClose
                                                  className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300  !text-gray-900"
                                                  onClick={() =>
                                                    setShowUaeSanction2(false)
                                                  }
                                                />
                                                <embed
                                                  src={
                                                    buyerKycImages1[id][3]?.name
                                                      ? URL.createObjectURL(
                                                          buyerKycImages1[id][3]
                                                        )
                                                      : path +
                                                        buyerKycImages1[id][3]
                                                          ?.split("kyc/")
                                                          .pop()
                                                  }
                                                  type="application/pdf"
                                                  className="w-full h-full"
                                                />
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </AccordionItemPanel>
                          </AccordionItem>
                        );
                      })}
                  </Accordion>

                  <div className="flex gap-4 w-full justify-end mt-5">
                    <button
                      className={`text-white flex items-center disabled:bg-slate-300  ${submitError ? 'bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300': 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300'}  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 `}
                      onClick={HandleSubmit}
                      disabled={ myData[0]?.buyername == '' || myData[0]?.buyerContact == '' }
                      type="submit"
                    >
                        {
                            submitting ? <div role="status">
                            <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="black" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                        
                        </div>:
                        'Submit'
                        }
                        
                         
                        
                    
                    </button>
                    
                  </div>
                </form>
              )}

              {formCounter === 2 && (
                <div className="w-full mt-5">
                  <div className="flex flex-col items-center">
                    <p className="text-3xl text-red-600 w-full text-center mt-20 font-[900]">
                      You have successfully submitted KYC Documents
                    </p>
                    <p className="text-3xl text-red-600 w-full text-center ">
                      if there are any discrepancies found please disapprove
                      with your following comments <br /> Or <br /> Approve if
                      information is 100% accurate{" "}
                    </p>

                    <textarea
                      className="w-[85%] h-[20vh] !border !border-gray-400 rounded-md resize-none px-2 py-2"
                      placeholder="Add Comments here"
                      value={finalReason}
                      onChange={(e) => setFinalReason(e.target.value)}
                      
                    />
                    
                  </div>

                  <div className="flex gap-4 w-full justify-center mt-5">
                    <div >
                      <button onClick={approved}  className="text-black text-lg bg-green-400 hover:bg-green-500 focus:ring-4  font-medium rounded-lg  px-5 py-2.5 me-2 mb-2 ">
                        Submit
                      </button>
                    </div>
                    <div>
                      <button  onClick={Reject} className="text-white bg-red-700 text-lg hover:bg-red-800 focus:ring-4  font-medium rounded-lg  px-5 py-2.5 me-2 mb-2 ">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}

export default Invoice;
