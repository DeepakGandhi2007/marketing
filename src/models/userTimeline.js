import mongoose from "mongoose";
const userTimelineSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },

    loginTime: {
        type: String,
        required: true
    },
    logoutTime: {
        type: String,
    },
    date: {
        type: String,
        required: true
    },
    location: {
        city: {
            type: String,
            required: false
        },
        country: {
            type: String,
            required: false
        },
        region: {
            type: String,
            required: false
        },
        zipCode: {
            type: String,
            required: false
        }
    },
    timestamp: { type: Date, default: Date.now },

});

const UserTimeline = mongoose.models.UserTimeline || mongoose.model("UserTimeline", userTimelineSchema);

export default UserTimeline;
