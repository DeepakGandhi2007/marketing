import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import StatusModel from "@/models/Status";
import Leads from "@/models/Leads";
import connect from "@/dbConfig/dbConfig";

connect();


export async function GET(request) {
    try {
        let status = request.nextUrl.searchParams.get('status');

        const statusDocument = await StatusModel.findById(status);
        if (!statusDocument) {
            return NextResponse.json({ error: 'status not found' }, { status: 404 });
        }

        const leadsCount = await Leads.countDocuments({ LeadStatus: statusDocument._id });
        return NextResponse.json({
            message: `Leads count for status ${status}`,
            count: leadsCount
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}