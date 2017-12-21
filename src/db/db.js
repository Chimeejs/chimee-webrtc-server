const User = require('./user');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const assert = require('assert');

class DB{
  constructor(config) {
    this.url = config.url || 'mongodb://localhost:27017/p2p';
    this.port = config.port || '27017';
    this.dbName = config.dbName || 'p2p';
    this.db = mongoose.connection;
    this.connect();
    this.bindEvent();
  }

  connect() {
    this.mongoose = mongoose.connect(this.url, {
      useMongoClient: true,
      socketTimeoutMS: 0,
      keepAlive: true,
      reconnectTries: 30
    });
  }

  bindEvent() {
    const db = this.db;
    // db.once('open', function() {
      
    // })
  }

  async save(data) {
    const silence = new User(data);
    const result = await silence.save();
    return result;
  }

  async find(data) {
    const result = await User.find(data).catch((e)=>{
      return false;
    });
    return result;
  }

  async remove() {
    var silence = new User(data);
    const result = await silence.deleteOne();
    return result;
  }

  async update(condition, data) {
    const result = await User.update(condition, data);
    return result;
  }
}

module.exports = DB;