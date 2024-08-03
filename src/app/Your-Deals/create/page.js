"use client";
import React from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RootLayout from '@/app/components/layout';
import SearchableSelect from '@/app/Leads/dropdown';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from 'next/navigation'
import { RxCross1 } from "react-icons/rx";
import { ImCross } from "react-icons/im";
import { LuPlus } from "react-icons/lu";
import { ImPlus } from "react-icons/im";
import {
    Accordion,
    AccordionItem,
    AccordionItemButton,
    AccordionItemHeading,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import { NumericFormat } from 'react-number-format';

function Invoice() {
    const [toastShown, setToastShown] = useState(false);
    const router = useRouter();
    const [isDateInput, setIsDateInput] = useState(false);
    const [formCounter, setFormCounter] = useState(1)
    const [radioBtnStatus, setRadioBtnStatus] = useState('')
    const [buyerImages, setBuyerImages] = useState([[]]); // Nested array to hold images for each buyer
    const [Oherimage, setOtherImage] = useState([[]]); // Nested array to hold images for each buyer
    const [buyerImages1, setBuyerImages1] = useState([[]]); // Nested array to hold images for each buyer
    console.log(Oherimage);
    const toggleInputType = () => {
        setIsDateInput((prevIsDateInput) => !prevIsDateInput);
    };

    window.addEventListener('beforeunload', function (e) {
        const urlParams = new URLSearchParams(window.location.search);
        const leadId = urlParams.get('leadId');

        if (leadId) {
            // Show a confirmation dialog
            const confirmationMessage = 'Are you sure you want to leave this page?';
            e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
            return confirmationMessage; // Gecko, WebKit, Chrome <34
        }
    });
    useEffect(() => {

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            alert('Please open this page from a desktop.');
            router.back();
        }
        if (toastShown == false) {
            toast.success('Congratulations!! On closing your amazing new deal! Kindly fill out the form below to submit the transaction details.', {
                autoClose: 2000,
                closeButton: false
            });
            setToastShown(true)
        }
    }, []);

    const options1 = [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },

    ]


    const searchParams = useSearchParams()

    const leadId = searchParams.get('leadId')
    const [lead, setLead] = useState(null);


    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await axios.get(`/api/Lead/${leadId}`);
                const leadData = response.data.data;

                setLead(response.data.data);
                setBuyerOneData(prevbuyerOneData => ({
                    ...prevbuyerOneData,
                    buyername: leadData.Name,
                    buyerEmail: leadData.Email,
                    buyerContact: leadData.Phone,
                }));
            } catch (error) {
                console.error('Error fetching lead:', error);
            }
        };

        if (leadId) {
            fetchLead();
        }
    }, [leadId]);



    const [buyerOneData, setBuyerOneData] = useState({
        buyerdob: "",
        buyerpassport: "",
        passportexpiry: "",
        nationality: "",
        Resident: "",
        emiratesExpiry: "",
        emiratesid: "",
        address: "",
        EOI: "",
        Closure: "",
        Booking: "",
        Handover: "",
        Property: "",
        Developer: "",
        ProjectName:"",
        Bed: "",
        BUA: "",
        PlotArea: "",
        PlotNumber: "",
        Ready: "",
        Unitaddress: "",
        Price: Number(),
        Comission: "",
        SpotCash: "",
        TotalComission: Number(),
        VAT: Number(),
        ComissionVAT: Number(),
        External: "",
        tokenDate: "",
        closureDate: "",
        bookingDate: "",
        handoverDate: "",
        propertyType: "",
        developer: "",
        otherDeveloper: "",
        spotCash: "",
        commisionttype: "",
        grandTotalCommission: Number(),
        loyaltyBonus:Number(),
        netcom: Number(),
        leadId:leadId,
    })
    useEffect(() => {
        const cachedData = localStorage.getItem('buyerOneData');
        if (cachedData) {
            setBuyerOneData(JSON.parse(cachedData));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('buyerOneData', JSON.stringify(buyerOneData));
    }, [buyerOneData]);


    useEffect(() => {
        if (buyerOneData.commisionttype === '%') {
            if (buyerOneData.Price && buyerOneData.Comission) {
                const price = parseFloat((buyerOneData.Price ?? '0').replace(/,/g, ''));
                const commission = parseFloat((buyerOneData.Comission ?? '0').replace(/,/g, ''));
                
                        if(commission > 100){
                        toast.error("Comission percentage cannot be more than 100%");
                          setBuyerOneData((prevState) => ({
                            ...prevState,
                            Comission: '',  // Reset commission to 0
                        }));
                }
                const gtc = (price * commission) / 100;
                setBuyerOneData((prevState) => ({
                    ...prevState,
                    grandTotalCommission: gtc
                }));
            }
        } else {
            setBuyerOneData((prevState) => ({
                ...prevState,
                grandTotalCommission: parseFloat((buyerOneData.Comission ?? '0').replace(/,/g, ''))
            }));
        }
    }, [buyerOneData.Price, buyerOneData.Comission, buyerOneData.commisionttype]);


    useEffect(() => {
        if (buyerOneData.Comission == "") {
            setBuyerOneData((prevState) => ({
                ...prevState,
                grandTotalCommission: "",
                VAT: "",
                Comission:"",
                ComissionVAT: "",
                netcom: "",
                TotalComission:"",

            }));
        }

    }, [buyerOneData.Comission,buyerOneData.grandTotalCommission,buyerOneData.VAT,buyerOneData.ComissionVAT,buyerOneData.netcom,buyerOneData.TotalComission,buyerOneData.commisionttype]);


    useEffect(() => {
        const vat = (buyerOneData.grandTotalCommission * 5) / 100;
        setBuyerOneData((prevState) => ({
            ...prevState,
            VAT: vat,

        }));

    }, [buyerOneData.grandTotalCommission]);

  

useEffect(() => {
    if (typeof buyerOneData.VAT !== 'number' || typeof buyerOneData.grandTotalCommission !== 'number') {
        return;
    }

    let tnc = 0;
    const tic = Number(buyerOneData.VAT) + Number(buyerOneData.grandTotalCommission);

    let loyaltyBonusNumber = 0;
    if (typeof buyerOneData.loyaltyBonus === 'string') {
        const loyaltyBonusWithoutCommas = buyerOneData.loyaltyBonus.replace(/,/g, '');
        loyaltyBonusNumber = Number(loyaltyBonusWithoutCommas);
        tnc = buyerOneData.grandTotalCommission - loyaltyBonusNumber;

    }

    else {
        tnc = buyerOneData.grandTotalCommission;
    }

    setBuyerOneData((prevState) => ({
        ...prevState,
        netcom: tnc,
        TotalComission: tic
    }));

}, [buyerOneData.grandTotalCommission, buyerOneData.VAT, buyerOneData.loyaltyBonus]);




    const [tempAddedBuyerData, setTempAddedBuyerData] = useState([])


    const handleSelectChange2 = (buyerOneData, selectedOption2) => {
        setBuyerOneData(prevLeads => ({
            ...prevLeads,
            [buyerOneData]: selectedOption2.value
        }));
    };

    const handleSelectChange = (index, selectedOption) => {
        setTempAddedBuyerData(curr => {
            if (Array.isArray(curr)) {
                return curr.map((buyer, id) => id === index ? { ...buyer, Resident: selectedOption.value } : buyer);
            }
            return [];
        });
    };

    const handleFileChange = (index, fileIndex, files) => {
        setBuyerImages(prev => {
            const updatedImages = [...prev];
            updatedImages[index] = [...(updatedImages[index] || [])];
            updatedImages[index][fileIndex] = files[0];
            return updatedImages;
        });
    };
    const handleFileChange2 = (index, fileIndex, files) => {
        setOtherImage(prev => {
            const updatedImages = [...prev];
            updatedImages[index] = [...(updatedImages[index] || [])];
            updatedImages[index][fileIndex] = files[0];
            return updatedImages;
        });
    };

    const handleFileChange3 = (index, fileIndex, files) => {
        setBuyerImages1(prev => {
            const updatedImages = [...prev];
            updatedImages[index] = [...(updatedImages[index] || [])];
            updatedImages[index][fileIndex] = files[0];
            return updatedImages;
        });
    };







    const addBuyer = () => {
        // Initialize tempAddedBuyerData if it's null
        if (!tempAddedBuyerData) {
            setTempAddedBuyerData([
                {
                    buyername: '',
                    buyercontact: '',
                    buyeremail: '',
                    buyerdob: '',
                    buyerpassport: '',
                    passportexpiry: '',
                    nationality: '',
                    Resident: '',
                    emiratesExpiry: '',
                    emirateid: '',
                    address: '',
                }
            ]);
            return;
        }

        // Check if tempAddedBuyerData is empty
        if (tempAddedBuyerData.length === 0) {
            setTempAddedBuyerData([
                {
                    buyername: '',
                    buyercontact: '',
                    buyeremail: '',
                    buyerdob: '',
                    buyerpassport: '',
                    passportexpiry: '',
                    nationality: '',
                    Resident: '',
                    emiratesExpiry: '',
                    emirateid: '',
                    address: '',
                }
            ]);
            return;
        }

        let mandatoryFields = [];
        if (tempAddedBuyerData[tempAddedBuyerData.length - 1].Resident == 'Yes') {
            mandatoryFields = ['buyername', 'buyercontact', 'buyerdob', 'buyerpassport', 'passportexpiry', 'nationality', 'Resident', 'emiratesExpiry', 'emirateid', 'address'];
        } else {
            mandatoryFields = ['buyername', 'buyercontact', 'buyerdob', 'buyerpassport', 'passportexpiry', 'nationality', 'Resident', 'address'];
        }

        const lastAddedBuyer = tempAddedBuyerData[tempAddedBuyerData.length - 1];

        if (!lastAddedBuyer) {
            return;
        }

        const emptyFields = mandatoryFields.filter(field => !lastAddedBuyer[field]);

        const imageErrors = [];
        const buyerIndex = tempAddedBuyerData.length - 1;
        const buyerImagestmp = buyerImages[buyerIndex] || [];


        if (!buyerImagestmp[0]) {
            imageErrors.push('Passport front required');
        }
        if (!buyerImagestmp[1]) {
            imageErrors.push('Passport back required');
        }
        if (lastAddedBuyer.Resident === 'Yes' && !buyerImagestmp[2]) {
            imageErrors.push('Emirates ID required');
        }


        if (emptyFields.length > 0 || imageErrors.length > 0) {
            const emptyFieldNames = emptyFields.map(field => field.replace(/([A-Z])/g, ' $1').toLowerCase());
            const errorMessages = [
                ...emptyFieldNames.length > 0 ? [`Please fill all the mandatory fields for the last added buyer: ${emptyFieldNames.join(', ')}`] : [],
                ...imageErrors.length > 0 ? imageErrors : []
            ];
            toast.error(errorMessages.join('\n'));
        } else {
            // Add new empty buyer
            setTempAddedBuyerData(curr => [
                ...curr,
                {
                    buyername: '',
                    buyercontact: '',
                    buyeremail: '',
                    buyerdob: '',
                    buyerpassport: '',
                    passportexpiry: '',
                    nationality: '',
                    Resident: '',
                    emiratesExpiry: '',
                    address: '',
                }
            ]);
        }
    };


    const removeLastBuyer = () => {
        console.log("alert")
        console.log(tempAddedBuyerData.length)
        setTempAddedBuyerData(curr => {
            const newData = [...curr];
            newData.pop(); // Remove the last item
            return newData;
        });
    };


    const onClickBack = () => {
        let mandatoryFields = [];
        if (buyerOneData.Resident === "Yes") {
            mandatoryFields = ['buyerdob', 'buyerpassport', 'passportexpiry', 'nationality', 'Resident', 'emiratesExpiry', 'emiratesid', 'address'];
        } else {
            mandatoryFields = ['buyerdob', 'buyerpassport', 'passportexpiry', 'nationality', 'Resident', 'address'];
        }

        const emptyFields = mandatoryFields.filter(field => !buyerOneData[field]);
        const imageErrors = [];
        if (!buyerImages1[0] || !buyerImages1[0][0]) {
            imageErrors.push('Passport front required');
        }
        if (!buyerImages1[0] || !buyerImages1[0][1]) {
            imageErrors.push('Passport back required');
        }
        if (buyerOneData.Resident === "Yes") {
            if (!buyerImages1[0] || !buyerImages1[0][2]) {
                imageErrors.push('Emirates ID required');
            }
        }
        if (emptyFields.length > 0 || imageErrors.length > 0) {
            const emptyFieldNames = emptyFields.map(field => field.replace(/([A-Z])/g, ' $1').toLowerCase());
            const errorMessages = [
                ...emptyFieldNames.length > 0 ? [`Please fill all the following mandatory fields.`] : [],
                ...imageErrors.length > 0 ? imageErrors : []
            ];
            toast.error(errorMessages.join('\n')); (errorMessages.join('\n'));
            return;
        }

        if (tempAddedBuyerData.length > 0) {
            let lastBuyerMandatoryFields = [];
            if (tempAddedBuyerData[tempAddedBuyerData.length - 1].Resident === 'Yes') {
                lastBuyerMandatoryFields = ['buyername', 'buyercontact', 'buyerdob', 'buyerpassport', 'passportexpiry', 'nationality', 'Resident', 'emiratesExpiry', 'emirateid', 'address'];
            } else {
                lastBuyerMandatoryFields = ['buyername', 'buyercontact','buyerdob', 'buyerpassport', 'passportexpiry', 'nationality', 'Resident', 'address'];
            }

            const lastAddedBuyer = tempAddedBuyerData[tempAddedBuyerData.length - 1];

            if (!lastAddedBuyer) {
                return;
            }

            const lastBuyerEmptyFields = lastBuyerMandatoryFields.filter(field => !lastAddedBuyer[field]);
            const lastBuyerImageErrors = [];
            const buyerIndex = tempAddedBuyerData.length - 1;
            const buyerImagestmp = buyerImages[buyerIndex] || [];

            if (!buyerImagestmp[0]) {
                lastBuyerImageErrors.push('Passport front required');
            }
            if (!buyerImagestmp[1]) {
                lastBuyerImageErrors.push('Passport back required');
            }
            if (lastAddedBuyer.Resident === 'Yes' && !buyerImagestmp[2]) {
                lastBuyerImageErrors.push('Emirates ID required');
            }

            if (lastBuyerEmptyFields.length > 0 || lastBuyerImageErrors.length > 0) {
                const lastBuyerEmptyFieldNames = lastBuyerEmptyFields.map(field => field.replace(/([A-Z])/g, ' $1').toLowerCase());
                const lastBuyerErrorMessages = [
                    ...lastBuyerEmptyFieldNames.length > 0 ? [`Please fill all the following mandatory fields for the last added buyer}`] : [],
                    ...lastBuyerImageErrors.length > 0 ? lastBuyerImageErrors : []
                ];
                toast.error(lastBuyerErrorMessages.join('\n'));
                return;
            }
        }
        setFormCounter((prev) => prev < 3 ? prev + 1 : prev);
    };



    const handleInputChange = (index, field, value) => {
        setTempAddedBuyerData(curr => {
            if (Array.isArray(curr)) {
                return curr.map((buyer, id) => id === index ? { ...buyer, [field]: value } : buyer);
            }
            return [];
        });
    };

    const nextHandler = () => {

        setFormCounter((prev) => prev < 4 ? prev + 1 : prev)
        setBuyerOneData([buyerOneData, ...tempAddedBuyerData])
    }

    const propertyOptions = [
        { value: 'Apartment', label: 'Apartment' },
        { value: 'Town House', label: 'Town House' },
        { value: 'Villa', label: 'Villa' }

    ]

    const developerOptions = [
        { value: 'Emaar Properties', label: 'Emaar Properties' },
        { value: 'DAMAC Properties', label: 'DAMAC Properties' },
        { value: 'Nakheel Properties', label: 'Nakheel Properties' },
        { value: 'Meraas', label: 'Meraas' },
        { value: 'MAG Property Development', label: 'MAG Property Development' },
        { value: 'Sobha Realty', label: 'Sobha Realty' },
        { value: 'Danube Properties', label: 'Danube Properties' },
        { value: 'Azizi Developments', label: 'Azizi Developments' },
        { value: 'Al Futtaim Group Real Estate', label: 'Al Futtaim Group Real Estate' },
        { value: 'other', label: 'Other' },
    ]
    const readyStatus = [
        { value: 'Ready', label: 'Ready' },
        { value: 'Off-Plan', label: 'Off-Plan' },

    ]

    const commissionCurrency = [
        { value: '%', label: '%' },
        { value: 'AED', label: 'AED' },

    ]

    const data = {
        buyerOneData: buyerOneData,
        tempAddedBuyerData: tempAddedBuyerData,
        radioBtnStatus: radioBtnStatus,
    };
   const[submitting, setSubmitting] = useState(false)

    const HandleSubmit = async () => {
        let mandatoryFields = []
        if (buyerOneData.developer === "other") {
            mandatoryFields = ['tokenDate', 'closureDate', 'bookingDate', 'handoverDate', 'propertyType', 'developer', 'otherDeveloper', 'Bed', 'BUA', 'PlotArea', 'Ready', 'Unitaddress', 'Price', 'Comission','ProjectName'];
            if (buyerOneData.propertyType !== "Apartment") {
                mandatoryFields = [...mandatoryFields, 'PlotNumber'];
            }
        } else {
            mandatoryFields = ['tokenDate', 'closureDate', 'bookingDate', 'handoverDate', 'propertyType', 'developer', 'Bed', 'BUA', 'PlotArea', 'Ready', 'Unitaddress', 'Price', 'Comission','ProjectName'];
            if (buyerOneData.propertyType !== "Apartment") {
                mandatoryFields = [...mandatoryFields, 'PlotNumber'];
            }
        }

        const emptyFields = mandatoryFields.filter(field => !buyerOneData[field]);

        const imageErrors = [];
        if (!Oherimage[0] || !Oherimage[0][0]) {
            imageErrors.push('Eoi Receipt required');
        }
        if (!Oherimage[1] || !Oherimage[1]) {
            imageErrors.push('Booking form required');
        }

        if (emptyFields.length > 0 || imageErrors.length > 0) {
            const emptyFieldNames = emptyFields.map(field => field.replace(/([A-Z])/g, ' $1').toLowerCase());
            const errorMessages = [
                ...emptyFieldNames.length > 0 ? [`Please fill all the following mandatory fields.`] : [],
                ...imageErrors.length > 0 ? imageErrors : []
            ];
            toast.error(errorMessages.join('\n'));
            return;
        }
        else {
            const imagePromises = [];

            const buyerImagesBase64 = buyerImages.map((images) =>
                images.map((image) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(image);
                    return new Promise((resolve) => {
                        reader.onloadend = () => {
                            resolve(reader.result);
                        };
                    });
                })
            );

            const OtherImageBase64 = Oherimage.map((images) =>
                images.map((image) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(image);
                    return new Promise((resolve) => {
                        reader.onloadend = () => {
                            resolve(reader.result);
                        };
                    });
                })
            );



            const buyerImages1Base64 = buyerImages1[0].map((image) => {
                const reader = new FileReader();
                reader.readAsDataURL(image);
                return new Promise((resolve) => {
                    reader.onloadend = () => {
                        resolve(reader.result);
                    };
                });
            });

            imagePromises.push(Promise.all(buyerImagesBase64.flat()));
            imagePromises.push(Promise.all(OtherImageBase64.flat()));
            imagePromises.push(Promise.all(buyerImages1Base64));

            // Wait for all base64 conversion to finish
            const resolvedImages = await Promise.all(imagePromises);

            const imageData = {
                buyerImages: resolvedImages[0],
                OtherImage: resolvedImages[1],
                buyerImages1: resolvedImages[2],
            };

            const updatedData = {
                ...data,
            };
            setSubmitting(true)
            try {
                const response = await axios.post("/api/invoice/add", { buyerImages1Base64: imageData, data: updatedData });
                setSubmitting(false)
                setFormCounter((prev) => prev < 4 ? prev + 1 : prev);

            } catch (error) {
                console.log(error);
            }
        }
    };
 const handleKeyDown = (event) => {
    event.preventDefault();
  };
    return (
        <RootLayout>
            <div className="w-full mt-24">
                <div className='w-full'>
                    <div className='w-full flex justify-center  items-center'>
                        <div className=' w-full flex flex-col justify-center items-center'>
                            <div className='bg-blue w-full '>
                                <h4 className='text-white mb-0 text-center'>Deal Type</h4>
                            </div>
                            {
                                formCounter === 1 && <div className="flex flex-col  w-full max-w-[85%] gap-4 h-[65svh] mt-[3em]" >

                                    <div className='flex gap-4 justify-center items-center'>
                                        <p className='text-2xl mb-0'>Your Deal Type:</p>
                                        <div className='flex items-center mt-1 h-[50svh]'>
                                            <label className='text-xl mb-0' htmlFor='checker1'>Off-Plan</label>
                                            <input className="ml-2" type="radio" id='checker1' name='dealRadio' value='offPlan'
                                                onChange={(e) => setRadioBtnStatus(e.target.value)}
                                                checked={radioBtnStatus === 'offPlan'}
                                            />
                                        </div>
                                        <div className='flex items-center mt-1'>
                                            <label className='text-xl mb-0' htmlFor='checker2'>Secondary</label>
                                            <input className="ml-2" type="radio" id='checker2' name='dealRadio' value='secondaryPlan'
                                                checked={radioBtnStatus === 'secondaryPlan'}
                                                onChange={(e) => setRadioBtnStatus(e.target.value)} />
                                        </div>


                                    </div>
                                    <div className=''> </div>
                                    <div className='flex gap-4 justify-end '>
                                        <button disabled={formCounter < 2} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  disabled:bg-gray-200' onClick={() => { setFormCounter((prev) => prev > 1 ? prev - 1 : prev) }}>Back</button>
                                        <button disabled={radioBtnStatus !== 'offPlan' && radioBtnStatus !== 'secondaryPlan'} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 disabled:bg-gray-200 ' onClick={() => { setFormCounter((prev) => prev + 1) }}>Next</button>
                                    </div>
                                </div>

                            }

                            {
                                formCounter === 2 ? radioBtnStatus === 'offPlan' ?
                                    <div className='w-full max-w-[85%] mt-3'>
                                        <Accordion allowZeroExpanded preExpanded={['a']}>

                                            <AccordionItem uuid='a' className='mt-2'>
                                                <AccordionItemHeading className='bg-white py-2 px-2'>
                                                    <AccordionItemButton className='flex w-full justify-between' >
                                                        Buyer 1
                                                        <ImPlus />
                                                    </AccordionItemButton>
                                                </AccordionItemHeading>
                                                <AccordionItemPanel>
                                                    <div className='grid grid-cols-2 gap-x-5 gap-y-3 mt-4'>
                                                        <div className="">
                                                            <label>Full name</label>
                                                            <input disabled className="form-control" type="text"
                                                                value={buyerOneData.buyername} onChange={(e) => setBuyerOneData({ ...buyerOneData, buyername: e.target.value })}
                                                                placeholder="Buyer Cutomer Name" />
                                                        </div>
                                                        <div className="">
                                                            <label>Phone</label>
                                                            <input disabled className="form-control" value={buyerOneData.buyerContact} type="number" onChange={(e) => setBuyerOneData({ ...buyerOneData, buyerContact: e.target.value })}
                                                                placeholder="Contact Number" />
                                                        </div>
                                                        <div className="">
                                                            <label>Email</label>
                                                            <input  className="form-control" value={buyerOneData.buyerEmail} type="text" onChange={(e) => setBuyerOneData({ ...buyerOneData, buyerEmail: e.target.value })}
                                                                placeholder="Email" />
                                                        </div>

                                                        <div className="">
                                                            <label>Date of Birth <span className='text-red-500'>*</span></label>
                                                            <input
                                                                className="form-control"
                                                                type="date"
                                                                onKeyDown={handleKeyDown}
                                                                onFocus={toggleInputType}
                                                                value={buyerOneData.buyerdob}
                                                                onChange={(e) => setBuyerOneData({ ...buyerOneData, buyerdob: e.target.value })}
                                                                placeholder="Date of Birth"
                                                                max={new Date().toISOString().split('T')[0]} // Set max date to today's date

                                                            />
                                                        </div>

                                                        <div className="">
                                                            <label>Passport Number <span className='text-red-500'>*</span></label>
                                                            
                                                            <input className="form-control" value={buyerOneData.buyerpassport} type="text" onChange={(e) => setBuyerOneData({ ...buyerOneData, buyerpassport: e.target.value })}
                                                                placeholder="Passport Number" />
                                                        </div>

                                                        <div className="">
                                                            <label>Passport Expiry <span className='text-red-500'>*</span></label>
                                                            <input
                                                                className="form-control"
                                                                type="date"
                                                                onKeyDown={handleKeyDown}
                                                                onFocus={toggleInputType}
                                                                value={buyerOneData.passportexpiry}
                                                                onChange={(e) => setBuyerOneData({ ...buyerOneData, passportexpiry: e.target.value })}
                                                                placeholder="Emirates Expiry"
                                                                min={new Date().toISOString().split('T')[0]} // Set max date to today's date

                                                            />
                                                        </div>
                                                        <div className="">
                                                            <label>Nationality <span className='text-red-500'>*</span></label>
                                                            <input className="form-control" value={buyerOneData.nationality} type="text" onChange={(e) => setBuyerOneData({ ...buyerOneData, nationality: e.target.value })}
                                                                placeholder="Nationality" />
                                                        </div>
                                                        <div className="">
                                                            <label>UAE Resident/Non Resident <span className='text-red-500'>*</span></label>

                                                            <SearchableSelect options={options1} defaultValue={buyerOneData.Resident} onChange={(selectedOption2) => handleSelectChange2('Resident', selectedOption2)}></SearchableSelect>
                                                        </div>
                                                        <div className="">
                                                            <label>Emirates ID</label>
                                                            <input disabled={buyerOneData.Resident === 'No' || !buyerOneData.Resident} value={buyerOneData.emiratesid} onChange={(e) => setBuyerOneData({ ...buyerOneData, emiratesid: e.target.value })} className="form-control" type="text"
                                                                placeholder="Emirates ID" />
                                                        </div>
                                                        <div className="">
                                                            <label>Emirates Expiry</label>
                                                            <input
                                                                className="form-control"
                                                                type="date"
                                                                onKeyDown={handleKeyDown}
                                                                disabled={buyerOneData.Resident === 'No' || !buyerOneData.Resident}
                                                                onFocus={toggleInputType}
                                                                value={buyerOneData.emiratesExpiry}
                                                                onChange={(e) => setBuyerOneData({ ...buyerOneData, emiratesExpiry: e.target.value })}
                                                                placeholder="Emirates Expiry"
                                                                min={new Date().toISOString().split('T')[0]} // Set max date to today's date
                                                            />
                                                        </div>

                                                        <div className="col-span-2">
                                                            <label>Buyer Address <span className='text-red-500'>*</span></label>
                                                            <input className="form-control" type="text" value={buyerOneData.address}
                                                                onChange={(e) => setBuyerOneData({ ...buyerOneData, address: e.target.value })}
                                                                placeholder="Buyer Address" />
                                                        </div>
                                                    </div>
                                                    <div className='w-full mt-4'>
                                                        <div className='w-full flex items-center justify-between '>
                                                            <p className='w-full relative overflow-hidden block text-xl font-bold'><span className='block relative after:content-[" "] align-baseline  after:absolute after:w-full after:h-2 after:border-t-4 after:ml-3 after:border-slate-400 after:top-[50%]'>Documents to Upload</span></p>
                                                        </div>
                                                        <div className='w-full grid grid-cols-2 gap-x-5 gap-y-3'>
                                                            <div>

                                                                <div className='flex  gap-3'>
                                                                    <p className="block mb-0 text-lg font-medium  text-gray-900 leading-normal "  >Buyer's Passport <span className='text-red-500'>*</span></p>
                                                                    <div >
                                                                        <div className='flex items-center gap-2 '>

                                                                            <div className="input-group" >


                                                                                <div className='relative'>
                                                                                    <label for='emirateID' className='absolute cursor-pointer text-xl right-0 mx-auto my-auto'></label>
                                                                                </div>
                                                                                <p>Passport Front</p>

                                                                                <input onChange={(e) => handleFileChange3(0, 0, e.target.files)} className="block  text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none" aria-describedby="file_input_help" id="emirateID"  title="Passport front" type="file" />


                                                                            </div>
                                                                        </div>

                                                                        <div className='flex items-top gap-2 mt-2'>

                                                                            <div className="input-group">

                                                                                <div className='relative'>
                                                                                    <label for='emirateID' className='absolute cursor-pointer text-xl right-0 mx-auto my-auto'></label>
                                                                                </div>

                                                                                  <p>Passport Back</p>
                                                                                <input onChange={(e) => handleFileChange3(0, 1, e.target.files)} className="block  text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none" aria-describedby="file_input_help" id="emirateID" type="file" title="Passport Back"  />

                                                                            </div>
                                                                        </div>
                                                                        
                                                                        
                                                                       


                                                                    </div>
                                                                </div>
                                                            </div>


                                                            {
                                                                buyerOneData.Resident === '' || buyerOneData.Resident == 'No' ? null : <div>

                                                                    <div className='flex items-center gap-4'>
                                                                        <p className="block text-lg mb-0 leading-normal font-medium text-gray-900"  >Emirates ID</p>
                                                                        <div>
                                                                            <div className='flex items-center gap-2'>

                                                                                <div className='relative'>
                                                                                    <label for='emirateID' className='absolute cursor-pointer text-xl right-0 mx-auto my-auto'></label>
                                                                                </div>


                                                                                <input onChange={(e) => handleFileChange3(0, 3, e.target.files)} className="block  text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none" aria-describedby="file_input_help" id="emirateID" type="file" title="Emirate Id"  />


                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            }
                                                        </div>
                                                        
                                                          <div className='flex items-center gap-4 w-[450px] justify-between mt-2'>
                                                                            <p className=" text-lg !mb-0 leading-normal inline-block font-medium text-gray-900"  >Visa <span className={`text-red-500 inline-block`}>*</span></p>
                                                                            <div>
                                                                                <div className='flex items-center gap-2'>
                                                                                    <div className='relative'>
                                                                                        <label htmlFor='Visa' className='absolute cursor-pointer text-xl right-0 mx-auto my-auto'></label>
                                                                                    </div>
                                                                                    <input onChange={(e) => handleFileChange3(0, 2, e.target.files)} title="Emirates ID" className="block  text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none" aria-describedby="file_input_help" id="Visa" type="file"/>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                    </div>
                                                </AccordionItemPanel>
                                            </AccordionItem>


                                        </Accordion>
                                        <Accordion allowZeroExpanded>
                                            {Array.isArray(tempAddedBuyerData) && tempAddedBuyerData.map((buyer, index) => (
                                                <AccordionItem key={index} className='mt-4'>
                                                    <AccordionItemHeading className='bg-white py-2 px-2'>
                                                        <AccordionItemButton className='flex w-full justify-between'>
                                                            Buyer {index + 2}
                                                            <ImPlus />
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <div className='grid grid-cols-2 gap-x-5 gap-y-3 mt-4'>
                                                            <div className="">
                                                                <label>Full name <span className='text-red-500'>*</span></label>
                                                                <input className="form-control" type="text"
                                                                    value={buyer.buyername} onChange={(e) => handleInputChange(index, 'buyername', e.target.value)}
                                                                    placeholder="Buyer Cutomer Name" />
                                                            </div>
                                                            <div className="">
                                                                <label>Phone <span className='text-red-500'>*</span></label>
                                                                <input className="form-control" value={buyer.buyercontact} onChange={(e) => handleInputChange(index, 'buyercontact', e.target.value)}
                                                                    placeholder="Contact Number" />
                                                            </div>
                                                            <div className="">
                                                                <label>Email</label>
                                                                <input className="form-control" value={buyer.buyeremail} onChange={(e) => handleInputChange(index, 'buyeremail', e.target.value)}
                                                                    placeholder="Email" />
                                                            </div>

                                                            <div className="">
                                                                <label>Date of Birth <span className='text-red-500'>*</span></label>
                                                                <input
                                                                    className="form-control"
                                                                    type="date"
                                                                    onKeyDown={handleKeyDown}
                                                                    onFocus={toggleInputType}
                                                                    value={buyer.buyerdob} onChange={(e) => handleInputChange(index, 'buyerdob', e.target.value)}
                                                                    placeholder="Date of Closure"
                                                                    max={new Date().toISOString().split('T')[0]} // Set max date to today's date

                                                                />
                                                            </div>

                                                            <div className="">
                                                                <label>Passport Number <span className='text-red-500'>*</span></label>
                                                                <input className="form-control" type="text" value={buyer.buyerpassport} onChange={(e) => handleInputChange(index, 'buyerpassport', e.target.value)}
                                                                    placeholder="Passport Number" />
                                                            </div>

                                                            <div className="">
                                                                <label>Passport Expiry <span className='text-red-500'>*</span></label>
                                                                <input
                                                                    className="form-control"
                                                                    type="date"
                                                                    onKeyDown={handleKeyDown}
                                                                    onFocus={toggleInputType}
                                                                    value={buyer.passportexpiry} onChange={(e) => handleInputChange(index, 'passportexpiry', e.target.value)}
                                                                    placeholder="Emirates Expiry"
                                                                    min={new Date().toISOString().split('T')[0]} // Set max date to today's date

                                                                />
                                                            </div>
                                                            <div className="">
                                                                <label>Nationality <span className='text-red-500'>*</span></label>
                                                                <input className="form-control" type="text" value={buyer.nationality} onChange={(e) => handleInputChange(index, 'nationality', e.target.value)}
                                                                    placeholder="Nationality" />
                                                            </div>
                                                            <div className="">
                                                                <label>UAE Resident/Non Resident <span className='text-red-500'>*</span></label>
                                                                <SearchableSelect options={options1} onChange={(selectedOption) => handleSelectChange(index, selectedOption)} />
                                                            </div>
                                                            <div className="">
                                                                <label>Emirates ID</label>
                                                                <input disabled={buyer.Resident === 'No' || !buyer.Resident} value={buyer.emirateid} onChange={(e) => handleInputChange(index, 'emirateid', e.target.value)} className="form-control" type="text"
                                                                    placeholder="Emirates ID" />
                                                            </div>
                                                            <div className="">
                                                                <label>Emirates Expiry</label>
                                                                <input
                                                                    className="form-control"
                                                                    disabled={buyer.Resident === 'No' || !buyer.Resident}
                                                                    type="date"
                                                                    onKeyDown={handleKeyDown}
                                                                    onFocus={toggleInputType}
                                                                    value={buyer.emiratesExpiry} onChange={(e) => handleInputChange(index, 'emiratesExpiry', e.target.value)}
                                                                    placeholder="Emirates Expiry"
                                                                    min={new Date().toISOString().split('T')[0]} // Set max date to today's date

                                                                />
                                                            </div>

                                                            <div className="col-span-2">
                                                                <label>Buyer Address <span className='text-red-500'>*</span></label>
                                                                <input className="form-control" type="text"
                                                                    value={buyer.address} onChange={(e) => handleInputChange(index, 'address', e.target.value)}
                                                                    placeholder="Buyer Address" />
                                                            </div>
                                                        </div>
                                                        <div className='w-full mt-4'>
                                                            <div className='w-full flex items-center justify-between '>
                                                                <p className='w-full relative overflow-hidden block text-xl font-bold'><span className='block relative after:content-[" "] align-baseline  after:absolute after:w-full after:h-2 after:border-t-4 after:ml-3 after:border-slate-400 after:top-[50%]'>Documents to Upload</span></p>
                                                            </div>
                                                            <div className='w-full grid grid-cols-2 gap-x-5 gap-y-3'>
                                                                <div>
                                                                    <div className='flex  gap-3'>
                                                                        <p className="block mb-0 text-lg font-medium  text-gray-900 leading-normal "  >Buyer's Passport <span className='text-red-500'>*</span></p>
                                                                        <div >
                                                                            <div className='flex items-center gap-2 '>
                                                                                <div className="input-group" >
                                                                                    <div className='relative'>
                                                                                        <label htmlFor='emirateID' className='absolute cursor-pointer text-xl right-0 mx-auto my-auto'></label>
                                                                                    </div>
                                                                                     <p>Passport Front</p>
                                                                                    <input onChange={(e) => handleFileChange(index, 0, e.target.files)} title="Passport Front" className="block  text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none" aria-describedby="file_input_help" id="emirateID" type="file"  />
                                                                                </div>
                                                                            </div>
                                                                            <div className='flex items-top gap-2 mt-2'>
                                                                                <div className="input-group" >
                                                                                    <div className='relative'>
                                                                                        <label htmlFor='emirateID' className='absolute cursor-pointer text-xl right-0 mx-auto my-auto'></label>
                                                                                    </div>
                                                                                     <p>Passport Back</p>
                                                                                    <input onChange={(e) => handleFileChange(index, 1, e.target.files)} title="Passport Back" className="block  text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none" aria-describedby="file_input_help" id="emirateID" type="file"  />
                                                                                </div>
                                                                            </div>
                                                                            
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {buyer.Resident === '' || buyer.Resident === 'No' ? null : (
                                                                    <div>
                                                                        <div className='flex items-center gap-4'>
                                                                            <p className="block text-lg mb-0 leading-normal font-medium text-gray-900"  >Emirates ID</p>
                                                                            <div>
                                                                                <div className='flex items-center gap-2'>
                                                                                    <div className='relative'>
                                                                                        <label htmlFor='emirateID' className='absolute cursor-pointer text-xl right-0 mx-auto my-auto'></label>
                                                                                    </div>
                                                                                    <input onChange={(e) => handleFileChange(index, 3, e.target.files)} title="Emirates ID" className="block  text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none" aria-describedby="file_input_help" id="emirateID" type="file"/>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                
                                                                
                                                            </div>
                                                      
                                                            
                                                            
                                                                        <div className='flex items-center gap-4 w-[450px] justify-between mt-2'>
                                                                            <p className=" text-lg !mb-0 leading-normal inline-block font-medium text-gray-900"  >Visa <span className={`text-red-500 inline-block`}>*</span></p>
                                                                            <div>
                                                                                <div className='flex items-center gap-2'>
                                                                                    <div className='relative'>
                                                                                        <label htmlFor='Visa' className='absolute cursor-pointer text-xl right-0 mx-auto my-auto'></label>
                                                                                    </div>
                                                                                    <input onChange={(e) => handleFileChange(index, 2, e.target.files)} title="Emirates ID" className="block  text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none" aria-describedby="file_input_help" id="Visa" type="file"/>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    
                                                        </div>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>


                                        <div className='flex gap-1 w-full justify-center mt-5'>
                                            <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' onClick={addBuyer}>Add Buyer</button>
{tempAddedBuyerData && tempAddedBuyerData.length > 0 && (
                                            <button className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800' onClick={removeLastBuyer}>Remove Buyer</button>
                                     )}
                                        </div>


                                        <div className='flex gap-4 w-full justify-end mt-5'>
                                            <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' onClick={() => { setFormCounter((prev) => prev > 1 ? prev - 1 : prev) }}>Back</button>
                                            <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' onClick={onClickBack}>Next</button>
                                        </div>

                                    </div> : <div>you are at secondaryPlan</div> : null

                            }

                            {
                                formCounter === 3 && (
                                    <div className='w-full max-w-[85%] mt-3'>
                                        <div className='grid grid-cols-2 gap-x-5 gap-y-3 mt-4'>
                                            <div className="">
                                                <label className='!mb-0'>EOI/Token Date<span className='text-red-500'>*</span></label>
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    onKeyDown={handleKeyDown}
                                                    onFocus={toggleInputType}
                                                    onChange={(e) => setBuyerOneData({ ...buyerOneData, tokenDate: e.target.value })}
                                                    value={buyerOneData.tokenDate}
                                                    placeholder="EOI/Token Date"
                                                />
                                            </div>

                                            <div className="">
                                                <label className='!mb-0'>Date of Closure <span className='text-red-500'>*</span></label>
                                                <input
                                                    type="date"
                                                    onKeyDown={handleKeyDown}
                                                    className="form-control"
                                                    value={buyerOneData.closureDate}
                                                    onChange={(e) => setBuyerOneData({ ...buyerOneData, closureDate: e.target.value })}
                                                    placeholder="Date of Closure"
                                                />
                                            </div>

                                            <div className="">
                                                <label className='!mb-0'>Date of Booking <span className='text-red-500'>*</span></label>
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    onKeyDown={handleKeyDown}
                                                    onFocus={toggleInputType}
                                                    onChange={(e) => setBuyerOneData({ ...buyerOneData, bookingDate: e.target.value })}
                                                    value={buyerOneData.bookingDate}
                                                    placeholder="Date of Booking"
                                                />
                                            </div>

                                            <div className="">
                                                <label className="!mb-0">Expected Handover Date <span className='text-red-500'>*</span></label>
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    onKeyDown={handleKeyDown}
                                                    onFocus={toggleInputType}
                                                    onChange={(e) => setBuyerOneData({ ...buyerOneData, handoverDate: e.target.value })}
                                                    value={buyerOneData.handoverDate}
                                                    placeholder="Expected Handover Date"
                                                />
                                            </div>

                                            <div className="">
                                                <label className='!mb-0'>Property Type <span className='text-red-500'>*</span></label>
                                                <SearchableSelect
                                                    options={propertyOptions}
                                                    onChange={(value) => setBuyerOneData({ ...buyerOneData, propertyType: value.value })}
                                                />
                                            </div>

                                            <div className="">
                                                <label className='!mb-0'>Developer <span className='text-red-500'>*</span></label>
                                                <div className={buyerOneData.developer === 'other' ? 'grid grid-cols-2 gap-x-4' : 'grid grid-cols-1 gap-x-4'}>
                                                    <SearchableSelect
                                                        options={developerOptions}
                                                        onChange={(value) => setBuyerOneData({ ...buyerOneData, developer: value.value })}
                                                    />
                                                    {buyerOneData.developer === 'other' && (
                                                        <input
                                                            className="form-control"
                                                            value={buyerOneData.otherDeveloper}
                                                            onChange={(e) => setBuyerOneData({ ...buyerOneData, otherDeveloper: e.target.value })}
                                                            placeholder="Enter developer name"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            
                                             <div className="">
                                                  <label className='!mb-0'>Project Name <span className='text-red-500'>*</span></label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    onChange={(e) => setBuyerOneData({ ...buyerOneData, ProjectName: e.target.value })}
                                                    placeholder="Enter Project Name"
                                                />
                                            </div>

                                            <div className="">
                                                <label className='!mb-0'>No. of Bed <span className='text-red-500'>*</span></label>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    onChange={(e) => setBuyerOneData({ ...buyerOneData, Bed: e.target.value })}
                                                    placeholder="No. of Bed"
                                                />
                                            </div>

                                            <div className="">
                                                <label className='!mb-0'>Size /BUA Sq/Ft <span className='text-red-500'>*</span></label>
                                           
                                            <NumericFormat value={buyerOneData.BUA} onChange={(e) => setBuyerOneData({ ...buyerOneData, BUA: e.target.value })} className="form-control" allowLeadingZeros thousandSeparator="," />

                                            </div>

                                            <div className="">
                                                <label className='!mb-0'>Plot Area in Sq.Ft <span className='text-red-500'>*</span></label>
                                            <NumericFormat value={buyerOneData.PlotArea} onChange={(e) => setBuyerOneData({ ...buyerOneData, PlotArea: e.target.value })} className="form-control" allowLeadingZeros thousandSeparator="," />

                                            
                                            </div>

                                            <div className="">
                                                <label className='!mb-0'>Plot Number</label>
                                                <input
                                                    className="form-control"
                                                    disabled={buyerOneData.propertyType === 'Apartment' || !buyerOneData.propertyType}
                                                    type="text"
                                                    onChange={(e) => setBuyerOneData({ ...buyerOneData, PlotNumber: e.target.value })}
                                                    placeholder="Plot Number"
                                                />
                                            </div>

                                            <div>
                                                <label className='!mb-0'>Ready / Offplan <span className='text-red-500'>*</span></label>
                                                <SearchableSelect
                                                    options={readyStatus}
                                                    onChange={(value) => setBuyerOneData({ ...buyerOneData, Ready: value.value })}
                                                    placeholder="Ready / Offplan"
                                                />
                                            </div>

                                            <div>
                                                <label className='!mb-0'>Unit Complete Address <span className='text-red-500'>*</span></label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    onChange={(e) => setBuyerOneData({ ...buyerOneData, Unitaddress: e.target.value })}
                                                    placeholder="Unit Complete Address"
                                                />
                                            </div>

                                            <div>
                                                <label className='!mb-0'>Unit Price <span className='text-red-500'>*</span></label>
                                                <NumericFormat value={parseFloat(String(buyerOneData.Price).replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} onChange={(e) => setBuyerOneData({ ...buyerOneData, Price: e.target.value })} className="form-control" allowLeadingZeros thousandSeparator="," />

                                            </div>

                                            <div>
                                                <label className='!mb-0'>Commission % <span className='text-red-500'>*</span></label>
                                               <div className='grid grid-cols-4 gap-x-2'>
                                                    <NumericFormat
                                                        className="form-control col-span-3"  
                                                        value={buyerOneData.commisionttype == '%' ?  buyerOneData.Comission :  parseFloat(String(buyerOneData.Comission).replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        disabled={!buyerOneData.commisionttype} // Simplified condition
                                                        onChange={(e) => setBuyerOneData({ ...buyerOneData, Comission: e.target.value })}
                                                        allowLeadingZeros
                                                        thousandSeparator=","
                                                    />
                                                    <SearchableSelect
                                                        className='col-span-1'
                                                        options={commissionCurrency}
                                                        onChange={(selectedOption2) => handleSelectChange2('commisionttype', selectedOption2)}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className='!mb-0'>Spot Cash</label>

                                                <NumericFormat value={parseFloat(String(buyerOneData.spotCash).replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} onChange={(e) => setBuyerOneData({ ...buyerOneData, spotCash: e.target.value })} className="form-control" allowLeadingZeros thousandSeparator="," />

                                            </div>

                                            <div>
                                                <label className='!mb-0'>Grand Total Commission </label>

                                                <NumericFormat disabled value={parseFloat(String(buyerOneData.grandTotalCommission).replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} className="form-control" allowLeadingZeros thousandSeparator="," />

                                            </div>

                                            <div>
                                                <label className='!mb-0'>VAT 5%</label>

                                                <NumericFormat disabled value={parseFloat(String(buyerOneData.VAT).replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} className="form-control" allowLeadingZeros thousandSeparator="," />

                                            </div>

                                            <div>
                                                <label className='!mb-0'>Total Commission Including VAT</label>
                                                <NumericFormat disabled value={parseFloat(String(buyerOneData.TotalComission).replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} className="form-control" allowLeadingZeros thousandSeparator="," />

                                            </div>
                                            <div>
                                                <label className='!mb-0'>Loyalty Bonus if any </label>

                                                <NumericFormat value={parseFloat(String(buyerOneData.loyaltyBonus).replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} onChange={(e) => setBuyerOneData({ ...buyerOneData, loyaltyBonus: e.target.value })} className="form-control" allowLeadingZeros thousandSeparator=","  />

                                            </div>
                                            <div>
                                                <label className='!mb-0'>Net/Total Commission</label>

                                                <NumericFormat disabled value={parseFloat(String(buyerOneData.netcom).replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} className="form-control" allowLeadingZeros thousandSeparator="," />
                                            </div>


                                        </div>

                                        <div className='w-full mt-4'>
                                            <div className='w-full flex items-center justify-between '>
                                                <p className='w-full relative overflow-hidden block text-xl font-bold'>
                                                    <span className='block relative after:content-[" "] align-baseline  after:absolute after:w-full after:h-2 after:border-t-4 after:ml-3 after:border-slate-400 after:top-[50%]'>
                                                        Documents to Upload
                                                    </span>
                                                </p>
                                            </div>
                                            <div className='w-full grid grid-cols-3 gap-x-5 gap-y-3'>
                                                <div>
                                                    <div className='flex gap-3'>
                                                        <p className="block mb-0 text-lg font-medium text-gray-900 leading-normal">EOI Receipt*</p>
                                                        <div>
                                                            <div className='flex items-center gap-2'>
                                                                <div className="input-group">
                                                                    <div className='relative'>
                                                                        <label htmlFor='eoi' className='absolute cursor-pointer text-xl right-0 mx-auto my-auto'></label>
                                                                    </div>
                                                                    <input
                                                                        onChange={(e) => handleFileChange2('0', 0, e.target.files)}
                                                                        className="text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                                                        aria-describedby="file_input_help"
                                                                        id="eoi"
                                                                        title="EOI Receipt"
                                                                        type="file"
                                                                        accept='.pdf'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className='flex gap-3'>
                                                        <p className="block mb-0 text-lg font-medium text-gray-900 leading-normal">Booking form *</p>
                                                        <div>
                                                            <div className='flex items-center gap-2'>
                                                                <div className="input-group">
                                                                    <div className='relative'>
                                                                        <label htmlFor='booking' className='absolute cursor-pointer text-xl right-0 mx-auto my-auto'></label>
                                                                    </div>
                                                                    <input
                                                                        onChange={(e) => handleFileChange2('1', 0, e.target.files)}
                                                                        className="text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                                                        aria-describedby="file_input_help"
                                                                        id="booking"
                                                                        title="Booking Receipt"
                                                                        type="file"
                                                                        accept='.pdf'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className='flex gap-3'>
                                                        <p className="block mb-0 text-lg font-medium text-gray-900 leading-normal">SPA copy</p>
                                                        <div>
                                                            <div className='flex items-center gap-2'>
                                                                <div className="input-group">
                                                                    <div className='relative'>
                                                                        <label htmlFor='spa' className='absolute cursor-pointer text-xl right-0 mx-auto my-auto'></label>
                                                                    </div>
                                                                    <input
                                                                        onChange={(e) => handleFileChange2('2', 0, e.target.files)}
                                                                        className="text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
                                                                        aria-describedby="file_input_help"
                                                                        id="spa"
                                                                        type="file"
                                                                        title="SPA copy"
                                                                        accept='.pdf'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex gap-4 w-full justify-end mt-5'>
                                            <button
                                                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                                                onClick={() => { setFormCounter((prev) => prev > 1 ? prev - 1 : prev) }}
                                            >
                                                Back
                                            </button>
                                            <button
                                                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                                                onClick={HandleSubmit}
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
                                    </div>
                                )
                            }

                            {
                                formCounter === 4 && <div className='w-full mt-5 h-[65svh] flex  flex-col items-center justify-center'>
                                    <p className='text-3xl text-red-600 w-full text-center'>Congratulations !!
                                        Return to dashboard <br />
                                        You have successfully submitted your deal</p>
                                    <div className='flex gap-4 w-full justify-center mt-5'>
                                        <Link href='/Your-Deals'>
                                            <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Click here to see all your deals
                                            </button>
                                        </Link>
                                        <Link href='/profile'>
                                            <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Return to dashboard
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            }







                        </div>
                    </div>

                </div>
            </div>


        </RootLayout >


    )
}

export default Invoice