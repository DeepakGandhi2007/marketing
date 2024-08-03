import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import UserTimeline from "@/models/userTimeline";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request) {
    try {
        let date = request.nextUrl.searchParams.get('date');
        let userId = request.nextUrl.searchParams.get('userId');

        const dateParts = date.split('-');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);

        const allTimelineData = await UserTimeline.find({ userId: userId });
        const filteredTimelineData = allTimelineData.filter(data => {
            const dataDateParts = data.date.split('/');

            const dataMonth = parseInt(dataDateParts[1]);
            const dataYear = parseInt(dataDateParts[2]);
            return dataMonth === month && dataYear === year;
        });
        console.log(filteredTimelineData);
        return NextResponse.json({
            message: "Timeline",
            data: filteredTimelineData
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
