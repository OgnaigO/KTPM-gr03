const { default: mongoose } = require("mongoose");


const Schema = mongoose.Schema;


const Citizen = new Schema({
  
  _id: String, // mã nhân khẩu
  ho_ten: { type: String, required: true },
  tuoi: { type: Number, required: true },
  gioi_tinh: { type: String, enum: ['Nam', 'Nữ'], required: true },
  so_cccd: { type: String, required: true },
  so_dien_thoai: { type: String },
  ma_ho_khau: {
    type: String,
    ref: 'Household',
    required: true
  },
  trang_thai: {
  type: String,
  enum: ['đang ở', 'chuyển đi', 'đã qua đời'], 
  // hoặc các giá trị bạn định dùng
  required: true
},

}, { collection: 'citizens' });

module.exports= mongoose.model('Citizen', Citizen)

