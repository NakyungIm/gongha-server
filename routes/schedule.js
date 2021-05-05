const express = require('express')
const router = express.Router()
const schedule = require('../controllers/schedule')

router.get('/list', schedule.monthlySchedule); // ���� ���� ����Ʈ ��ȸ
router.get('/', schedule.readSchedule); // ���� ��ȸ
router.post('/', schedule.addSchedule); // ���� ����
router.put('/', schedule.editSchedule); // ���� ����
router.delete('/', schedule.removeSchedule); // ���� ����

module.exports = router