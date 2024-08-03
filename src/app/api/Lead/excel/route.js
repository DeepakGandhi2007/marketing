import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import connect from "@/dbConfig/dbConfig";
import Leads from "@/models/Leads";
import TagsModel from "@/models/Tags";
import StatusModel from "@/models/Status";

// Connect to the database
connect();

async function parseCSVAndSaveToDB(csvData, LeadStatus, Source) {
    const parsedData = await parseCSV(csvData);
    const leadsToSave = [];

    for (const lead of parsedData) {
        console.log(lead);
        const marketingtag = await TagsModel.findOne({ Tag: lead.marketingtags });
        if (!marketingtag) {
            console.log(`marketingtag with name ${lead.marketingtags} not found, skipping lead...`);
            continue;
        }

        const marketingtagId = marketingtag._id;
        console.log("marketingtagId", marketingtagId);
        const existingLead = await Leads.findOne({ Phone: lead.Phone, marketingtags: marketingtagId });

        if (existingLead) {
            console.log(`Lead with phone number ${lead.Phone} and tag ${marketingtagtagId} already exists, skipping...`);
            continue;
        }
        const dldtag = await TagsModel.findOne({ Tag: lead.tags });
        const dldtagId = dldtag._id;

        if (!existingLead) {
            leadsToSave.push({
                LeadStatus: LeadStatus || "6683f48a13502fdf0ea8e5a9",
                Source: Source || "6683f48a13502fdf0ea8e5a9",
                Assigned: lead.Assigned,
                Name: lead.Name,
                scoreupdateby: "",
                Phone: lead.Phone,
                AltPhone: lead.AltPhone,
                Address: lead.Address,
                Email: lead.Email,
                typeprop: lead.typeprop,
                City: lead.City,
                State: lead.State,
                Project: lead.Project,
                Budget: lead.Budget,
                Country: lead.Country,
                Location: lead.Location,
                ZipCode: lead.ZipCode,
                Priority: lead.Priority,
                Type: lead.Type,
                Description: lead.Description,
                LeadType: lead.LeadType,
                Doneby: '65cb59f9c93306341828d9eb',
                tags: dldtagId,
                marketingtags: marketingtagId,
                unitnumber: lead.unitnumber
            });
        }
    }

    if (leadsToSave.length > 0) {
        // Save leads in batches of 1000 for better performance
        const batchSize = 1000;
        for (let i = 0; i < leadsToSave.length; i += batchSize) {
            const batch = leadsToSave.slice(i, i + batchSize);
            await Leads.insertMany(batch);
        }
    }
}


function parseCSV(csvData) {
    return new Promise((resolve, reject) => {
        Papa.parse(csvData, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
}

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { file, LeadStatus, Source } = reqBody;

        if (!file) {
            throw new Error('No file provided');
        }

        const csvData = atob(file);
        await parseCSVAndSaveToDB(csvData, LeadStatus, Source);

        return NextResponse.json({ message: "CSV parsed and saved to database successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
