import mongoose from "mongoose";
import User from "./Users";

const activityLogSchema = new mongoose.Schema({
    action: String,
    Userid: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    Leadid: { type: mongoose.Schema.Types.ObjectId, ref: 'Leads' },
    timestamp: { type: Date, default: Date.now },
    leadstatus: String,
    date: {
        type: String,
        required: true
    },
});

const ActivityLog = mongoose.models.ActivityLog || mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
