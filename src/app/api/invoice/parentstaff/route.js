import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import Invoice from "@/models/invoice";
import User from "@/models/Users";
import connect from "@/dbConfig/dbConfig";

connect();

async function getAllUserIds(userid) {
    const userIds = [];
    const queue = [userid];

    while (queue.length > 0) {
        const currentId = queue.shift();
        userIds.push(currentId);

        const users = await User.find({ PrentStaff: currentId });
        const newUserIds = users.map(user => user._id.toString());

        queue.push(...newUserIds);
    }

    return userIds;
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const userid = searchParams.get('userid');

    try {
        const allUserIds = await getAllUserIds(userid);
        const invoices = await Invoice.find({
            $or: [
                { Userid: { $in: allUserIds } },
                { approvedby: { $elemMatch: { $in: allUserIds } } }
            ]
        }).populate('Userid');
        return NextResponse.json({
            message: "invoices found",
            data: invoices,
            users: allUserIds
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
