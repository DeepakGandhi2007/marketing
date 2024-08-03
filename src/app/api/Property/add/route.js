import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Property from "@/models/Property";
import axios from "axios";


connect();


export async function POST(request) {
    try {

        const reqBody = await request.json();
        const { Project, Developer, Location, Rate, Type, Bedroom, Bathroom, Area, Handover, Description, lDescription, Catalog, Agent } = reqBody;
        const newProperty = new Property({
            Project,
            Developer,
            Location,
            Rate,
            Type,
            Bedroom,
            Bathroom,
            Area,
            Handover,
            Description,
            lDescription,
            Catalog,
            Agent,
        });
        const savedProperty = await newProperty.save();

        return NextResponse.json({
            message: "Property created",
            success: true,
            savedProperty,
        });


    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}