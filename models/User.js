const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// ADD ENROLLED CLASSES?
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // Maybe switch this to active bounties instead of keeping all bounties ever created
  createdBounties: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Bounty'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);