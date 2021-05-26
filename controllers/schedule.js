const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql
const pool = mysql.createPool(dbconfig)

require('dayjs/locale/ko');
const utils = require('../utils')

const controller = {
    async monthlySchedule(req, res){ 
        try{
            const query = req.query
            const [ results ] = await pool.query(`
            SELECT
            no, link_no, title, content, start_datetime, end_datetime, create_datetime, update_datetime, delete_datetime
            FROM schedules
            WHERE enabled = 1
            AND link_no = ?
            `, [query.link_no])

            utils.formatting_datetime(results)

            res.status(200).json({
                schedules: results
            })
        } catch (e) {
            res.json({
                message: e
            })
        }
    },

    async readSchedule(req, res){ 
        try{
            const query = req.query;
            const [ results ] = await pool.query(`
            SELECT
            no, link_no, title, content, start_datetime, end_datetime, create_datetime, update_datetime, delete_datetime
            FROM schedules
            WHERE enabled = 1
            AND no = ?
            `, [query.schedule_no])
            
            utils.formatting_datetime(results)
            
            if (results.length < 1) res.status(403).json({ message: "해당 일정이 존재하지 않음"})

            res.status(200).json({
                schedules: results
            })
        } catch (e) {
            res.json({
                message: e
            })
        }
    },

    async addSchedule(req, res) {
        try{
            body = req.body;
            const [ result ] = await pool.query(`
            INSERT INTO
            schedules(link_no, title, content, start_datetime, end_datetime)
            VALUE
            (?, ?, ?, ?, ?)
            `, [body.link_no, body.title, body.content, body.start_datetime, body.end_datetime])

            res.status(201).json({
                message: "해당 일정이 정상적으로 추가됨"
            })
        } catch (e) {
            res.json({
                message: e
            })
        }

    },

    async editSchedule(req, res){
        try{
            
            body = req.body;

            const [ result1 ] = await pool.query(`
            SELECT
            no, link_no, title, content, start_datetime, end_datetime, create_datetime, update_datetime, delete_datetime
            FROM schedules
            WHERE no = ?
            AND enabled = 1
            `, [body.no])

            if (result1.length < 1) res.status(403).json({ message: "해당 일정이 존재하지 않음"})

            const [ result ] = await pool.query(`
            UPDATE
            schedules
            SET
            link_no = ?,
            title = ?,
            content = ?,
            start_datetime = ?,
            end_datetime = ?
            WHERE no = ?
            AND enabled = 1
            `, [body.link_no, body.title, body.content, body.start_datetime, body.end_datetime, body.no])

            res.status(200).json({
                message: "해당 일정이 정상적으로 수정됨"
            })
        } catch (e) {
            res.json({
                message: e
            })
        }
    },

    async removeSchedule(req, res){
        try{
            body = req.body;

            const [ result1 ] = await pool.query(`
            SELECT
            *
            FROM schedules
            WHERE no = ?
            AND enabled = 1
            `, [body.no])

            if (result1.length < 1) res.status(403).json({ message: "해당 일정이 존재하지 않음"})

            const [ result ] = await pool.query(`
            UPDATE
            schedules
            SET
            delete_datetime = NOW(),
            enabled = 0
            WHERE no = ?
            `, [body.no])

            res.status(200).json({
                message: "해당 일정이 정상적으로 삭제됨"
            })
        } catch (e) {
            res.json({
                message: e
            })
        }
    },
};

module.exports = controller;