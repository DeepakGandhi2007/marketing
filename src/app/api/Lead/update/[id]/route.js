import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/dbConfig/dbConfig";
import Leads from "@/models/Leads";


connect();

export async function PUT(request, { params }) {
    try {
        const reqBody = await request.json();
        const { LeadStatus, Source, Assigned, Name, Score, Phone, AltPhone, Address, Email, City, State, Project, Budget, Country, Location, ZipCode, Priority, Type, Description } = reqBody;
        const id = params.id;

        const updatedLead = await Leads.findByIdAndUpdate(id, { LeadStatus, Source, Assigned, Name, Score, Phone, AltPhone, Address, Email, City, State, Project, Budget, Country, Location, ZipCode, Priority, Type, Description }, { new: true });
        return NextResponse.json({
            mesaaage: "Leads found",
            data: updatedLead
        })


    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}