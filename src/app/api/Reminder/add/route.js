import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Reminder from "@/models/Reminder";
import logger from "@/utils/logger";
import jwt from 'jsonwebtoken';
import axios from "axios";
import ActivityLog from "@/models/Activity";

connect();


export async function POST(request) {
    try {

        const reqBody = await request.json();
        const { DateTime, Assignees, Leadid, Comment } = reqBody;

        const newReminder = new Reminder({
            DateTime,
            Assignees,
            Leadid: Leadid,
            Comment,


        });
        const savedReminder = await newReminder.save();
        console.log(savedReminder);
        logger.info('New Reminder added:', savedReminder);

        const token = request.cookies.get('token')?.value || '';
        console.log(token);

        const decoded = jwt.decode(token);
        const userId = decoded.id;
        const username = decoded.name;
        const leadid = Leadid;
        const leadResponse = await axios.get(`http://216.10.242.11:8080/api/Lead/${leadid}`);
        const { Leadname: Name, Leademail: Email, Leadphone: Phone } = leadResponse.data;
        const reminddate = savedReminder.DateTime;
        const currentDate = new Date().toLocaleDateString();
        const action = `Reminder added by ${username} and Lead Name ${Name} , Lead Email ${Email}  Lead Phone ${Phone}, Remider Date Time ${reminddate}`;
        const activityLog = new ActivityLog({ action, Userid: userId, Leadid: leadid,date: currentDate });
        await activityLog.save();



        return NextResponse.json({
            message: "Reminder created",
            success: true,
        });


    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}