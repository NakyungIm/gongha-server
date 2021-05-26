const express = require('express')
const router = express.Router()
const schedule = require('../controllers/schedule')
const { checkTokenTeacher } = require('../middlewares/auth');


router.get('/list', checkTokenTeacher, schedule.monthlySchedule); // 월별 일정 리스트 조회
router.get('/', checkTokenTeacher, schedule.readSchedule); // 일정 조회
router.post('/', checkTokenTeacher, schedule.addSchedule); // 일정 생성
router.put('/', checkTokenTeacher, schedule.editSchedule); // 일정 수정
router.delete('/', checkTokenTeacher, schedule.removeSchedule); // 일정 삭제

module.exports = router