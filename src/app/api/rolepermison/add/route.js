import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import rolePermission from "@/models/Rolepermsion";
import axios from "axios";

connect();


export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { role, permissions } = reqBody;

        for (const moduleName in permissions) {
            for (const permission in permissions[moduleName]) {
                const newPermission = new rolePermission({
                    moduleName: moduleName,
                    roleName: role,
                    permissionName: permission,
                    value: permissions[moduleName][permission],
                });
                await newPermission.save();
            }
        }

        console.log(role, permissions)
        return NextResponse.json({
            message: "Permison created",
            success: true,
        });


    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}