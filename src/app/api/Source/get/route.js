import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import SourceModel from "@/models/Source";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request) {
    try {
        const Source= await SourceModel.find().sort({ order: 1 });
        return NextResponse.json({
            mesaaage: "Source found",
            data: Source
        })

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}