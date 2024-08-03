import mongoose from "mongoose";

const StatusSchema = new mongoose.Schema({

    AddBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },

    Status: {
        type: String,
        required: [true, "Please provide a Status"],
    },
      order: {
        type: String,
        required: [true, "Please provide a order"],
    },
    timestamp: { type: Date, default: Date.now },
});

const StatusModel = mongoose.models.Status || mongoose.model("Status", StatusSchema);

export default StatusModel;
