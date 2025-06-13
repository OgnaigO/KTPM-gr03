const { default: mongoose } = require("mongoose");

module.exports = {
  //xu ly array
  multipleMongooseToObject: function(mongooses){
    return mongooses.map(mongooses => mongooses.toObject());

  },

  mongooseToObject: function (mongoose){
    return mongoose ? mongoose.toObject() : mongoose;
  }
};