const express = require('express')
const router = express.Router()
const schedule = require('../controllers/schedule')

router.get('/list', schedule.monthlySchedule); // 월별 일정 리스트 조회
router.get('/', schedule.readSchedule); // 일정 조회
router.post('/', schedule.addSchedule); // 일정 생성
router.put('/', schedule.editSchedule); // 일정 수정
router.delete('/', schedule.removeSchedule); // 일정 삭제

module.exports = router