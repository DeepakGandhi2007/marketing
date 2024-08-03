import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import Leads from "@/models/Leads";
import connect from "@/dbConfig/dbConfig";

connect();

export async function DELETE(request) {
    try {
        const reqBody = await request.json();
        const { leadIds } = reqBody;
        await Leads.deleteMany({ _id: { $in: leadIds } })
        return NextResponse.json({
            mesaaage: "Leads found",
        })



    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}