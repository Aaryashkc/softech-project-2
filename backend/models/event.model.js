import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
  title:{
    type: String,
    required: true,
    trim:true,
  },
  date:{
    type: Date,
    default: Date.now,
    trim:true,
  },
  time:{
    type: String,
  },
  location:{
    type: String,
    trim:true,
  },
  description:{
    type: String,
    trim:true,
  },
  image:{
    type: String,
    required: true,
    trim:true,
  },
  isComingSoon: {
    type: Boolean,
    default: false,
  },


}, 
{timestamps: true} 
);

const Event = mongoose.model('Event', eventSchema);

export default Event;