import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/Users";
import ActivityLog from "@/models/Activity";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request, { params }) {
    try {
        const id = params.id;
        let date = request.nextUrl.searchParams.get('date');
        if (!date) {
            date = new Date().toISOString().split('T')[0];
        } else {
            date = new Date(date).toISOString().split('T')[0];
        }
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

        const Activity = await ActivityLog.find({ Userid: id, timestamp: { $gte: startOfDay, $lt: endOfDay } });
        return NextResponse.json({
            mesaaage: "User found",
            data: Activity
        })

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

}