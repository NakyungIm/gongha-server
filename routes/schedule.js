const express = require('express')
const router = express.Router()
const schedule = require('../controllers/schedule')
const { checkTokenTeacher } = require('../middlewares/auth');


router.get('/list', schedule.monthlySchedule); // ���� ���� ����Ʈ ��ȸ
router.get('/', schedule.readSchedule); // ���� ��ȸ
router.post('/', checkTokenTeacher, schedule.addSchedule); // ���� ����
router.put('/', checkTokenTeacher, schedule.editSchedule); // ���� ����
router.delete('/', checkTokenTeacher, schedule.removeSchedule); // ���� ����

module.exports = router