import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import UserTimeline from "@/models/userTimeline";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request) {
    try {
        let date = request.nextUrl.searchParams.get('date');
        let userId = request.nextUrl.searchParams.get('userId');

        if (!date) {
            date = new Date().toISOString().split('T')[0];
        } else {
            date = new Date(date).toISOString().split('T')[0];
        }
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

        const Timeline = await UserTimeline.find({
            userId: userId, timestamp: { $gte: startOfDay, $lt: endOfDay },
        });
        return NextResponse.json({
            message: "Timeline",
            data: Timeline
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
