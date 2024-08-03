import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import logger from "@/utils/logger";
import jwt from 'jsonwebtoken';
import DeveloperModel from "@/models/Developer";
import axios from "axios";
import ActivityLog from "@/models/Activity";

connect();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { devloperName } = reqBody;
        const token = request.cookies.get('token')?.value || '';
        const decoded = jwt.decode(token);
        const userId = decoded.id;
        const username = decoded.name;
        const action = `Whatsapp Template added by ${username}`;
        const currentDate = new Date().toLocaleDateString('en-GB');
        const activityLog = new ActivityLog({ action, Userid: userId, date: currentDate });
        await activityLog.save();

        const newDeveloper = new DeveloperModel({
            AddBy: userId,
            Developer: devloperName,
        });
        const savedDeveloper = await newDeveloper.save();

        return NextResponse.json({
            message: "Developer created",
            success: true,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
