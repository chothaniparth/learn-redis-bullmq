// create event schema in which there will be an array of addresses in one field. address object has multiple fileds like block, ctreet, city , state, etc;
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organizer', // Reference to the Organizer model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  addresses: [
    {
      block: {
        type: String
      },
      street: {
        type: String
      },
      city: {
        type: String
      },
      state: {
        type: String
      },
      zip: {
        type: String
      }
    },
  ],
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;