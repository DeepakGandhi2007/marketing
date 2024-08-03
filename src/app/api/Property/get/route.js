import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/dbConfig/dbConfig";
import Property from "@/models/Property";

connect();

export async function GET(request) {
    try {
        const Properties = await Property.find();
        return NextResponse.json({
            mesaaage: "Property found",
            data: Properties
        })

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}