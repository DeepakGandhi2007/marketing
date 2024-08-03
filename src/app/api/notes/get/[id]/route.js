import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import Note from "@/models/Notes";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request, { params }) {
    const lead = params.id;
    try {
        const note = await Note.find({ Leadid: lead })
        return NextResponse.json({
            mesaaage: "Note found",
            data: note
        })

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}