const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql
const pool = mysql.createPool(dbconfig)
const dayjs = require('dayjs');
require('dayjs/locale/ko');

const controller = {
    async monthlySchedule(req, res){ 
        try{
            //const start_date = dayjs(param(query, 'start_date')).format('YYYY-MM');
            //const end_date = dayjs(param(query, 'start_date')).add(1, 'month').format('YYYY-MM-DD');
            console.log(req);
            body = req.body;
            const [ results ] = await pool.query(`
            SELECT
            no, link_no, title, content, start_datetime, end_datetime, create_datetime, update_datetime, delete_datetime
            FROM schedules
            WHERE enabled = 1
            `)

            //format.changeDate(results);
            
            res.status(201).json({
                result: results,
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

            const [ result1 ] = await pool.query(`
            SELECT
            no, link_no, title, content, start_datetime, end_datetime
            FROM schedules
            WHERE enabled = 1
            `)

            res.status(201).json({
                result: result1,
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

            const [ result1 ] = await pool.query(`
            SELECT
            no, link_no, title, content, start_datetime, end_datetime, create_datetime, update_datetime, delete_datetime
            FROM schedules
            WHERE no = ?
            `, [body.no])

            res.status(201).json({
                result: result1,
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
            const [ result ] = await pool.query(`
            UPDATE
            schedules
            SET
            delete_datetime = NOW(),
            enabled = 0
            WHERE no = ?
            `, [body.no])
            if (result.length < 1) throw json({
                message: "The schedule has already been deleted."
            })

            const [ result1 ] = await pool.query(`
            SELECT
            *
            FROM schedules
            WHERE no = ?
            `, [body.no])

            res.status(201).json({
                result: result1,
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