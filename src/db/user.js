const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({          
  uid : { type: String },
  url: {type: String},
  area: {type: String},
  operator : { type: String},
  laesttime: {type: Date},
  isLive: {type: Boolean}
});

module.exports = mongoose.model('User', UserSchema, 'user');
