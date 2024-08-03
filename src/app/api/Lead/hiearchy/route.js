import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import Leads from "@/models/Leads";
import User from "@/models/Users";
import connect from "@/dbConfig/dbConfig";
import { parseISO, isValid, format } from 'date-fns'; // Import parseISO and format from date-fns
import moment from 'moment';
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
        const searchTerm = searchParams.get('searchterm');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 50;
        const skip = (page - 1) * limit;
        try {
            const allUserIds = await getAllUserIds(userid);
              const query = {
                Assigned: { $in: allUserIds },
                ...(searchTerm && {
                    $or: [
                        { 'Name': { $regex: new RegExp(searchTerm, 'i') } },
                        (!isNaN(searchTerm) ? { 'Phone': searchTerm } : null)
                    ].filter(Boolean) // Remove null values
                })
            };
        const selectedValuesString = searchParams.get('selectedValues') || '';
        const selectedValuesString2 = searchParams.get('selectedValues2') || '';
        const selectedValuesString3 = searchParams.get('selectedValues3') || '';
        const selectedValuesString4 = searchParams.get('selectedTag') || '';
        const dateString = searchParams.get('date') || '';
        const selectedValues = selectedValuesString ? selectedValuesString.split(',') : [];
        const selectedValues2 = selectedValuesString2 ? selectedValuesString2.split(',') : [];
        const selectedValues3 = selectedValuesString3 ? selectedValuesString3.split(',') : [];
        const selectedValues4 = selectedValuesString4 ? selectedValuesString4.split(',') : [];

        // Add selectedValues and selectedValues2 conditions
        if (selectedValues.length > 0) {
            query.Assigned = { $in: selectedValues };
        }

        if (selectedValues2.length > 0) {
            query.LeadStatus = { $in: selectedValues2 };
        }

        if (selectedValues3.length > 0) {
            query.Source = { $in: selectedValues3 };
        }

        if (selectedValues4.length > 0) {
            query.tags = { $in: selectedValues4 };
        }
         if (dateString != "" && dateString !=",") {
            const dates = dateString.split(',');

            if (dates.length === 2) {
                try {
                     const startDate = moment(dates[0]).startOf('day').toISOString(); 
                     const endDate = moment(dates[1]).endOf('day').toISOString(); 

                    query.timestamp = { $gte: startDate, $lt: endDate };
                    
                } catch (error) {
                    logger.error(`Error parsing or formatting dates: ${dates[0]} - ${dates[1]} :`, error);
                }
            } else {
                logger.info(`Invalid date range format: ${dateString}`);
            }
        }

        const Leaddata = await Leads.find(query)
            .populate('tags marketingtags Assigned LeadStatus Source')
            .skip(skip)
            .limit(limit);
          
        const totalLeads = await Leads.countDocuments(query);

    
            return NextResponse.json({
                message: "Leads found",
                data: Leaddata,
                users: allUserIds,
                totalLeads: totalLeads
            });
    
        } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
