const HouseholdFee = require('../models/HouseholdFee');
const Household = require('../models/Household');
const Fee = require('../models/Fee');
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');

class HouseholdFeeController {
    // Cập nhật trạng thái khoản thu thành "đã nộp"
    async pay(req, res, next) {
    try {
        await HouseholdFee.updateOne(
            { _id: req.params.id },
            { status: 'đã nộp' }
        );
        // Lấy household_id để redirect về trang chi tiết hộ khẩu
        const fee = await HouseholdFee.findById(req.params.id);
        res.redirect('/household/' + fee.household_id);
    } catch (error) {
        next(error);
    }
}
async showAddContribution(req, res, next) {
    try {
        const households = await Household.find({});
        const fee = await Fee.findById(req.params.fee_id);
        res.render('add-contribution', {
            households: multipleMongooseToObject(households),
            fee: mongooseToObject(fee)
        });
    } catch (error) {
        next(error);
    }
}

    async addContribution(req, res, next) {
    try {
        const { household_id, fee_id, so_tien } = req.body;
        console.log('Form data:', req.body); 
        await HouseholdFee.create({
            household_id,
            fee_id,
            so_tien,
            status: 'đã nộp'
        });
        res.redirect('/fee'); // hoặc trang chi tiết khoản thu
    } catch (error) {
        next(error);
    }
}
}

module.exports = new HouseholdFeeController();