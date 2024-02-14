const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new mongoose.Schema({
    event_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    event_name: { type: String, required: false },
    event_date: { type: Date, required: false },
    event_desc: { type: String, required: false },
    event_location: { type: String, required: false },
    event_visibility: { type: String, enum: ['college-level', 'department-level', 'group-specific'], required: false },
    event_flyer: { type: [String], required: false }
  });
  
const Event = mongoose.model('Event', eventSchema);
  
module.exports = Event;