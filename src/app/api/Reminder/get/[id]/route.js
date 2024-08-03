import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import Reminder from "@/models/Reminder";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request, { params }) {
    const lead = params.id;
    try {
        const reminder = await Reminder.find({ Leadid: lead }).populate('Assignees').sort({ timestamp: -1 });
        return NextResponse.json({
            mesaaage: "Reminder found",
            data: reminder
        })

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}