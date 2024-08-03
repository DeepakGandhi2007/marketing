import React, { useState, useEffect, useRef } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import { IoIosArrowDropright } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { FaPhone, FaWhatsapp } from "react-icons/fa6";
import SearchableSelect from "../Leads/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { Select } from "antd";
const ReadMore = ({ children, setEdit, id }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);

  const toggleReadMore = () => {
    setEdit(id);
  };

  return (
    <p
      className={`${
        isReadMore
          ? "bg-gradient-to-t from-gray-400  to-gray-900 inline-block text-transparent bg-clip-text"
          : ""
      }`}
    >
      {isReadMore ? text.slice(0, 60) : text}
      <span
        onClick={(e) => toggleReadMore(e)}
        className={`read-or-hide cursor-pointer hover:text-slate-800 text-slate-400 `}
      >
        {isReadMore ? "...Read more" : "Show less"}
      </span>
    </p>
  );
};

const leadCard = ({
  options,
  currentLead,
  handleCardClick,
  selectedLeads,
  setEdit,
  options2
}) => {
  const baseUrl = "http://216.10.242.11:8080/";
  const divRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setShowContact(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [showContact, setShowContact] = useState(false);
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: -0.5,
      },
    },
    exit: { x: 30 },
  };

  const listItem = {
    hidden: { x: 15 },
    show: { x: 0 },
  };
const updateLeadStatus = async (leadId, newStatus) => {
    try {
      await axios.put(`/api/Lead/status/${leadId}`, { status: newStatus })
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };
  return (
    <div
      className={` rounded-md relative cursor-pointer px-3 border-2 bg-white group py-3 transition-all duration-300  ${
        selectedLeads.includes(currentLead._id)
          ? "border-blue-400  "
          : " hover:!bg-blue-50"
      }  `}
      ref={divRef}
      onClick={(e) => handleCardClick(currentLead._id, e)}
    >
      {selectedLeads.includes(currentLead._id) && (
        <div className="absolute -top-2 -left-2 text-xl">
          <RiCheckboxCircleFill className="text-blue-600" />
        </div>
      )}
      <div className="flex items-center justify-between ">
        <div className={"flex items-center gap-2"}>
          <Select
            mode="single"
            allowClear
            style={{ width: "100%", height: "100%" }}
            onChange={(selectedOption) => {
              const newStatus = selectedOption;
              updateLeadStatus(currentLead._id, newStatus);
            }}
            options={options}
            placeholder={"Users"}
             defaultValue={currentLead.LeadStatus ? currentLead.LeadStatus?.Status : null }
          />

          {!showContact && (
            <Select
              mode="single"
              allowClear
              style={{ width: "100%", height: "100%" }}
              onChange={(selectedOption) => {
                const newStatus = selectedOption;
                updateLeadStatus(currentLead._id, newStatus);
              }}
             options={options2}
              placeholder={"Users"}
              defaultValue={currentLead.Source ? currentLead.Source?.Source : null }
              
            />
          )}
        </div>

        <div className="flex items-center gap-2 text-xl">
          <div className="flex gap-2">
            <AnimatePresence mode="wait">
              {showContact ? (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ x: 0 }}
                    variants={listItem}
                    className="bg-blue-400 size-7 cursor-pointer flex justify-center items-center rounded-full"
                  >
                    <a href={`tel:${currentLead.Phone}`}>
                      <FaPhone className="text-sm" />
                    </a>
                  </motion.div>
                  {currentLead.AltPhone && <motion.div
                    animate={{ x: 0 }}
                    variants={listItem}
                    className="bg-red-400 text-white size-7 cursor-pointer flex justify-center items-center rounded-full"
                  >
                    <a href={`tel:${currentLead.AltPhone}`}>
                      <FaPhone className="text-sm" />
                    </a>
                  </motion.div>}
                  <motion.div
                    animate={{ x: 0 }}
                    variants={listItem}
                    className="bg-green-400 size-7 cursor-pointer rounded-full flex justify-center items-center"
                  >
                    <a
                      target="_blank"
                      href={`https://wa.me/${encodeURIComponent(
                        currentLead.Phone
                      )}?text=${encodeURIComponent(
                        "Your custom message here"
                      )}`}
                    >
                      <FaWhatsapp className="text-white" />
                    </a>
                  </motion.div>

                  {currentLead.AltPhone && <motion.div
                    animate={{ x: 0 }}
                    variants={listItem}
                    className="bg-red-400 text-white size-7 cursor-pointer flex justify-center items-center rounded-full"
                  >
                   <a
                      target="_blank"
                      href={`https://wa.me/${encodeURIComponent(
                        currentLead.AltPhone
                      )}?text=${encodeURIComponent(
                        "Your custom message here"
                      )}`}
                    >
                      <FaWhatsapp className="text-sm" />
                    </a>
                  </motion.div>}
                </motion.div>
              ) : (
                ""
              )}
            </AnimatePresence>
            <div
              className="  size-8 bg-gray-200 group-hover:bg-blue-300 cursor-pointer rounded-full flex justify-center items-center"
              onClick={(e) => {
                setShowContact(!showContact);
                e.stopPropagation();
              }}
            >
              <IoIosArrowDropright
                className={`${showContact ? "rotate-180" : "rotate-0"}`}
              />
            </div>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setEdit(currentLead._id);
            }}
            className="  size-8 bg-gray-200 group-hover:bg-blue-300 cursor-pointer rounded-full flex justify-center items-center"
          >
            <IoIosInformationCircle />
          </div>
          <div className="  size-8 bg-gray-200 group-hover:bg-blue-300 overflow-hidden cursor-pointer rounded-full flex justify-center items-center">
            {currentLead?.Assigned?.Avatar ? (
              <img src={`${baseUrl}/${currentLead?.Assigned?.Avatar}`} />
            ) : (
              <FaRegUserCircle />
            )}
          </div>
        </div>
      </div>
      <p className="text-lg font-Satoshi font-[700] mt-1">{currentLead.Name}</p>

      {currentLead?.marketingtags?.Tag ? (
        <div className="flex justify-start items-center gap-1 text-sm w-full ">
          <p className="!mb-0 !mt-0 col-span-1 text-[12px]">Marketing Tag:</p>

          <p className="rounded-full bg-[#B3E5FC] px-2 font-Satoshi text-center font-[500] text-[10px] !mb-0 !mt-0">
            {currentLead?.marketingtags?.Tag}
          </p>
        </div>
      ) : (
        <div className="flex justify-start items-center gap-1 text-sm w-full">
          <p className="!mb-0 !mt-0 col-span-1 text-[12px]">Marketing Tag:</p>

          <p className="rounded-full bg-[#B3E5FC] font-Satoshi px-2 text-center font-[500] text-[10px] !mb-0 !mt-0">
            No Tag
          </p>
        </div>
      )}

      {currentLead?.tags?.Tag ? (
        <div className="flex justify-start items-center gap-1 mt-2 text-sm w-full">
          <p className="!mb-0 !mt-0 col-span-1 text-[12px]">DLD Tag:</p>

          <p className="rounded-full bg-[#B3E5FC] px-2 font-Satoshi text-center font-[500] text-[10px] !mb-0 !mt-0">
            {currentLead?.tags?.Tag}
          </p>
        </div>
      ) : (
        <div className="flex justify-start items-center mt-2 gap-1 text-sm w-full">
          <p className="!mb-0 !mt-0 col-span-1 text-[12px]">DLD Tag:</p>

          <p className="rounded-full bg-[#B3E5FC] px-2 font-Satoshi text-center font-[500] text-[10px] !mb-0 !mt-0">
            No Tag
          </p>
        </div>
      )}
      <ReadMore setEdit={setEdit} id={currentLead._id}>
        ghjgfff hjvkjh hvnbv asd asqwte wd qw d srfa asdfa asdf wer23 htt dsas
        asdfadf adf et43 asdasd 2234d asdfa sdfasdf qoiew lcl asdfk sfdgsdf
        92835 ofg klsdjglsk k;lxcvb kjlxcvb xcvb s
      </ReadMore>
    </div>
  );
};

export default leadCard;
