import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IAdmin extends Document {
  name: string;
  cover?: {
    _id: string;
    url: string;
    blurDataUrl: string;
  };
  gender?: string;
  role: string;
  phone?: string;
  email: string;
  password: string;
  status?: string;
  about?: string;
}

const AdminSchema: Schema<IAdmin> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name-required-error"],
      maxlength: [40, "name-maxlength-error"],
    },
    cover: {
      _id: { type: String },
      url: { type: String },
      blurDataUrl: {
        type: String,
      },
    },
    gender: {
      type: String,
    },
    role: {
      type: String,
      required: [true, "role-required-error"],
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email-required-error"],
    },
    password: {
      type: String,
      select: false,
      required: [true, "password-required-error"],
      minlength: [8, "password-length-error"],
      validate: {
        validator: function (value: string) {
          // Password strength validation (example: at least one uppercase, one lowercase, and one digit)
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(
            value
          );
        },
        message: "password-validate-error",
      },
    },
    status: {
      type: String,
      required: [true, "status-required-error"],
    },
    about: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash the password before saving
AdminSchema.pre<IAdmin>("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Custom method to compare passwords
AdminSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
