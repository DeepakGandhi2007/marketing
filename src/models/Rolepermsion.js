import mongoose from "mongoose";

const rolePermissionSchema = new mongoose.Schema({
    moduleName: {
        type: String,
        required: [true, "Please provide a DateTime"],
    },

    roleName: {
        type: String,
        required: true
    },
    permissionName: {
        type: String,
        required: true
    },
    value: {
        type: Boolean,
        default: false
    },
    timestamp: { type: Date, default: Date.now },
});

const rolePermission = mongoose.models.rolePermission || mongoose.model("rolePermission", rolePermissionSchema);

export default rolePermission;
