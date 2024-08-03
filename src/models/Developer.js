import mongoose from "mongoose";

const DeveloperSchema = new mongoose.Schema({

    AddBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },

    Developer: {
        type: String,
        required: [true, "Please provide a Developer"],
    },
    timestamp: { type: Date, default: Date.now },
});

const DeveloperModel = mongoose.models.Developer || mongoose.model("Developer", DeveloperSchema);

export default DeveloperModel;
