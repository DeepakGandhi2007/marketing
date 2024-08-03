import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema({

    AddBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },

    Template: {
        type: String,
        required: [true, "Please provide a Tag"],
    },
     Status: {
        type: Number,
        default: 0, 
    },
    timestamp: { type: Date, default: Date.now },
});

const WhatsappModel = mongoose.models.Whatsapp || mongoose.model("Whatsapp", TemplateSchema);

export default WhatsappModel;
