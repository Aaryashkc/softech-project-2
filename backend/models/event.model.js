import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
  title:{
    type: String,
    required: true,
    trim:true,
  },
  date:{
    type: Date,
    required: true,
    trim:true,
  },
  time:{
    type: String,
    required: true,
  },
  location:{
    type: String,
    required: true,
    trim:true,
  },
  description:{
    type: String,
    required: true,
    trim:true,
  },
  image:{
    type: String,
    required: true,
    trim:true,
  },


}, 
{timestamps: true} 
);

const Event = mongoose.model('Event', eventSchema);

export default Event;