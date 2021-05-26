const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql;
const config = require('../config');
const pool = mysql.createPool(dbconfig);
const utils = require('../utils');

const controller = {
  async ping(req, res) {
    res.status(201).json({
      success: 1,
      message: 'teacher',
    });
  },

  async createTeacher(req, res) {
    try {
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const region = req.body.region;
      const background = req.body.background;
      const age = req.body.age;
      //   const student_count = req.body.student_count;

      const [result] = await pool.query(
        `
        SELECT 
        COUNT(*) AS 'count'
        FROM teachers
        WHERE enabled=1 
        AND email = ?
      `,
        [email]
      );
      if (result[0].count > 0) {
        // console.log(result);
        res.json({ message: '이미 존재하는 계정입니다.' });
      } else {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
          await connection.beginTransaction();
          await connection.query(
            `
            INSERT INTO
            teachers(name, email, password, region, background, age)
            VALUE
            (?, ?, PASSWORD(?), ?, ?, ?);
          `,
            [name, email, password, region, background, age]
          );
          await connection.commit();

          res.json({
            message: '회원가입이 정상적으로 이루어졌습니다.',
          });
        } catch (e) {
          await connection.rollback();
          console.log(e);
        } finally {
          connection.release();
        }
      }
    } catch (e) {
      console.log(e);
    }
  },

  async loginTeacher(req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const [results] = await pool.query(
        `
                SELECT *
                FROM teachers
                WHERE email = ?
                AND password = PASSWORD(?)
            `,
        [email, password]
      );
      if (results.length > 0) {
        const teacher_no = results[0].no;
        const email = results[0].email;
        const token = utils.sign({ teacher_no, email });
        res.status(200).json({
          token,
        });
      } else {
        res.status(401).json({
          message: '이메일 또는 비밀번호가 일치하지 않습니다.',
        });
      }
    } catch (e) {
      console.log(e);
    }
  },

  async getTeacherInfo(req, res) {
    try {
      const teacher_no = req.user.teacher_no;
      const [results] = await pool.query(
        `
            SELECT no, name, email, region, background
            FROM teachers
            WHERE enabled=1
            AND no = ?;
        `,
        [teacher_no]
      );
      if (results.length < 1) {
        res.json({
          message: '비활성화된 계정이거나 정보가 존재하지 않는 계정입니다.',
        });
      } else {
        res.json({
          ...results[0],
        });
      }
    } catch (e) {
      console.log(e);
    }
  },

  async teachers(req, res) {
    try {
      const [results] = await pool.query(
        `
            SELECT no, name, email, region, background
            FROM teachers
            WHERE enabled=1
        `
      );
      if (results.length < 1) {
        res.json({
          message: '등록된 선생님이 없습니다',
        });
      } else {
        res.json({
          teachers: results.map((result) => ({ ...result })),
        });
      }
    } catch (e) {
      console.log(e);
    }
  },

  async editTeacherInfo(req, res) {
    try {
      const teacher_no = req.user.teacher_no;

      const email = req.body.email;
      const password = req.body.password;
      const region = req.body.region;
      const background = req.body.background;

      const [result] = await pool.query(`
      SELECT * 
      FROM teachers 
      WHERE no = ?
      AND enabled = 1;
      `, [teacher_no])

      if (result.length < 1) res.status(403).json({ message: "해당 선생님이 존재하지 않음" })

      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();
        await connection.query(
          `
          UPDATE teachers
          SET
          email = ?,
          password = PASSWORD(?),
          region = ?,
          background = ?
          WHERE no = ?; 
          `,
          [email, password, region, background, teacher_no]
        );
        await connection.commit();
        res.json({
          message: '계정 정보가 정상적으로 변경되었습니다.',
        });
      } catch (e) {
        await connection.rollback();
        console.log(e);
      } finally {
        // console.log(e);

        connection.release();
      }
    } catch (e) {
      console.log(e);
    }
  },
  async searchStudent(req, res, next) {
    try {
      const student_email = req.query.email

      const [result] = await pool.query(`
          SELECT * 
          FROM students 
          WHERE email = ?
          AND enabled = 1;
          `, [student_email])

      if (result.length < 1) res.status(403).json({ message: "해당 학생이 존재하지 않음" })

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
            `, [student.email, student.password, student.region, student.grade, student_no])

        await connection.commit()
        res.status(200).json({ message: "학생 정보 수정 완료" })

      } catch (e) {
        await connection.rollback()
        next(e)
      } finally {
        connection.release()
      }
    } catch (e) {
      next(e)
    }
  },
};

module.exports = controller;
