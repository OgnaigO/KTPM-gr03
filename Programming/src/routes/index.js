const householdRouter = require('./household');
const citizenRouter = require('./citizen');
const feeRouter = require('./fee')
const householdFeeRouter = require('./household-fee');
const authRouter = require('./auth');
const adminRouter = require('./admin');
const userInforRouter = require('./userInfor');
function route(app) {
    app.use('/household', householdRouter);
    app.use('/fee', feeRouter);
    app.use('/citizen', citizenRouter);
    app.use('/household-fee', householdFeeRouter);
    app.use('/admin', adminRouter);
    app.use('/user', userInforRouter);
    app.use('/', authRouter);

}

module.exports = route;
