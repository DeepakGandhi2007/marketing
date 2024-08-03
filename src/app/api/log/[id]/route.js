import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import ActivityLog from "@/models/Activity";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request, { params }) {
    try {
        const leadid = params.id;


        const log = await ActivityLog.find({ Leadid: leadid }).populate('Userid');
        return NextResponse.json({
            mesaaage: "Log found",
            data: log
        })


    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}