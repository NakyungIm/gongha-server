// const { env, defaultPassword } = require('../config')
const mysql = require('mysql2/promise')
const dbconfig = require('../config/index').mysql
const pool = mysql.createPool(dbconfig)
const utils = require('../utils')

const controller = {
    async ping(req, res) {
        res.status(201).json({
            success:1,
            message: "say hello"
        })
    },
    async createStudent(req, res) {
        try{
            body = req.body;
            const [ result ] = await pool.query(`
            INSERT INTO
            students(name, email, password, region, grade, age)
            VALUE
            (?, ?, PASSWORD(?), ?, ?, ?);
            `, [body.name, body.email, body.password, body.region, body.grade, body.age])

            res.status(201).json({
                message: "학생 회원가입 완료"
            })    
        } catch (e) {
            res.status(code).json({
                error: e
            })
        }
    },
    async loginStudent(req, res, next) {
        try {
          var email = req.body.email
          var password = req.body.password
          const [results] = await pool.query(`
              SELECT * 
              FROM students 
              WHERE email = ?
              AND password = PASSWORD(?);
          `, [email, password])

          if (results.length > 0) {
            const user_no = results[0].no
            const email = results[0].email
            const token = utils.sign({ user_no, email })
            
            res.status(200).json({
                message: "학생 로그인 완료",
                token: token,
            })
          } else {
            res.status(401).json({
              message: '이메일 또는 비밀번호가 일치하지 않습니다.',
            })
          }
        } catch (e) {
          next(e);
        }
      },
      async getStudentInfo(req, res, next){
        try {
          const student_no = req.user.user_no
          
          const [ result ] = await pool.query(`
          SELECT *
          FROM students
          WHERE no = ?
          AND enabled = 1
          `, [ student_no ])

          if (result.length < 1) res.status(403).json({ message: "해당 학생이 존재하지 않음"})

          utils.formatting_datetime(result)
          
          res.status(200).json( result[0] )

        } catch (e) {
          next(e)
        }
      },
      async editStudentInfo(req, res, next){
        try {
          const student_no = req.user.user_no
          const student = req.body

          const [ result ] = await pool.query(`
          SELECT * 
          FROM students 
          WHERE no = ?
          AND enabled = 1;
          `, [ student_no ])

          if (result.length < 1) res.status(403).json({ message: "해당 학생이 존재하지 않음"})
          
          const connection = await pool.getConnection(async conn => conn)
          try {
            await connection.beginTransaction()
            await connection.query(`
            UPDATE students
            SET
            email = ?,
            password = ?,
            region = ?,
            grade = ?
            WHERE no = ?
            AND enabled = 1;
            `, [ student.email, student.password, student.region, student.grade, student_no ])

            await connection.commit()
            res.status(200).json({ message: "학생 정보 수정 완료"})

          } catch (e) {
            await connection.rollback()
            next(e)
          } finally {
            connection.release()
          }
        } catch(e){
          next(e)
        }
      },
}

module.exports = controller