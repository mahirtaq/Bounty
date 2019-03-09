const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bountySchema = new Schema({
  price: {
    type: Number,
    required: true
  },
  class: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Bounty', bountySchema);