import mongoose, { Schema } from "mongoose";

// Define the schema
const HospitalSchema = new Schema({
  adsNote: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true, // Ensure the name is required
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  duration: {
    type: String, // You can adjust the type if it's in hours, days, etc.
    required: true,
  },
  payRate: {
    type: Number, // Assuming payRate is a number, you can change it to String if necessary
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  licenseRequired: {
    type: String, // Assuming licenseRequired is a boolean (true/false)
    required: true,
  },
});

// Create the model
export const Hospital = mongoose.model("Hospital", HospitalSchema);

// Export the model
