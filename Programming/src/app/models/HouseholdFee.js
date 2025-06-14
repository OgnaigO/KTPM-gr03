const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const HouseholdFee = new Schema({
  household_id: { type: String, required: true, ref: 'Household' },
  fee_id: { type: String, required: true, ref: 'Fee' },
  so_tien: { type: Number, required: true }, // Thêm dòng này

  status: { type: String, enum: ['chưa nộp', 'đã nộp'], default: 'chưa nộp' }
}, { collection: 'household_fees' });




module.exports = mongoose.model('HouseholdFee', HouseholdFee);