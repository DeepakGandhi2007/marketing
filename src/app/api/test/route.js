import axios from 'axios';
import { NextResponse } from 'next/server'; // Ensure this import if you're using Next.js
import { JWT } from 'google-auth-library';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const accessToken = "EAAQrsH4giisBO7R7Dz34VJCj6TS4DzNjLrh9lZCfgNXpsuThjKdKO1U0uMZAxlIr8ZA4IwC5Cl7wIgipjBycg9C6zqvErXGE7Xd1szZCKWigOmKUiYU4C0fi3uAhcEvxmSte1Xb2ZA1tMZAABE0aJJbvZAXPwm5rUzRjOFfOTWl67hCn0NlU5fZBhSznEwHe5LNvbImh4Wao";
const adAccounts = ['act_3823127191257337', 'act_112713589486777'];
const reportDate = '2024-07-31';


function get_country_from_campaign_name(campaign_name) {
    const lowerCaseName = campaign_name.toLowerCase();
    
    // Define regex patterns for each country
    const patterns = {
        Pakistan: /pak(?:istan|l)?/,
        India: /india/,
        UAE: /uae/,
        Australia: /australia?/,
        Singapore: /singapore/,
        Israel: /israel/,
        France: /france/,
        Turkey: /turkey/,
        Saudi: /saudi/,
        Canada: /canada/,
        Bangladesh: /bangladesh/,
    };
    
    // Check each pattern
    for (const [country, pattern] of Object.entries(patterns)) {
        if (pattern.test(lowerCaseName)) {
            return country;
        }
    }
    
    return 'Other';
}


async function fetchAllData(url, params) {
    let results = [];
    let response = await axios.get(url, { params });
    results = results.concat(response.data.data);

    while (response.data.paging && response.data.paging.next) {
        response = await axios.get(response.data.paging.next);
        results = results.concat(response.data.data);
    }

    return results;
}



async function getCampaignInsights(campaignId, reportDate) {
    try {
        const response = await axios.get(`https://graph.facebook.com/v12.0/${campaignId}/insights`, {
            params: {
                access_token: accessToken,
                fields: 'spend,actions',
                time_range: { since: reportDate, until: reportDate }
            },
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching campaign insights:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch campaign insights.');
    }
}


async function executeWithRetry(func, args = [], maxRetries = 5, initialDelay = 5000) {
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            return await func(...args);
        } catch (error) {
            attempt++;
            if (attempt >= maxRetries) {
                throw error;
            }
            const waitTime = initialDelay * (2 ** attempt) + Math.random() * 1000;
            console.log(`API rate limit reached or error occurred. Retrying in ${waitTime / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
}



export async function GET(request) {
    try {
        const results = [];
        const seenCampaignIds = new Set(); // Set to track unique campaign IDs
        const spendMap = new Map(); // Map to track spend amounts by campaign ID
        const budgetMap = new Map();
        for (const accountId of adAccounts) {
            const campaignsResponse = await executeWithRetry(
                fetchAllData,
                [`https://graph.facebook.com/v12.0/${accountId}/campaigns`, {
                    access_token: accessToken,
                    fields: 'daily_budget,name,id,status,insights{actions}',
                }]
            );
            const campaigns = campaignsResponse;

            for (const campaign of campaigns) {
                const { id: campaignId, name: campaignName, daily_budget: dailyBudget,status } = campaign;
                
                 if (status !== 'ACTIVE') {
                    continue;
                }
                
                if (seenCampaignIds.has(campaignId)) {
                    continue; // Skip if campaignId already seen
                }
                seenCampaignIds.add(campaignId);

                const insights = await getCampaignInsights(campaignId, reportDate);
                const country = get_country_from_campaign_name(campaignName);

                const spend = insights.reduce((total, insight) => total + parseFloat(insight.spend || '0'), 0);
                spendMap.set(campaignId, spend);

                // Aggregating lead actions
                let totalLeads = 0;

                for (const insight of insights) {
                    const leadActions = insight.actions.filter(action => action.action_type === 'lead');
                    if (leadActions.length > 0) {
                        totalLeads += leadActions.reduce((sum, action) => sum + parseFloat(action.value || '0'), 0);
                    }
                }
                budgetMap.set(campaignId, dailyBudget);
                // Create a single entry per campaign
                if (totalLeads > 0 || spend > 0) { // Ensure that entries are added only if there is spend or leads
                    results.push({
                        campaignId,
                        campaignName,
                        country,
                        spend: spendMap.get(campaignId),
                        dailyBudget: budgetMap.get(campaignId), // Include daily budget in the result
                        leads: totalLeads.toString() // Ensure leads is a string
                    });
                }
            }
        }

        await updateGoogleSheet(results);

        console.log(results);

        return NextResponse.json({
            message: "Results found",
            data: results
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }


    async function updateGoogleSheet(data) {
        const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH;
        const credentials = JSON.parse(fs.readFileSync(path.resolve(credentialsPath), 'utf8'));

        const jwtClient = new JWT({
            email: credentials.client_email,
            key: credentials.private_key,
            scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"],
        });
        const sheets = google.sheets({ version: 'v4', auth: jwtClient });

        const spreadsheetId = '18GGQ2Ca1F8wgsbp7E-snKVwA-EHzksqQVWhH-ViJyNc';
        const range = 'Sheet1!A1';

        const values = data.map(item => [
            item.campaignId,
            item.campaignName,
            item.country,
            item.spend,
            item.leads
        ]);

        const resource = {
            values,
        };

        try {
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range,
                valueInputOption: 'RAW',
                resource,
            });
            console.log('Sheet updated successfully');
        } catch (error) {
            console.error('Error updating Google Sheet:', error);
        }
    }

}
