import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/dbConfig/dbConfig";
import Leads from "@/models/Leads";
import ActivityLog from "@/models/Activity";
import jwt from 'jsonwebtoken'; // Import jwt directly here

connect();

export async function PUT(request, { params }) {
    try {
        const reqBody = await request.json();
        const { status } = reqBody;
        const leadid = params.id;
        let lead = await Leads.findById(leadid);
        if (!lead) {
            return NextResponse.json({
                message: "Lead not found",
                data: null
            }, { status: 404 });
        }
        const token = request.cookies.get('token')?.value || '';
        const decoded = jwt.decode(token);
        const userId = decoded.id;
        const username = decoded.name;
        const action = `Lead status updated by ${username}`;
        const currentDate = new Date().toLocaleDateString();
        if (status === 'NI' || status === 'NR' || status === 'Not Intrested') {
            let newStatusCount = lead.statusCount + 1;
            let shouldDelete = false;
            if (newStatusCount >= 3) {
                shouldDelete = true;
            }

            await Leads.findByIdAndUpdate(leadid, {
                LeadStatus: status,
                statusCount: newStatusCount
            });

            if (shouldDelete) {
                await Leads.findByIdAndDelete(leadid); // Delete lead from database
                return NextResponse.json({
                    message: "Lead deleted successfully",
                    data: null
                });
            }

            return NextResponse.json({
                message: "Lead status updated",
                data: { LeadStatus: status, statusCount: newStatusCount }
            });
        }
        await Leads.findByIdAndUpdate(leadid, {
            LeadStatus: status,
            statusCount: 0
        });
        const activityLog = new ActivityLog({ action, Userid: userId, Leadid: leadid, leadstatus: status, date: currentDate });
        await activityLog.save();
        return NextResponse.json({
            mesaaage: "Leads found",
        })


    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}