import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import Leads from "@/models/Leads";
import User from "@/models/Users";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request, { params }) {
    const parentstaff = params.id;

    try {
        const users = await User.find({ PrentStaff: parentstaff });
        const Leadsdata = await Leads.find({ Assigned: { $in: users.map(user => user._id) } }).populate('Assigned LeadStatus Source');
        console.log(Leadsdata);
        return NextResponse.json({
            mesaaage: "Leads found",
            data: Leadsdata
        })

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}