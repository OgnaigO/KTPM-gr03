
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');
const Fee = require('../models/Fee');
const Household = require('../models/Household');
const HouseholdFee = require('../models/HouseholdFee');
const Counter = require('../models/Counter');

class FeeController {
    index(req, res, next){
        Fee.find({})
            .then(fees => {
                res.render('fee', {fees : multipleMongooseToObject(fees)});
            })
            .catch(next);
    }

    create(req, res, next) {
        res.render('createFee');
    }

    async getNextFeeId() {
        const latestFee = await Fee.findOne({})
            .sort({ _id: -1 })
            .lean();
        let nextNumber = 1;
        if (latestFee && latestFee._id) {
            const numberPart = parseInt(latestFee._id.replace('KT', ''), 10);
            nextNumber = numberPart + 1;
        }
        return 'KT' + nextNumber.toString().padStart(3, '0');
    }

    store = async (req, res, next) => {
        try {
            const newId = await this.getNextFeeId();

            const newFee = new Fee({
                _id: newId,
                ten_khoan_thu: req.body.ten_khoan_thu,
                loai_khoan_thu: req.body.loai_khoan_thu,
                so_tien: parseInt(req.body.so_tien, 10),
                dot_thu: req.body.dot_thu,
                ngay_bat_dau: req.body.ngay_bat_dau,
                ngay_ket_thuc: req.body.ngay_ket_thuc,
            });

            await newFee.save();

            // Nếu là khoản thu bắt buộc, gán cho tất cả hộ khẩu
            if (newFee.loai_khoan_thu === 'Bắt buộc') {
    const households = await Household.find({});
    const assignments = households.map(hh => ({
        household_id: hh._id,
        fee_id: newFee._id,
        so_tien: newFee.so_tien,         
        status: 'chưa nộp'
    }));
    if (assignments.length > 0) {
        await HouseholdFee.insertMany(assignments);
    }
}

            res.redirect('/fee');
        } catch (error) {
            next(error);
        }
    }

    edit(req, res, next) {
        Fee.findById(req.params.id)
            .then(fees => res.render('updateFee', { fees: mongooseToObject(fees) }))
            .catch(next);
    }

    update(req, res, next){
        Fee.updateOne({ _id: req.params.id}, req.body)
            .then(() => res.redirect('/fee'))
            .catch(next);
    }

    async delete(req, res, next) {
  try {
    const feeId = req.params.id;

    // 1. Xóa khoản thu
    await Fee.deleteOne({ _id: feeId });

    // 2. Xóa tất cả các bản ghi household_fee liên quan đến fee này
    await HouseholdFee.deleteMany({ fee_id: feeId });

    // 3. Redirect về danh sách khoản thu
    res.redirect('/fee');
  } catch (error) {
    next(error);
  }
}


    
    async showDetail(req, res, next) {
  try {
    const feeId = req.params.id;

    const fee = await Fee.findById(feeId).lean();
    const contributions = await HouseholdFee.find({ fee_id: feeId }).lean();

    const daNop = contributions.filter(item => item.status === 'đã nộp');
    const chuaNop = contributions.filter(item => item.status === 'chưa nộp');

    const tongThu = daNop.reduce((sum, item) => sum + (item.so_tien || 0), 0);
    const tongCanThu = fee.so_tien * contributions.length;
    const conThieu = tongCanThu - tongThu;

    res.render('fee-detail', {
      fee,
      daNop,
      chuaNop,
      tongThu,
      conThieu,
      totalHouseholds: daNop.length + chuaNop.length
    });
  } catch (error) {
    next(error);
  }
}
};

module.exports = new FeeController();
