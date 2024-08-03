import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import logger from "@/utils/logger";
import jwt from 'jsonwebtoken';
import StatusModel from "@/models/Status";
import axios from "axios";
import ActivityLog from "@/models/Activity";

connect();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { Status } = reqBody;
        const token = request.cookies.get('token')?.value || '';
        const decoded = jwt.decode(token);
        const userId = decoded.id;
        const username = decoded.name;
        const action = `Status added by ${username}`;
        const currentDate = new Date().toLocaleDateString('en-GB');
        const activityLog = new ActivityLog({ action, Userid: userId, date: currentDate });
        await activityLog.save();
        const sourceCount = await StatusModel.countDocuments();

        const newStatus = new StatusModel({
            AddBy: userId,
            Status: Status,
            order: sourceCount + 1
        });
        const savedStatus = await newStatus.save();

        return NextResponse.json({
            message: "Status created",
            success: true,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
