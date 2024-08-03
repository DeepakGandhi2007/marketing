import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/Users";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request, { params }) {
    try {
        const parent = request.nextUrl.searchParams.get('parent');
        const role = params.id;
        const staff = await User.find({ Role: role, PrentStaff: parent }).select("-password");
        return NextResponse.json({
            message: "Users found",
            data: staff
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
