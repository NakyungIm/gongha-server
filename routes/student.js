const express = require('express');
const router = express.Router();
const student = require('../controllers/student');
const { checkTokenStudent } = require('../middlewares/auth');

router.get('/ping', student.ping); // 핑
router.post('/', student.createStudent);
router.post('/login', student.loginStudent);
router.get('/', checkTokenStudent, student.getStudentInfo);
router.put('/', checkTokenStudent, student.editStudentInfo);
router.get('/link', checkTokenStudent, student.getLinkno);
router.get('/linkList', checkTokenStudent, student.getLinklist);

module.exports = router;
