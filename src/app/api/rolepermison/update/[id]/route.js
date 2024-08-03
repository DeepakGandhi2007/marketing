import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/dbConfig/dbConfig";
import rolePermission from "@/models/Rolepermsion";

connect();

export async function PUT(request, { params }) {
    try {
        const roleName = params.id;
        const reqBody = await request.json();
        const { permissions } = reqBody;
        console.log("permissions", permissions);
        Object.entries(permissions).forEach(([module, perms]) => {
            Object.entries(perms).forEach(([perm, value]) => {
                console.log(`Module: ${module}, Permission: ${perm}, Value: ${value}`);
            });
        });
        const result = await rolePermission.find({
            roleName: roleName,
            moduleName: { $in: Object.keys(permissions) },
            permissionName: {
                $in: Object.values(permissions).map(perms => Object.keys(perms)).flat()
            }
        });

        console.log(result);
        const updates = result.map(doc => ({
            updateOne: {
                filter: { _id: doc._id },
                update: { value: !doc.value } // Toggle the value
            }
        }));

        // Perform the bulk update
        const updateResult = await rolePermission.bulkWrite(updates);


        // Check if any entries were updated
        if (updateResult.modifiedCount === 0) {
            return NextResponse.json({ error: "No matching role names and module names found" }, { status: 404 });
        }

        return NextResponse.json({
            mesaaage: "Permsion found",
            updatedCount: result.nModified

        })


    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}