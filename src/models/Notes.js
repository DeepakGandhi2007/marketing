import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    Comment: {
        type: String,
        required: [true, "Please provide a Comment"],
    },

    Leadid: { type: mongoose.Schema.Types.ObjectId, ref: 'Leads' },


    timestamp: { type: Date, default: Date.now },
});

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

export default Note;
