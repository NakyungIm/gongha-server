const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql;
const pool = mysql.createPool(dbconfig);
const utils = require('../utils');
const { param } = require('../utils/params');
const { error } = require('../utils/result');

const controller = {
  async ping(req, res) {
    next({
      success: 1,
      message: 'student',
    });
  },
  async createStudent(req, res, next) {
    try {
      const body = req.body;
      const name = param(body, 'name');
      const email = param(body, 'email');
      const password = param(body, 'password');
      const region = param(body, 'region');
      const grade = param(body, 'grade');
      const age = param(body, 'age');

      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();
        await connection.query(
          `
              INSERT INTO
              students(name, email, password, region, grade, age)
              VALUE
              (?, ?, PASSWORD(?), ?, ?, ?);
              `,
          [name, email, password, region, grade, age]
        );
        await connection.commit();
        next({ message: `회원가입이 완료되었습니다.` });
      } catch (e) {
        await connection.rollback();
      } finally {
        connection.release();
      }
    } catch (e) {
      next(e);
    }
  },
  async loginStudent(req, res, next) {
    try {
      const body = req.body;
      const email = param(body, 'email');
      const password = param(body, 'password');

      const [results] = await pool.query(
        `
              SELECT * 
              FROM students 
              WHERE email = ?
              AND password = PASSWORD(?);
          `,
        [email, password]
      );

      if (results.length < 1) {
        throw error(`이메일 또는 비밀번호가 일치하지 않습니다.`);
      } else {
        const student_no = results[0].no;
        const email = results[0].email;
        const token = utils.sign({ student_no, email });
        next({ token });
      }
    } catch (e) {
      next(e);
    }
  },
  async getStudentInfo(req, res, next) {
    try {
      const student_no = req.user.student_no;

      const [result] = await pool.query(
        `
          SELECT no, name, email, region, grade, age
          FROM students
          WHERE no = ?
          AND enabled = 1 
          `,
        [student_no]
      );

      if (result.length < 1)
        throw error(`비활성화된 계정이거나 정보가 존재하지 않는 계정입니다.`);

      next({ ...result[0] });
    } catch (e) {
      next(e);
    }
  },
  async editStudentInfo(req, res, next) {
    try {
      const body = req.body;
      const student_no = req.user.student_no;
      const email = param(body, 'email');
      const password = param(body, 'password');
      const region = param(body, 'region');
      const grade = param(body, 'grade');

      const [result] = await pool.query(
        `
          SELECT * 
          FROM students 
          WHERE no = ?
          AND enabled = 1;
          `,
        [student_no]
      );

      if (result.length < 1) throw error(`해당 학생이 존재하지 않습니다.`);

      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();
        await connection.query(
          `
              UPDATE students
              SET
              email = ?,
              password = PASSWORD(?),
              region = ?,
              grade = ?
              WHERE no = ?
              AND enabled = 1;
              `,
          [email, password, region, grade, student_no]
        );

        await connection.commit();
        next({ message: `계정 정보가 정상적으로 변경되었습니다.` });
      } catch (e) {
        await connection.rollback();
      } finally {
        connection.release();
      }
    } catch (e) {
      next(e);
    }
  },

  async getLinkno(req, res, next) {
    try {
      const student_no = req.user.student_no;
      const teacher_no = req.query.teacher_no;

      const [result] = await pool.query(
        `
          SELECT * 
          FROM links 
          WHERE student_no = ?
          AND teacher_no = ?
          AND enabled = 1;
          `,
        [student_no, teacher_no]
      );

      if (result.length < 1) throw error(`해당 연결이 존재하지 않습니다.`);
      next({ ...result[0] });
    } catch (e) {
      next(e);
    }
  },
  async getLinklist(req, res, next) {
    try {
      const student_no = req.user.student_no;

      const [result] = await pool.query(
        `
          SELECT * 
          FROM links 
          WHERE student_no = ?
          AND enabled = 1;
          `,
        [student_no]
      );

      if (result.length < 1) throw error(`해당 연결이 존재하지 않습니다.`);
      next({ result });
    } catch (e) {
      next(e);
    }
  },
};

module.exports = controller;
