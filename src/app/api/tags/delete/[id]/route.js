import { NextResponse } from "next/server";
import TagsModel from "@/models/Tags";
import connect from "@/dbConfig/dbConfig";

connect();

export async function DELETE(request, { params }) {
    try {
        const id = params.id;
        await TagsModel.deleteOne({ _id: id });
        return NextResponse.json({
            message: "Tag deleted",
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
