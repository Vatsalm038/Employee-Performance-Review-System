const express = require('express');
const passport = require('passport');
const router = express.Router();

const usersController = require('../controllers/users_controller');
const dashboardsController = require('../controllers/dashboard_controller');

router.get('/', usersController.signIn);
router.get('/sign-up', usersController.signUp);
router.get('/sign-out', usersController.destroySession);
router.get('/admin-dashboard', dashboardsController.adminDashboard);
router.get('/employee-dashboard/:id', dashboardsController.employeeDashboard);
router.get('/add-employee', usersController.addEmployee);
router.get('/edit-employee/:id', usersController.editEmployee);

router.post('/update-employee/:id', usersController.updateEmployee);

router.post('/create', usersController.create);
router.post('/create-employee', usersController.createEmployee);


router.post(
  '/create-session',
  passport.authenticate('local', { failureRedirect: '/' }),
  usersController.createSession
);

router.get('/destroy/:id', usersController.destroy)

module.exports = router;
