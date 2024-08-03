import { NextResponse } from "next/server";
import UserTimeline from "@/models/userTimeline";
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        const response = NextResponse.json({
            message: "Logout Successful",
            success: true,
            status:200
        });

        const token = request.cookies.get('token')?.value || '';
        const decoded = jwt.decode(token);
        const userId = decoded.id;

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const currentDate = new Date().toLocaleDateString();
        const locationResponse = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=48350b4f7be54d86bc18152fef83b171&ip=1.1.2.1`);
        const locationData = await locationResponse.json();

        if (!locationResponse.ok || locationData.error) {
            console.error("Failed to fetch location data:", locationData.message);
            return NextResponse.json({ error: "Failed to fetch location data" }, { status: 500 });
        }

        const lastUserTimeline = await UserTimeline.findOne({ userId }).sort({ _id: -1 });

        if (lastUserTimeline) {
            lastUserTimeline.logoutTime = new Date();
            lastUserTimeline.date = currentDate;
            lastUserTimeline.location = {
                city: locationData.city,
                country: locationData.country,
                region: locationData.regionName,
                zipCode: locationData.zip
            };
            await lastUserTimeline.save();
        }

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });

        return response;
    } catch (error) {
        console.error(error);

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

