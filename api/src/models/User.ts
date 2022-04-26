import { Schema, model, Document } from "mongoose";
import { compare, hash } from "bcryptjs";
import { BCRYPT_WORK_FACTOR } from "../config";

interface UserDocument extends Document {
    email: string;
    name: string;
    password: string;
    matchesPassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema(
    {
        email: String,
        name: String,
        password: String,
    },
    {
        timestamps: true,
    }
);

// hash the password before saving user password into DB
userSchema.pre<UserDocument>("save", async function () {
    if (this.isModified("password")) {
        this.password = await hash(this.password, BCRYPT_WORK_FACTOR);
    }
});

userSchema.methods.matchesPassword = function (password: string) {
    return compare(password, this.password);
};

export const User = model<UserDocument>("User", userSchema);
