import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Note from "@/models/Notes";
import logger from "@/utils/logger";
import jwt from 'jsonwebtoken';
import axios from "axios";
import ActivityLog from "@/models/Activity";

connect();


export async function POST(request) {
    try {

        const reqBody = await request.json();
        const { Comment, Leadid } = reqBody;

        const newNote = new Note({
            Comment,
            Leadid: Leadid.lead._id

        });
        const savedNote = await newNote.save();
        console.log(savedNote);
        logger.info('New Note added:', savedNote);

        const token = request.cookies.get('token')?.value || '';
        console.log(token);

        const decoded = jwt.decode(token);
        const userId = decoded.id;
        const username = decoded.name;
        const leadid = Leadid.lead._id;
        const Leadname = Leadid.lead.Name;
        const LeadEmail = Leadid.lead.Email;
        const LeadPhone = Leadid.lead.Phone;
        const action = `Note added by ${username} and Lead Name ${Leadname} , Lead Email ${LeadEmail}  Lead Phone ${LeadPhone}`;
        const activityLog = new ActivityLog({ action, Userid: userId, Leadid: leadid });
        await activityLog.save();



        return NextResponse.json({
            message: "Note created",
            success: true,
        });


    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}