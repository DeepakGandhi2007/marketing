import connect from "@/dbConfig/dbConfig";
import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import UserTimeline from "@/models/userTimeline";
import fetch from "node-fetch";
import requestIp from 'request-ip'
import { headers } from "next/headers";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 404 });
    }

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }
      
   const clientIp =   headers().get("x-forwarded-for");
    const locationResponse = await fetch(`https://ipinfo.io/${clientIp}/json`);
    const locationData = await locationResponse.json();

    if (!locationResponse.ok || locationData.error) {
      console.error("Failed to fetch location data:", locationData.message);
      return NextResponse.json({ error: "Failed to fetch location data" }, { status: 500 });
    }
    
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toLocaleDateString();
    
    await UserTimeline.create({
      userId: user._id,
      loginTime: new Date(),
      date: currentDate,
      location: {
        city: locationData.city,
        country: locationData.country,
        region: locationData.region,
        zipCode: locationData.postal
      }
    });

    const tokenData = {
      id: user._id,
      name: user.username,
      role: user.Role,
      email: user.email,
      avatar: user.Avatar ?? null,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      token:token
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
