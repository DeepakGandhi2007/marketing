import connect from "@/dbConfig/dbConfig";
import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { FsOutput } from "next/dist/server/lib/router-utils/filesystem";
import fs from "fs";
import path from "path";
import axios from "axios";

connect();
async function addUserToOneSignalAndCRM(userDetails) {
    try {
        const oneSignalResponse = await axios.post('https://onesignal.com/api/v1/players', {
            app_id: '7a7f495d-a3ba-45b4-aa8e-37bf796e6bc4',
            email: userDetails.email,
            device_type: 5,
            identifier: 'uniqyuetext123'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic NzgxYmZjMzEtNjY1Mi00YzNhLTk3MDgtMGNlY2VkYzNjZDJj'
            }
        });

        console.log(oneSignalResponse, "oneSignalResponse");

        const playerID = oneSignalResponse.data.id;

        await User.updateOne({ email: userDetails.email }, { onesignalPlayerId: playerID });

        console.log('User added to OneSignal and player ID updated in CRM');
    } catch (error) {
        console.error('Error adding user to OneSignal and updating player ID in CRM:', error);
    }
}

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { username, email, personalemail, password, Discord, Role, Phone, image, PrentStaff } = reqBody;

        const imagePath = path.join(process.cwd(), 'public', 'users', `${Date.now()}_${username}.png`);

        fs.writeFileSync(imagePath, Buffer.from(image, 'base64'));
        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);


        console.log(password, salt);
        const newUser = new User({
            username,
            email,
            personalemail,
            password: hashedPassword,
            Role,
            Phone,
            Avatar: imagePath.replace(path.join(process.cwd(), 'public'), ''),
            PrentStaff
        });
        const savedUser = await newUser.save();
        console.log(savedUser);
        await addUserToOneSignalAndCRM({ email });

        return NextResponse.json({
            message: "User created",
            success: true,
            savedUser,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}