import connect from "@/dbConfig/dbConfig";
import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { FsOutput } from "next/dist/server/lib/router-utils/filesystem";
import fs from "fs";
import { createReadStream, promises as fsPromises } from "fs";
import path from "path";

connect();
export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { files, userid } = reqBody;
        console.log(userid);
        const uploadsDir = path.join(process.cwd(), 'public', 'documents');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }
        const filenames = [];

        await Promise.all(files.map(async (fileData) => {
            const { filename, data } = fileData;
            const filePath = path.join(uploadsDir, filename);
            await fsPromises.writeFile(filePath, data, 'base64');
            console.log(`File ${filename} saved successfully`);
            filenames.push(filename);

        }));
        const user = await User.findById(userid);
        if (user.documents) {
            user.documents += `, ${filenames.join(', ')}`;
        } else {
            user.documents = filenames.join(', ');
        }
        await user.save();
        return NextResponse.json({
            message: "Document added",
            success: true,

        });
    }
    catch (error) {
        console.log(error);
    }
}
