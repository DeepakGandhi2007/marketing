import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/Users";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request, { params }) {
    try {
        const id = params.id;

        const Users = await User.find({ PrentStaff: id });
        return NextResponse.json({
            mesaaage: "User found",
            data: Users
        })

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

}