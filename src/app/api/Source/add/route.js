import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import logger from "@/utils/logger";
import jwt from 'jsonwebtoken';
import Source from "@/models/Source";
import axios from "axios";
import ActivityLog from "@/models/Activity";

connect();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { SourceDATA } = reqBody;
        const token = request.cookies.get('token')?.value || '';
        const decoded = jwt.decode(token);
        const userId = decoded.id;
        const username = decoded.name;
        const action = `Status added by ${username}`;
        const currentDate = new Date().toLocaleDateString('en-GB');
        const activityLog = new ActivityLog({ action, Userid: userId, date: currentDate });
        await activityLog.save();
        const sourceCount = await Source.countDocuments();

        const newSource = new Source({
            AddBy: userId,
            Source: SourceDATA,
            order: sourceCount + 1
        });
        const savedSource = await newSource.save();

        return NextResponse.json({
            message: "Source created",
            success: true,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
