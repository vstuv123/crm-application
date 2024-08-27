import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password should be minimum of 8 characters"],
        maxlength: [20, "Password should not exceed 20 characters"],
        select: false,
    },
    contact: {
        type: String,
        required: true,
        minlength: [10, "Phone number should be minimum of 10 digits"],
        maxlength: [12, "Phone number should be a maximum of 12 digits"],
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        enum: ["Admin", "Manager", "Sales Representative"],
        required: true,
    },
    salesTeam: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});


userSchema.pre("save", async function(next) {
    if (!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.getJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
}

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.getPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
}


const User = mongoose.model("User", userSchema);
export default User;