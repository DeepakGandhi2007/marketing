import mongoose from "mongoose";
import User from "./Users";

const LeadsSchema = new mongoose.Schema({
    Source: { type: mongoose.Schema.Types.ObjectId, ref: 'Source' },
    LeadStatus: { type: mongoose.Schema.Types.ObjectId, ref: 'Status' },

    Assigned: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    Name: {
        type: String,
    },
    Score: {
        type: Number,
        default: 0, // or whatever default value you want
    },
    Phone: {
        type: Number,
        required: [true, "Please provide a Phone"],
    },
    AltPhone: {
        type: Number,
     
    },
    Address: {
        type: String,
    },
    Email: {
        type: String,
     
    },
    typeprop: {
        type: String,
    },
    City: {
        type: String,
    },

    Project: {
        type: String,
    },
    Budget: {
        type: String,
    },
    Country: {
        type: String,
    },
    Location: {
        type: String,
    },
    ZipCode: {
        type: String,
    },

    Type: {
        type: String,
    },
    Description: {
        type: String,
    },
    status: {
        type: String,
        default: "new",
    },
    LeadType: {
        type: String,
    },
    scoreupdateby: {
        type: String,
    },
    Doneby: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    tags: { type: mongoose.Schema.Types.ObjectId, ref: 'Tags' },
    marketingtags: { type: mongoose.Schema.Types.ObjectId, ref: 'Tags' },
    unitnumber: {
        type: String,
    },
    statusCount: {
        type: Number,
        default: 0
    },
    LeadAssignedDate: {
        type: Date,
    },
      timestamp: { type: String,  default: () => new Date().toISOString().slice(0, 10) },


});

const Leads = mongoose.models.Leads || mongoose.model("Leads", LeadsSchema);

export default Leads;
