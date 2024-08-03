import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import TagsModel from "@/models/Tags";
import Leads from "@/models/Leads";
import connect from "@/dbConfig/dbConfig";

connect();


export async function GET(request) {
    try {
        let tag = request.nextUrl.searchParams.get('tag');

        const tagDocument = await TagsModel.findById(tag);
        if (!tagDocument) {
            return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
        }
        console.log(tagDocument)

        const leadsCount = await Leads.countDocuments({ tags: tagDocument._id });
        return NextResponse.json({
            message: `Leads count for tag ${tag}`,
            count: leadsCount
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}