
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');
const Citizen = require('../models/Citizen');
const Household = require('../models/Household');
const HouseholdFee = require('../models/HouseholdFee');

const Counter = require('../models/Counter');

class CitizenController {
  index(req, res, next) {
    Citizen.find({})
    .then(citizens => {
      res.render('citizen', {
        citizens: multipleMongooseToObject(citizens)
         // hoặc req.user, tùy bạn lưu chỗ nào
      });
    })
    .catch(next);
  }

  showHouseholdBySlug(req, res, next) {
        const maHoKhau = req.params.slug;
        Promise.all([
          Household.findOne({ _id: maHoKhau }),
          HouseholdFee.find({ household_id: maHoKhau, status: 'chưa nộp' }).populate('fee_id') // ← Thêm dòng này
        ])
          .then(([household, household_fees]) => {
            res.render('household-detail', {
              household: mongooseToObject(household),
              household_fees: multipleMongooseToObject(household_fees)
            });
          })
          .catch(next);
        }
  create(req, res, next) {
    res.render('createCitizen');
  }

async getNextCitizenId() {
  // Tìm ID lớn nhất hiện tại trong collection citizens
  const latestCitizen = await Citizen.findOne({})
    .sort({ _id: -1 }) // Sắp giảm dần theo _id
    .lean(); // Lấy object đơn giản

  let nextNumber = 1;

  if (latestCitizen && latestCitizen._id) {
    // Trích số từ _id: NK001 → 1, NK010 → 10
    const numberPart = parseInt(latestCitizen._id.replace('NK', ''), 10);
    nextNumber = numberPart + 1;
  }

  // Tạo mã theo format NK + 3 số 0 ở đầu
  return 'NK' + nextNumber.toString().padStart(3, '0');
}


  // ✅ Chuyển sang arrow function để giữ `this`
  store = async (req, res, next) => {
    try {
      const newId = await this.getNextCitizenId();

      const newCitizen = new Citizen({
        _id: newId,
        ho_ten: req.body.ho_ten,
        tuoi: req.body.tuoi,
        so_cccd: req.body.so_cccd,
        so_dien_thoai: req.body.so_dien_thoai,
        ma_ho_khau: req.body.ma_ho_khau,
        trang_thai: req.body.trang_thai,
        gioi_tinh: req.body.gioi_tinh,
        slug: req.body.ma_ho_khau,
      });

      await newCitizen.save();
      res.redirect('/citizen');
    } catch (error) {
      next(error);
    }
  }
// Sửa thông tin nhân khẩu
  edit(req, res, next) {
    Citizen.findById(req.params.id)
        .then(citizens => res.render('updateCitizen', { citizens: mongooseToObject(citizens) }))
        .catch(next);
    
  }

  update(req, res, next){
    Citizen.updateOne({ _id: req.params.id}, req.body)
      .then(() => res.redirect('/citizen'))
      .catch(next);
  }

  //Xóa nhân khẩu

  delete(req, res, next){
    Citizen.deleteOne({ _id: req.params.id})
      .then(() => res.redirect('/citizen'))
      .catch(next);
  }
}



module.exports = new CitizenController();
