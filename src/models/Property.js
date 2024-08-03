const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    Project: { type: String, required: true },
    Developer: { type: String, required: true },
    Location: { type: String, required: true },
    Rate: { type: String, required: true },
    Type: { type: String, required: true },
    Bedroom: { type: String, required: true },
    Bathroom: { type: String, required: true },
    Area: { type: String, required: true },
    Handover: { type: String, required: true },
    Description: { type: String, required: true },
    lDescription: { type: String, required: true },
    Catalog: { type: String, required: true },
    Agent: { type: String, required: true },
});

const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);

export default Property;


