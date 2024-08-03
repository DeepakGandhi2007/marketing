import React, { useState, useEffect, useMemo, useCallback } from "react";
import styles from "../Modal.module.css";
import axios from "axios";
import SearchableSelect from "../Leads/dropdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";
import { useDropzone } from "react-dropzone";
import DocumentModal from "./doument";
import { NumericFormat } from "react-number-format";

const priceModal = ({ userData, onClose2 }) => {
  const [showModal, setShowModal] = useState(true);
  const [savedUser, setSavedUser] = useState(null);
  const [parentStaff, setParentStaff] = useState([]);
  const [userid, setuserid] = useState(null);
  
  const toggleDocumentModal = () => {
    setIsDocumentModalOpen(!isDocumentModalOpen);
  };
  const [loading, setLoading] = useState(false);

  const commissionCurrency = [
    { value: "%", label: "%" },
    { value: "AED", label: "AED" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const imageData = formData.filePreview.split(",")[1];
      const response = await axios.post("/api/staff/add", {
        ...formData,
        image: imageData,
        PrentStaff: formData.PrentStaff, // Use PrentStaff as the key
      });
      setSavedUser(response.data.savedUser);
      setuserid(response.data.savedUser._id);
      setShowModal(false); // Close the Modal
      setIsDocumentModalOpen(true);
      setUsers((prevUsers) => [...prevUsers, response.data.savedUser]); // Update the list of users
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const [priceChangeData, setPriceChangeData] = useState({
    Price: userData.Price,
    ComissionType: userData.ComissionType,
    Comission: userData.Comission,
    TotalComission: userData.TotalComission,
    VAT: userData.VAT,
    loyaltyBonus: userData.loyaltyBonus,
    ComissionVAT: userData.ComissionVAT,
    netcom: userData.netcom,
    SpotCash: userData.SpotCash,
  });
  console.log(priceChangeData)

  useEffect(() => {
    // Ensure the Price and Comission values are strings and not undefined
    const priceString = priceChangeData.Price
      ? priceChangeData.Price.toString()
      : "0";
    const ComissionString = priceChangeData.Comission
      ? priceChangeData.Comission.toString()
      : "0";

    const price = parseFloat(priceString.replace(/,/g, "") || "0");
    const commission = parseFloat(ComissionString.replace(/,/g, "") || "0");

    if (priceChangeData.ComissionType === "%") {
      if (!isNaN(price) && !isNaN(commission)) {
        const gtc = (price * commission) / 100;
        setPriceChangeData((prevState) => ({
          ...prevState,
          TotalComission: gtc,
        }));
      }
    } else {
      if (!isNaN(commission)) {
        setPriceChangeData((prevState) => ({
          ...prevState,
          TotalComission: commission,
        }));
      }
    }
  }, [
    priceChangeData.Price,
    priceChangeData.Comission,
    priceChangeData.ComissionType,
  ]);

  useEffect(() => {
    if (priceChangeData.Comission == "") {
      setPriceChangeData((prevState) => ({
        ...prevState,
        TotalComission: "",
        VAT: "",
        ComissionVAT: "",
        netcom: "",
      }));
    }
  }, [
    priceChangeData.Comission,
    priceChangeData.ComissionType,
    priceChangeData.Price,
  ]);
  

  useEffect(() => {
    const vat = (priceChangeData.TotalComission * 5) / 100;

    setPriceChangeData((prevState) => ({
      ...prevState,
      VAT: vat,
    }));
  }, [priceChangeData.TotalComission]);

  useEffect(() => {
    const tic = Number(priceChangeData.VAT + priceChangeData.TotalComission);
        const bonus = priceChangeData?.loyaltyBonus?.replace(/,/g, "");
    setPriceChangeData((prevState) => ({
      ...prevState,
      ComissionVAT: tic,
      netcom: priceChangeData.TotalComission - bonus,
    }));
  }, [priceChangeData.VAT]);

  useEffect(() => {
    const bonus = priceChangeData?.loyaltyBonus?.replace(/,/g, "");
    const tnc = Number(priceChangeData.TotalComission - bonus);

    setPriceChangeData((prevState) => ({
      ...prevState,
      netcom: tnc,
    }));
  }, [priceChangeData.loyaltyBonus]);

  const [isSubmit, setIsSubmit] = useState(false);
  const submit = async () => {
    setIsSubmit(true);
    try {
      const response = await axios.put(`/api/invoice/table/${userData._id} `, {
        data: { ...userData, ...priceChangeData },
      });
      window.location.reload()
      setIsSubmit(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
          <ToastContainer />
            <span className={styles.closeButton} onClick={onClose2}>
              &times;
            </span>
            <h4 className="text-center">
              {loading ? "Please Wait" : "Change Price"}
            </h4>
            <div className="card-body mt-4 p-0">
              <div className="container">
                <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                  <div className="">
                    <label className="!mb-0">
                      Unit Price <span className={`text-red-500 !mb-0`}>*</span>
                    </label>
                    <NumericFormat
                      className="form-control"
                      placeholder="Price"
                      value={
                        priceChangeData.Price == 0
                          ? "Unit Price"
                          : parseFloat(
                              String(priceChangeData.Price).replace(/,/g, "")
                            )
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      onChange={(e) => {
                        setPriceChangeData({
                          ...priceChangeData,
                          Price: e.target.value,
                        });
                      }}
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>
                  <div className=" ">
                    <label className="!mb-0">
                      Comission <span className={`text-red-500 !mb-0`}>*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-x-2">
                      <NumericFormat
                        className="form-control col-span-3"
                        disabled={priceChangeData?.ComissionType === ""}
                        placeholder="Comission"
                        thousandSeparator=","
                        value={
                          priceChangeData.Comission === 0
                            ? ""
                            : priceChangeData.ComissionType === "%"
                            ? priceChangeData.Comission
                            : parseFloat(
                                String(priceChangeData.Comission).replace(
                                  /,/g,
                                  ""
                                )
                              )
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        onChange={(e) => {
                          const newComission = e.target.value;

                          if (newComission === "") {
                            // If the input is cleared, reset the commission to 0
                            setPriceChangeData({
                              ...priceChangeData,
                              Comission: 0,
                            });
                            return;
                          }

                          if (priceChangeData.ComissionType === "%") {
                            if (
                              !isNaN(newComission) &&
                              parseFloat(newComission) <= 100
                            ) {
                              setPriceChangeData({
                                ...priceChangeData,
                                Comission: newComission,
                              });
                            } else {
                              toast.error('Comission must be a number between 0 and 100');
                              setPriceChangeData({
                                ...priceChangeData,
                                Comission: 0,
                              });
                            }
                          } else {
                            setPriceChangeData({
                              ...priceChangeData,
                              Comission: newComission,
                            });
                          }
                        }}
                      />
                      <SearchableSelect
                        className="!w-[600px] col-start-3"
                        options={commissionCurrency}
                        defaultValue={priceChangeData.ComissionType}
                        value={priceChangeData.ComissionType}
                        onChange={(e) => {
                          setPriceChangeData({
                            ...priceChangeData,
                            ComissionType: e.value,
                            Comission: 0,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className=" ">
                    <label className="!mb-0">Spot Cash</label>
                    <NumericFormat
                      className="form-control"
                      placeholder="SpotCash"
                      value={
                        priceChangeData.SpotCash == 0
                          ? "SpotCash"
                          : parseFloat(
                              String(priceChangeData.SpotCash).replace(/,/g, "")
                            )
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      onChange={(e) => {
                        setPriceChangeData({
                          ...priceChangeData,
                          SpotCash: e.target.value,
                        });
                      }}
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>
                  <div className=" ">
                    <label className="!mb-0">
                      Gross Total Comsission{" "}
                      <span className={`text-red-500 !mb-0`}>*</span>
                    </label>
                    <NumericFormat
                      className="form-control"
                      placeholder="Gross Total Comission"
                      disabled                      
                      
                        value={
                    priceChangeData.TotalComission === 0
                      ? "Net Commission"
                      : priceChangeData.TotalComission.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                  }
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>
                  <div className=" ">
                    <label className="!mb-0">VAT 5% </label>
                    <NumericFormat
                      className="form-control"
                      placeholder="VAT"
                       value={
                    priceChangeData.VAT === 0
                      ? "Net Commission"
                      : priceChangeData.VAT.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                  }
                      disabled
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>
                  <div className=" ">
                    <label className="!mb-0">Comission inclding VAT</label>
                    <NumericFormat
                      className="form-control"
                      placeholder="Total Comission"                      
                      value={
                    priceChangeData.ComissionVAT === 0
                      ? "Net Commission"
                      : priceChangeData.ComissionVAT.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                  }
                      disabled
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>
                  <div className=" ">
                    <label className="!mb-0">Loyalty Bonus</label>
                    <NumericFormat
                      className="form-control"
                      placeholder="Loyality Bonus"
                      value={
                        priceChangeData.loyaltyBonus == 0
                          ? "loyalty Bonus"
                          : parseFloat(
                              String(priceChangeData.loyaltyBonus).replace(
                                /,/g,
                                ""
                              )
                            )
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      onChange={(e) => {
                        setPriceChangeData({
                          ...priceChangeData,
                          loyaltyBonus: e.target.value,
                        });
                      }}
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>
                  <div className=" ">
                    <label className="!mb-0">
                      Net Comission/Total Comission
                    </label>
                    <NumericFormat
                      className="form-control"
                      placeholder="Net Comission"
                      disabled
                      value={
                    priceChangeData.netcom === 0
                      ? "Net Commission"
                      : priceChangeData.netcom.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                  }
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>
                </div>

                <div className={`w-full justify-center items-center flex mt-3`}>
                  <button
                    onClick={submit}
                    disabled={
                      priceChangeData.Price <= 0 ||
                      priceChangeData.ComissionVAT <= 0 ||
                      priceChangeData.VAT <= 0 ||
                      priceChangeData.TotalComission <= 0 ||
                      priceChangeData.Comission <= 0 ||
                      priceChangeData.Price <= 0
                    }
                    className={`text-white bg-blue-700 hover:bg-blue-800   font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2`}
                  >
                    {isSubmit ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default priceModal;
