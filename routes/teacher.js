const express = require('express');
const router = express.Router();
const teacher = require('../controllers/teacher');
const { checkTokenTeacher } = require('../middlewares/auth');

router.get('/ping', teacher.ping);
router.post('/', teacher.createTeacher);
router.post('/login', teacher.loginTeacher);
router.get('/list', checkTokenTeacher, teacher.teachers);
router.get('/', checkTokenTeacher, teacher.getTeacherInfo);
router.put('/', checkTokenTeacher, teacher.editTeacherInfo);
router.get('/searchStudent', checkTokenTeacher, teacher.searchStudent)
router.get('/connect', checkTokenTeacher, teacher.connectStudent)
router.get('/link', checkTokenTeacher, teacher.getLinkno)
router.get('/linkList', checkTokenTeacher, teacher.getLinklist)

module.exports = router;
