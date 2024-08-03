import { NextRequest, NextResponse } from "next/server";
import User from "@/models/Users";
import connect from "@/dbConfig/dbConfig";

connect();

export async function DELETE(request, { params }) {
    try {
        const userid = params.id;
        if (!userid) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        await User.deleteOne({ _id: userid });

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
