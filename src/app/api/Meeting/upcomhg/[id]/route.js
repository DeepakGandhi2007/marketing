import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import Meeting from "@/models/Meeting";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request, { params }) {

    try {
        console.log(params);
        const assigneid = params.id;
        let date = request.nextUrl.searchParams.get('date');
        let currentDate;
        if (date) {
            currentDate = new Date(date).toISOString().split('T')[0];
        }
        else {
            currentDate = new Date().toISOString().split('T')[0];
        }
        const Meetings = await Meeting.find({ Assignees: assigneid, MeetingDate: { $gt: currentDate } });
        return NextResponse.json({
            mesaaage: "Meetings found",
            data: Meetings
        })

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}