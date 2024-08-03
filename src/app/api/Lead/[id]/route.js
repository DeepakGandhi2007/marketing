import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import Leads from "@/models/Leads";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request, { params }) {
    try {
        const id = params.id;

        console.log("id");
        const lead = await Leads.findById(id).populate('Assigned');
        return NextResponse.json({
            mesaaage: "Leads found",
            data: lead
        })


    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}