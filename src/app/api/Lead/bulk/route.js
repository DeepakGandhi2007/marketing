import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/dbConfig/dbConfig";
import Leads from "@/models/Leads";
import ActivityLog from "@/models/Activity";
import jwt from 'jsonwebtoken'; // Import jwt directly here
import User from "@/models/Users";
import axios from "axios";

connect();

export async function PUT(request) {
    try {
        const reqBody = await request.json();
        const { leadIds, assignee, source, status } = reqBody;
        const token = request.cookies.get('token')?.value || '';
        const decoded = jwt.decode(token);
        const userId = decoded.id;
        const username = decoded.name;
        const action = `Lead status updated by ${username}`;
        const currentDate = new Date().toLocaleDateString();

        for (const leadId of leadIds) {
            let updateObject = {};

            if (assignee !== null) {
                updateObject.Assigned = assignee;
                updateObject.LeadAssignedDate = new Date();
            }

            if (source !== null) {
                updateObject.Source = source;
            }

            if (status !== null) {
                updateObject.LeadStatus = status;
            }
            updateObject.status = "new";

            const updatedLead = await Leads.findByIdAndUpdate(leadId, updateObject);

            const assignedUserEmail = assignee;
            const assignedUser = await User.findById(assignedUserEmail);
           

            console.log(updatedLead);
            const activityLog = new ActivityLog({ action, Userid: userId, Leadid: leadId, leadstatus: status, date: currentDate });
            await activityLog.save();
        }

        return NextResponse.json({
            message: "Leads updated successfully"
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}