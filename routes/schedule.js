const express = require('express')
const router = express.Router()
const schedule = require('../controllers/schedule')
const { checkToken } = require('../middlewares/auth');


router.get('/list', checkToken, schedule.monthlySchedule); // 월별 일정 리스트 조회
router.get('/', checkToken, schedule.readSchedule); // 일정 조회
router.post('/', checkToken, schedule.addSchedule); // 일정 생성
router.put('/', checkToken, schedule.editSchedule); // 일정 수정
router.delete('/', checkToken, schedule.removeSchedule); // 일정 삭제

module.exports = router