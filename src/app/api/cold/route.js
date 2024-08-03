import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import Leads from "@/models/Leads";
import connect from "@/dbConfig/dbConfig";
import TagsModel from "@/models/Tags";
connect();

export async function GET(request, { params }) {
    try {
        const queryParams = new URLSearchParams(request.url.split('?')[1]);
        const tag = queryParams.get('tag');
        let assignedTo = request.nextUrl.searchParams.get('assignedTo');
        let query = { LeadType: 'cold' };
        if (tag) {
            query.tags = tag;
        }
        if (assignedTo) {
            query.Assigned = assignedTo;
        }

        const leads = await Leads.find(query).populate('tags marketingtags Assigned');

        return NextResponse.json({
            message: "Leads found",
            data: leads
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
