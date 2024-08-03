import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import StatusModel from "@/models/Status";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request) {
    try {
        const Status= await StatusModel.find();
        return NextResponse.json({
            mesaaage: "Status found",
            data: Status
        })

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}