import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/dbConfig/dbConfig";
import Invoice from "@/models/invoice";
import ActivityLog from "@/models/Activity";
import jwt from 'jsonwebtoken';

connect();

export async function PUT(request, { params }) {
    try {
        const reqBody = await request.json();
        const { status,reason,approvedBy,Resons } = reqBody;
        const invoiceid = params.id;
        let invoice = await Invoice.findById(invoiceid); // Rename the variable holding the document instance
        if (!invoice) {
            return NextResponse.json({
                message: "Invoice not found",
                data: null
            }, { status: 404 });
        }
          if (!invoice.Reasons) {
            invoice.Reasons = Resons; // Assuming 'reason' is the correct field name in your MongoDB schema
            await invoice.save(); // Save the updated invoice document
        }
        const token = request.cookies.get('token')?.value || '';
        const decoded = jwt.decode(token);
        const userId = decoded.id;
        const username = decoded.name;
        const action = `Invoice status updated by ${username}`;
        const currentDate = new Date().toLocaleDateString();
        const approvedByArray = Array.isArray(approvedBy) ? approvedBy : [approvedBy];

        await Invoice.findByIdAndUpdate(invoiceid, {
            approved: status,
            cancelreason:reason,
            Reasons:Resons,
            $push: { approvedby: { $each: approvedByArray } } // Use approvedByArray here
        });

        return NextResponse.json({
            message: "Invoice found", // Corrected the typo here
        });

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
