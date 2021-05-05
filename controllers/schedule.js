const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql
const pool = mysql.createPool(dbconfig)

require('dayjs/locale/ko');
const utils = require('../utils')

const controller = {
    async monthlySchedule(req, res){ 
        try{

            const start_date = req.query.start_date

            const body = req.body;
            const [ results ] = await pool.query(`
            SELECT
            no, link_no, title, content, start_datetime, end_datetime, create_datetime, update_datetime, delete_datetime
            FROM schedules
            WHERE enabled = 1
            `)

            utils.formatting_datetime(results)

            res.status(201).json({
                schedules: results,
                message: "it's okay"
            })
        } catch (e) {
            res.json({
                message: e
            })
        }
    },

    async readSchedule(req, res){ 
        res.status(201).json({ message: 'ok'});
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
                message: "The schedule has been created normally."
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
            `, [body.no])

            if (result1.length < 1) res.status(403).json({ message: "해당 일정이 존재하지 않음"})

            const [ result ] = await pool.query(`
            UPDATE
            schedules
            SET
            title = ?,
            content = ?,
            start_datetime = ?,
            end_datetime = ?
            WHERE no = ?
            `, [body.title, body.content, body.start_datetime, body.end_datetime, body.no])

            res.status(201).json({
                message: "The schedule has been updated normally."
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

            res.status(201).json({
                message: "The schedule has been deleted normally."
            })
        } catch (e) {
            res.json({
                message: e
            })
        }
    },
};

module.exports = controller;