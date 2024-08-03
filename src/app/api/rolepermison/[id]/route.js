import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/dbConfig/dbConfig";
import rolePermission from "@/models/Rolepermsion";

connect();

export async function GET(request, { params }) {
    try {
        const roleName = params.id;

        console.log("id");
        const rolePermissions = await rolePermission.find({ roleName: roleName });
        return NextResponse.json({
            mesaaage: "Permsion found",
            data: rolePermissions
        })


    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}