import { NextResponse } from "next/server";
import Leads from "@/models/Leads";
import connect from "@/dbConfig/dbConfig";
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import Meeting from "@/models/Meeting";
import Invoice from "@/models/invoice";
connect();

export async function GET(request) {
    try {
        const leads = await Leads.find();
        const emails = leads.map(lead => lead.Email);
        const intrest = leads.map(lead => lead.LeadStatus);

        console.log("email:", emails);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'development.makaidigitals@gmail.com                ',
                pass: 'odbx iieu qkcp nsdq'
            }
        });

        for (const lead of leads) {


            if (lead.LeadStatus === 'Intrested' && !lead.scoreupdateby.includes("LeadStatus")) {
                let updateFields = { $inc: { Score: 20 } };

                if (lead.scoreupdateby) {
                    updateFields.$set = { scoreupdateby: `${lead.scoreupdateby},LeadStatus` };
                } else {
                    updateFields.$set = { scoreupdateby: "LeadStatus" };
                }

                await Leads.updateOne({ _id: lead._id }, updateFields);
            }
            await transporter.sendMail({
                from: 'development.makaidigitals@gmail.com',
                to: lead.Email,
                subject: 'Your Subject Here',
                text: 'Your Message Here'
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            const info = await transporter.sendMail({
                from: 'development.makaidigitals@gmail.com',
                to: lead.Email,
                subject: 'Your Subject Here',
                text: 'Your Message Here'
            });

            if (info.messageId && !lead.scoreupdateby.includes("email")) {
                let updateFields = { $inc: { Score: 20 } };

                if (lead.scoreupdateby) {
                    updateFields.$set = { scoreupdateby: `${lead.scoreupdateby},email` };
                } else {
                    updateFields.$set = { scoreupdateby: "email" };
                }

                await Leads.updateOne({ _id: lead._id }, updateFields);
            }

            const meetings = await Meeting.find({ Leadid: lead._id });

            if (meetings.length > 0 && !lead.scoreupdateby.includes("meetings")) {
                console.log(`Lead with email ${lead.Email} has meetings`);
                let updateFields = { $inc: { Score: 20 } };

                if (lead.scoreupdateby) {
                    updateFields.$set = { scoreupdateby: `${lead.scoreupdateby},meetings` };
                } else {
                    updateFields.$set = { scoreupdateby: "meetings" };
                }

                await Leads.updateOne({ _id: lead._id }, updateFields);
            }
            const invoice = await Invoice.findOne({ Leadid: lead._id });
            console.log(invoice);
            if (invoice && invoice.Status === 'closed' && !lead.scoreupdateby.includes("Closed")) {
                console.log(`Lead with email ${lead.Email} has closed invoice status`);
                let updateFields = { $inc: { Score: 20 } };

                if (lead.scoreupdateby) {
                    updateFields.$set = { scoreupdateby: `${lead.scoreupdateby},Closed` };
                } else {
                    updateFields.$set = { scoreupdateby: "Closed" };
                }

                await Leads.updateOne({ _id: lead._id }, updateFields);
            }

        }

        return NextResponse.json({
            message: `Email sent to leads' email addresses: ${emails.join(', ')}`
        });
    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
