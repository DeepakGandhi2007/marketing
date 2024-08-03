import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import Meeting from "@/models/Meeting";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request, { params }) {

    try {
        const assigneid = params.id;

        const Meetings = await Meeting.find({ Assignees: assigneid });
        return NextResponse.json({
            mesaaage: "Meetings found",
            data: Meetings
        })

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}