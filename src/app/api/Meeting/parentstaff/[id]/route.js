import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import Meeting from "@/models/Meeting";
import User from "@/models/Users";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request, { params }) {
    const parentstaff = params.id;

    try {
        const users = await User.find({ PrentStaff: parentstaff });
        const Meetingdata = await Meeting.find({ Assigned: { $in: users.map(user => user._id) } }).populate('Assigned');
        console.log(Meetingdata);
        return NextResponse.json({
            mesaaage: "Leads found",
            data: Meetingdata
        })

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}