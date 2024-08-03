import { NextResponse } from "next/server";
import Source from "@/models/Source";
import connect from "@/dbConfig/dbConfig";

connect();

export async function DELETE(request, { params }) {
    try {
        const id = params.id;
        await Source.deleteOne({ _id: id });
        return NextResponse.json({
            message: "Source deleted",
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
