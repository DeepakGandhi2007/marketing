import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import Leads from "@/models/Leads";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request) {
    try {
        const token = request.cookies.get('token') || '';

        return NextResponse.json({
            message: "Token found",
            token: token
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}