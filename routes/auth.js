const express = require('express');
const router = express.Router();
var User = require('../models/User');
const { ensureAuthenticated , authorizeRoles} = require('../config/checkAuth')

//------------ Importing Controllers ------------//
const authController = require('../controllers/authController')

//------------ Login Route ------------//
router.get('/login', (req, res) => res.render('login'));



//------------ Register Route ------------//
router.get('/register', (req, res) => res.render('register'));

//------------ Register POST Handle ------------//
router.post('/register', authController.registerHandle);


//------------Teacher Register Route ------------//
router.get('/tea_register', (req, res) => res.render('teacher_register'));

//------------ Register POST Handle ------------//
router.post('/tea_register', authController.tea_registerHandle);


//------------Sub Register Route ------------//
router.get('/sub_register', (req, res) => res.render('sub_register'));

//------------ Register POST Handle ------------//
router.post('/sub_register', authController.registerSubHandle);




//------------ Login POST Handle ------------//
router.post('/login', authController.loginHandle);

//------------ Logout GET Handle ------------//
router.get('/logout', authController.logoutHandle);


//--------- Placement Post Handle---//
router.post('/placement_record', authController.Placement);

//------- Slow and fster learner-----//
router.post('/student_learner', authController.Learner);





// router.get('/slowlearn', (req, res) => res.render('slowlearn'));

  
module.exports = router;


