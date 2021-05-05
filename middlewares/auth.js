const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql;
const pool = mysql.createPool(dbconfig);
const auth = require('../utils')

module.exports = {
    async checkTokenStudent(req, res, next) {
        const bearer_token = req.headers.authorization;
        const array = bearer_token.split(' ')
        const token = array[1]

        try {
            if(token === undefined) throw Error('Undefined Token')
            const verified = auth.verify(token)
            const student_no = verified.student_no

            const email = verified.email
            const [ results ] = await pool.query(`
            SELECT
            COUNT(*) AS 'count'
            FROM students
            WHERE enabled = 1
            AND no = ?;
            `, [ student_no ])
            console.log(results);
            
            if (results.length === 0) throw Error('Unauthorized Error')
            req.user = { student_no, email }
            next()
        }
        catch (e) {
            next(e)
        }
    },
    async checkTokenTeacher(req, res, next) {
        const bearer_token = req.headers.authorization;
        const array = bearer_token.split(' ')
        const token = array[1]

        try {
            if(token === undefined) throw Error('Undefined Token')
            const verified = auth.verify(token)
            const teacher_no = verified.teacher_no

            const email = verified.email
            const [ results ] = await pool.query(`
            SELECT
            COUNT(*) AS 'count'
            FROM teachers
            WHERE enabled = 1
            AND no = ?;
            `, [ teacher_no ])
            console.log(results);
            
            if (results.length === 0) throw Error('Unauthorized Error')
            req.user = { teacher_no, email }
            next()
        }
        catch (e) {
            next(e)
        }
    }
}                                                                                                                                       