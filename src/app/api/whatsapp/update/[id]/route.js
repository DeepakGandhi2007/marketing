import connect from "@/dbConfig/dbConfig";
import WhatsappModel from "@/models/Whatsapp";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import fs from "fs";
import path from "path";
import axios from "axios";

connect();



export async function PUT(request, { params }) {
    try {
        const reqBody = await request.json();
        const id = params.id;
        const { TemplateData } = reqBody;

        const updatedTemplate = await WhatsappModel.findByIdAndUpdate(id, {Template:TemplateData});

        if (!updatedTemplate) {
            return NextResponse.json({ error: "updatedTemplate not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "updatedTemplate updated",
            success: true,
            updatedTemplate,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

