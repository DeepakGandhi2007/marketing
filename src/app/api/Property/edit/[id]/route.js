import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/dbConfig/dbConfig";
import Property from "@/models/Property";

connect();

export async function PUT(request, { params }) {
    try {
        const reqBody = await request.json();
        const { Project, Developer, Location, Rate, Type, Bedroom, Bathroom, Area, Handover, Description, lDescription, Catalog, Agent } = reqBody;
        const id = params.id;

        const updatedProperty = await Property.findByIdAndUpdate(id, { Project, Developer, Location, Rate, Type, Bedroom, Bathroom, Area, Handover, Description, lDescription, Catalog, Agent }, { new: true });
        return NextResponse.json({
            mesaaage: "Leads found",
            data: updatedProperty
        })


    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}