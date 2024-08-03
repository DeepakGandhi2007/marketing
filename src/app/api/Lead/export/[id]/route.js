import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import Leads from "@/models/Leads";
import connect from "@/dbConfig/dbConfig";
import Papa from 'papaparse';

connect();

export async function POST(request, { params }) {
    try {
        const id = params.id;

        console.log("id");
        const lead = await Leads.find({ LeadType: id });
        const csv = Papa.unparse(lead.map(lead => ({
            Name: lead.Name,
            Email: lead.Email,
            Phone: lead.Phone,
            Description: lead.Description,
            LeadStatus: lead.LeadStatus
        })));

        return new Response(csv, {
            headers: {
                'Content-Disposition': 'attachment; filename="leads.csv"',
                'Content-Type': 'text/csv'
            },
        });


    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}