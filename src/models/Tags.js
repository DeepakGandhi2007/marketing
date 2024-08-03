import mongoose from "mongoose";

const TagsSchema = new mongoose.Schema({

    AddBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },

    Tag: {
        type: String,
        required: [true, "Please provide a Tag"],
    },
    timestamp: { type: Date, default: Date.now },
});

const TagsModel = mongoose.models.Tags || mongoose.model("Tags", TagsSchema);

export default TagsModel;
