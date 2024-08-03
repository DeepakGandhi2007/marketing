import connect from "@/dbConfig/dbConfig";
import DeveloperModel from "@/models/Developer";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import fs from "fs";
import path from "path";
import axios from "axios";

connect();



export async function PUT(request) {
    try {
        const reqBody = await request.json();
        const { id,Developer } = reqBody;

        const updatedDeveloper = await DeveloperModel.findByIdAndUpdate(id, {Developer:Developer});

        if (!updatedDeveloper) {
            return NextResponse.json({ error: "Developer not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Developer updated",
            success: true,
            updatedDeveloper,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

