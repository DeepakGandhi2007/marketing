import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/dbConfig/dbConfig";
import Source from "@/models/Source";


connect();

export async function PUT(request, { params }) {
    try {
        const reqBody = await request.json();
        const { source } = reqBody;
        const id = params.id;

        const updatedsource = await Source.findByIdAndUpdate(id, {Source:source});
        return NextResponse.json({
            mesaaage: "source updated",
            data: updatedsource
        })


    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}