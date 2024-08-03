import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/Users";
import Meeting from "@/models/Meeting";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request, { params }) {
    const id = params.id;

    try {
        const Meetingdata = await Meeting.find({ addedby: id });
        return NextResponse.json({
            mesaaage: "Meeting found",
            data: Meetingdata
        })

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}