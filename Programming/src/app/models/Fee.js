const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const Fee = new Schema({
  
  _id: { type: String, required: true }, // mã khoản thu, ví dụ "KT001"
  ten_khoan_thu: { type: String, required: true },
  loai_khoan_thu: { type: String, enum: ['Bắt buộc', 'Tự nguyện'], required: true },
  so_tien: { type: Number, required: true },
  

  dot_thu: { type: String, required: true }, // định dạng "MM/YYYY", dùng để hiển thị
  ngay_bat_dau: { type: Date, required: true }, // ngày bắt đầu khoản thu, chỉ lưu phần ngày
  ngay_ket_thuc: { type: Date, required: true }, // ngày kết thúc khoản thu, chỉ lưu phần ngày
}, { collection: 'fees' });

module.exports= mongoose.model('Fee', Fee)

