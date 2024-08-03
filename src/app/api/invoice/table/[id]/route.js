import connect from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import Invoice from "@/models/invoice";
import jwt from 'jsonwebtoken';
import fs from "fs";
import logger from "@/utils/logger";
import path from "path";
connect();

export async function PUT(request, { params }) {
    try {


        const token = request.cookies.get('token')?.value || '';
        const decoded = jwt.decode(token);
        const userId = decoded.id;
        const username = decoded.name;
        const reqBody = await request.json();
        const id = reqBody.data._id;

        const tempAddedBuyerData = reqBody.data.additionalBuyers || [];
        let additionalBuyers = [];
        if (tempAddedBuyerData.length > 0) {
            additionalBuyers = tempAddedBuyerData.map(buyer => ({
                buyername: buyer?.buyername || "",
                 buyerEmail: buyer?.buyerEmail || "",
                buyerContact: buyer?.buyerContact || "",
                buyerdob: buyer?.buyerdob || "",
                buyerpassport: buyer?.buyerpassport || "",
                passportexpiry: buyer?.passportexpiry || "",
                nationality: buyer?.nationality || "",
                Resident: buyer?.Resident || "",
                emiratesExpiry: buyer?.emiratesExpiry || "",
                address: buyer?.address || "",
                emiratesid: buyer?.emirateid || "",
            }));
        }



        const updatedInvoice = await Invoice.findByIdAndUpdate(
            id,
            {
                buyername: reqBody.data.buyername,
                buyerEmail: reqBody.data.buyerEmail,
                buyerContact: reqBody.data.buyerContact,
                buyerdob: reqBody.data.buyerdob,
                buyerpassport: reqBody.data.buyerpassport ,
                passportexpiry: reqBody.data.passportexpiry ,
                nationality: reqBody.data.nationality ,
                Resident: reqBody.data.Resident,
                emiratesExpiry: reqBody.data.emiratesExpiry,
                emiratesid: reqBody.data.emiratesid,
                address: reqBody.data.address,
                EOI: reqBody.data.EOI,
                Closure: reqBody.data.Closure,
                Booking: reqBody.data.Booking,
                Handover: reqBody.data.Handover,
                Property: reqBody.data.Property,
                Developer: reqBody.data.Developer,
                Bed: reqBody.data.Bed,
                BUA: reqBody.data.BUA,
                Invoicenumber: reqBody.data.Invoicenumber,
                ProjectName: reqBody.data.ProjectName,
                PlotArea: reqBody.data.PlotArea,
                PlotNumber: reqBody.data.PlotNumber,
                Unitaddress: reqBody.data.Unitaddress,
                Price: reqBody.data.Price,
                loyaltyBonus:reqBody.data.loyaltyBonus,
                type: reqBody.data.radioBtnStatus,
                Comission: reqBody.data.Comission,
                ComissionType:reqBody.data.commisionttype,
                SpotCash: reqBody.data.SpotCash,
                TotalComission: reqBody.data.TotalComission,
                VAT: reqBody.data.VAT,
                ComissionVAT: reqBody.data.ComissionVAT,
                External: reqBody.data.External,
                tokenDate: reqBody.data.tokenDate,
                closureDate: reqBody.data.closureDate,
                bookingDate: reqBody.data.bookingDate,
                handoverDate: reqBody.data.handoverDate,
                otherDeveloper: reqBody.data.otherDeveloper,
                commisionttype: reqBody.data.commisionttype,
                grandTotalCommission: reqBody.data.grandTotalCommission,
                netcom: reqBody.data.netcom,
                mshregros :reqBody.data.mshregros,
                mshreComission: reqBody.data.mshreComission,
                agentComissionPercent: reqBody.data.agentComissionPercent,
                agentComissionAED: reqBody.data.agentComissionAED,
                tlComissionPercent: reqBody.data.tlComissionPercent,
                tlComissionAED: reqBody.data.tlComissionAED,
                smComissionPercent: reqBody.data.smComissionPercent,
                smComissionAED: reqBody.data.smComissionAED,
                exAgentsComissionPercent: reqBody.data.exAgentsComissionPercent,
                exAgentsComissionAED: reqBody.data.exAgentsComissionAED,
                exTLComissionPercent: reqBody.data.exTLComissionPercent,
                exTLComissionAED: reqBody.data.exTLComissionAED,
                exSMComissionPercent: reqBody.data.exSMComissionPercent,
                exSMComissionAED: reqBody.data.exSMComissionAED,
                tAgentComissiontoAgent: reqBody.data.tAgentComissiontoAgent,
                bhComission: reqBody.data.bhComission,
                tComssiontoAgen_Bh: reqBody.data.tComssiontoAgen_Bh,
                comissionToCompanyAED: reqBody.data.comissionToCompanyAED,
                tAgentPercentComissionToAgent: reqBody.data.tAgentPercentComissionToAgent,
                bhPercentComission: reqBody.data.bhPercentComission,
                TbhPercentComissiontoAgent: reqBody.data.TbhPercentComissiontoAgent,
                comissiontoCompanyPercent: reqBody.data.comissiontoCompanyPercent,
                comissionStatustoAgent: reqBody.data.comissionStatustoAgent,
                newTitleDeedNumber:reqBody.data.newTitleDeedNumber,
                titleNumber:reqBody.data.titleNumber,
                contractNumber:reqBody.data.contractNumber,
                dewaPremises:reqBody.data.dewaPremises,
                cancelledPrice:reqBody.data.cancelledPrice,
                fullComission:reqBody.data.fullComission,
                claim3:reqBody.data.claim3,
                claim2:reqBody.data.claim2,
                claim1:reqBody.data.claim1,
                TA:reqBody.data.TA,
                sourceLeads:reqBody.data.sourceLeads,
                securityDeposit:reqBody.data.securityDeposit,
                cheques:reqBody.data.cheques,
                contractEndDate:reqBody.data.contractEndDate,
                comissionStatustoAgent:reqBody.data.comissionStatustoAgent,
                contractEndDate:reqBody.data.contractEndDate,
                additionalComments2:reqBody.data.additionalComments2,
                dealStatus:reqBody.data.dealStatus,
                directIndirectTenant:reqBody.data.directIndirectTenant,
                directIndirectOwner:reqBody.data.directIndirectOwner,
                remarks:reqBody.data.remarks,
                dealType:reqBody.data.dealType,
                saleRent:reqBody.data.saleRent,
                unitNumber:reqBody.data.unitNumber,
                mode:reqBody.data.mode,
                atlComissionPercent:reqBody.data.atlComissionPercent,
                atlComissionAED :reqBody.data.atlComissionAED,
                agentname: reqBody.data.agentname,
                additionalBuyers,
            },
            { new: true }
        );

        return NextResponse.json({
            message: "Invoice created successfully",
            success: true,
            updatedInvoice,
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
