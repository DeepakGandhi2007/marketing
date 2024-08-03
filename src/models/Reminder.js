import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
    DateTime: {
        type: String,
        required: [true, "Please provide a DateTime"],
    },

    Assignees: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },

    Leadid: { type: mongoose.Schema.Types.ObjectId, ref: 'Leads' },

    Comment: {
        type: String,
        required: [true, "Please provide a Comment"],
    },
    timestamp: { type: Date, default: Date.now },
});

const Reminder = mongoose.models.Reminder || mongoose.model("Reminder", ReminderSchema);

export default Reminder;
