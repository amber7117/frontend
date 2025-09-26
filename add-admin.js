#!/usr/bin/env node

/**
 * Script to add admin user to the database
 * Usage: node add-admin.js <email> <password> <name>
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://client2:5252Meimei@cluster0.bkbwpfb.mongodb.net/blog';

// Admin schema (matching the existing model)
const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 40,
  },
  cover: {
    _id: { type: String },
    url: { type: String },
    blurDataUrl: { type: String },
  },
  gender: { type: String },
  role: {
    type: String,
    required: true,
  },
  phone: { type: String },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  status: {
    type: String,
    required: true,
  },
  about: { type: String },
}, { timestamps: true });

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
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

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function addAdmin(email, password, name = 'Administrator') {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`❌ Admin with email ${email} already exists`);
      return;
    }

    // Check if owner role already exists
    const existingOwner = await Admin.findOne({ role: 'Owner' });
    if (existingOwner) {
      console.log('❌ An admin with Owner role already exists');
      return;
    }

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password,
      role: 'Owner',
      status: 'active',
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${name}`);
    console.log(`🔑 Role: Owner`);
    console.log(`📊 Status: active`);

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node add-admin.js <email> <password> [name]');
    console.log('Example: node add-admin.js admin@example.com Password123 Administrator');
    process.exit(1);
  }

  const email = args[0];
  const password = args[1];
  const name = args[2] || 'Administrator';

  // Validate password strength
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    console.log('❌ Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
    process.exit(1);
  }

  addAdmin(email, password, name);
}

module.exports = { addAdmin };
