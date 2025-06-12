const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');
const Household = require('../models/Household');
const HouseholdFee = require('../models/HouseholdFee');
const Citizen = require('../models/Citizen');
class HouseholdController {
    // Hiển thị danh sách hộ khẩu
    index(req, res, next) {
        Household.find({})
            .then(households => {
                res.render('household', { households: multipleMongooseToObject(households) });
            })
            .catch(next);
    }

    // Hiển thị form tạo hộ khẩu
    create(req, res, next) {
        res.render('createHousehold');
    }

    // Tạo mã hộ khẩu tiếp theo
    async getNextHouseholdId() {
        const latest = await Household.findOne().sort({ _id: -1 }).lean();
        let nextNumber = 1;
        if (latest && latest._id) {
            const number = parseInt(latest._id.replace('HK', ''), 10);
            nextNumber = number + 1;
        }
        return 'HK' + nextNumber.toString().padStart(3, '0');
    }

    // Lưu hộ khẩu mới vào DB
    store = async (req, res, next) => {
        try {
            const newId = await this.getNextHouseholdId();
            const newHousehold = new Household({
                _id: newId,
                chu_ho: req.body.chu_ho,
                so_phong: req.body.so_phong,
                so_thanh_vien: req.body.so_thanh_vien,
            });
            await newHousehold.save();
            res.redirect('/household');
        } catch (error) {
            next(error);
        }
    }

    // Sửa thông tin hộ khẩu
    edit(req, res, next) {
        Household.findById(req.params.id)
            .then(households => res.render('updateHousehold', { households: mongooseToObject(households) }))
            .catch(next);
    }

    update(req, res, next){
        Household.updateOne({ _id: req.params.id}, req.body)
            .then(() => res.redirect('/household'))
            .catch(next);
    }

    // Xoá hộ khẩu



async delete(req, res, next) {
  try {
    const householdId = req.params.id;

    // 1. Xóa hộ khẩu
    await Household.deleteOne({ _id: householdId });

    // 2. Xóa nhân khẩu thuộc hộ khẩu này
    await Citizen.deleteMany({ ma_ho_khau: householdId });

    // 3. Redirect
    res.redirect('/household');
  } catch (error) {
    next(error);
  }
}


    // Hiển thị chi tiết hộ khẩu theo mã hộ khẩu (slug)
    showHouseholdBySlug(req, res, next) {
  const maHoKhau = req.params.slug;
      console.log('Vai trò người dùng:', req.session.user?.role);

  Promise.all([
    Household.findOne({ _id: maHoKhau }),
    HouseholdFee.find({ household_id: maHoKhau }).populate('fee_id')
  ])
    .then(([household, household_fees]) => {
  res.render('household-detail', {
    household: mongooseToObject(household),
    household_fees: multipleMongooseToObject(household_fees),
    user: req.session.user
  });
})
    .catch(next);
}
    
}

module.exports = new HouseholdController();