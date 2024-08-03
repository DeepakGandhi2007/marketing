import mongoose from "mongoose";

const SourceSchema = new mongoose.Schema({

    AddBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },

    Source: {
        type: String,
        required: [true, "Please provide a Source"],
    },
     order: {
        type: String,
        required: [true, "Please provide a order"],
    },
    
    timestamp: { type: Date, default: Date.now },
});

const Source = mongoose.models.Source || mongoose.model("Source", SourceSchema);

export default Source;
