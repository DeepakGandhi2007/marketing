import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
    Subject: {
        type: String,
        required: [true, "Please provide a Subject"],
    },
    MeetingDate: {
        type: String,
        required: [true, "Please provide a MeetingDate"],
    },
    Priority: {
        type: String,
        required: [true, "Please provide a Priority"],
    },
    MeetingType: {
        type: String,
        required: [true, "Please provide a MeetingType"],
    },
    directoragnet: {
        type: String,
    },
    agentName: {
        type: String,
    },
    agentPhone: {
        type: String,
    },
    agentCompany: {
        type: String,
    },
    Developer: {
        type: String,
    },
    Location: {
        type: String,
    },
    addedby: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    Assignees: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    Followers: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    Leadid: { type: mongoose.Schema.Types.ObjectId, ref: 'Leads' },
    Status: {
        type: String,
        required: [true, "Please provide a Status"],
    },
    Comment: {
        type: String,
        required: [true, "Please provide a Comment"],
    },
    timestamp: { type: Date, default: Date.now },
});

const Meeting = mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);

export default Meeting;
