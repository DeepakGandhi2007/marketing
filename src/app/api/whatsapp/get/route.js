import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import WhatsappModel from "@/models/Whatsapp";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request) {
    try {
        const tmplate= await WhatsappModel.find();
        return NextResponse.json({
            mesaaage: "Source found",
            data: tmplate
        })

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}