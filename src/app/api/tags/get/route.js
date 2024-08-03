import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import TagsModel from "@/models/Tags";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request) {
    try {
        const Tags = await TagsModel.find();
        return NextResponse.json({
            mesaaage: "Tags found",
            data: Tags
        })

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}