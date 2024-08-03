import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import DeveloperModel from "@/models/Developer";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request) {
    try {
        const Developer= await DeveloperModel.find();
        return NextResponse.json({
            mesaaage: "Developer found",
            data: Developer
        })

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}