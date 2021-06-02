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
      message: 'teacher',
    });
  },

  async createTeacher(req, res, next) {
    try {
      const body = req.body;
      const name = param(body, 'name');
      const email = param(body, 'email');
      const password = param(body, 'password');
      const region = param(body, 'region');
      const background = param(body, 'background');
      const age = param(body, 'age');

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
        next({ message: `회원가입이 완료되었습니다.` });
      } catch (e) {
        await connection.rollback();
        console.log(e);
      } finally {
        connection.release();
      }
    } catch (e) {
      next(e);
    }
  },

  async loginTeacher(req, res, next) {
    try {
      const body = req.body;
      const email = param(body, 'email');
      const password = param(body, 'password');

      const [results] = await pool.query(
        `
                SELECT *
                FROM teachers
                WHERE email = ?
                AND password = PASSWORD(?)
            `,
        [email, password]
      );

      if (results.length < 1) {
        throw error(`이메일 또는 비밀번호가 일치하지 않습니다.`);
      } else {
        const teacher_no = results[0].no;
        const email = results[0].email;
        const token = utils.sign({ teacher_no, email });
        next({ token });
      }
    } catch (e) {
      next(e);
    }
  },

  async getTeacherInfo(req, res, next) {
    try {
      const teacher_no = req.user.teacher_no;

      const [results] = await pool.query(
        `
            SELECT no, name, email, region, background, age
            FROM teachers
            WHERE no = ?
            AND enabled=1;
        `,
        [teacher_no]
      );

      if (results.length < 1)
        throw error(`비활성화된 계정이거나 정보가 존재하지 않는 계정입니다.`);

      next({ ...results[0] });
    } catch (e) {
      next(e);
    }
  },

  async editTeacherInfo(req, res, next) {
    try {
      const body = req.body;
      const teacher_no = req.user.teacher_no;
      const email = param(body, 'email');
      const password = param(body, 'password');
      const region = param(body, 'region');
      const background = param(body, 'background');

      const [result] = await pool.query(
        `
      SELECT * 
      FROM teachers 
      WHERE no = ?
      AND enabled = 1;
      `,
        [teacher_no]
      );
      if (result.length < 1) throw error(`해당 선생님이 존재하지 않습니다.`);

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
        next({ message: '계정 정보가 정상적으로 변경되었습니다.' });
      } catch (e) {
        await connection.rollback();
      } finally {
        connection.release();
      }
    } catch (e) {
      next(e);
    }
  },
  async searchStudent(req, res, next) {
    try {
      const student_email = req.query.email;

      const [result] = await pool.query(
        `
          SELECT * 
          FROM students 
          WHERE email = ?
          AND enabled = 1;
          `,
        [student_email]
      );

      if (result.length < 1) throw error('해당 학생이 존재하지 않음');
      next({ result });
    } catch (e) {
      next(e);
    }
  },
  async connectStudent(req, res) {
    try {
      const teacher_no = req.user.teacher_no;
      const student_no = req.query.student_no;

      const [result] = await pool.query(
        `
      SELECT * 
      FROM students 
      WHERE no = ?
      AND enabled = 1;
      `,
        [student_no]
      );

      if (result.length < 1) throw error('해당 선생님이 존재하지 않습니다.');

      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();
        await connection.query(
          `
        INSERT INTO
        links(teacher_no, student_no)
        VALUE
        (?, ?);
        `,
          [teacher_no, student_no]
        );
        await connection.commit();
        next({ message: '연결이 완료되었습니다.' });
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
      const student_no = req.query.student_no;
      const teacher_no = req.user.teacher_no;

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

      if (result.length < 1) throw error('해당 연결이 존재하지 않습니다.');
      next({ ...result[0] });
    } catch (e) {
      next(e);
    }
  },
  async getLinklist(req, res, next) {
    try {
      const teacher_no = req.user.teacher_no;

      const [result] = await pool.query(
        `
          SELECT * 
          FROM links 
          WHERE teacher_no = ?
          AND enabled = 1;
          `,
        [teacher_no]
      );

      if (result.length < 1) throw error('해당 연결이 존재하지 않습니다.');
      next({ result });
    } catch (e) {
      next(e);
    }
  },
};

module.exports = controller;
