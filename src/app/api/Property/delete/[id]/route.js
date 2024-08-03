import { NextResponse } from "next/server";
import Property from "@/models/Property";
import connect from "@/dbConfig/dbConfig";

connect();

export async function DELETE(request, { params }) {
    try {
        const id = params.id;
        await Property.deleteOne({ _id: id });
        return NextResponse.json({
            message: "Property deleted",
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
