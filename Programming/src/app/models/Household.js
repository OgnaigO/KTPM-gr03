const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const Household = new Schema({
  
  _id: String, // mã hộ khẩu
  chu_ho: { type: String, required: true },
  so_phong: { type: String, required: true },
  so_thanh_vien: { type: Number, required: true }
}, { collection: 'households' });

module.exports= mongoose.model('Household', Household)


