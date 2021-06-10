const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql;
const pool = mysql.createPool(dbconfig);
const utils = require('../utils');
const { param } = require('../utils/params');
const { error } = require('../utils/result');

const controller = {
  async monthlySchedule(req, res, next) {
    try {
      const query = req.query;
      const link_no = param(query, 'link_no');

      const [result] = await pool.query(
        `
            SELECT *
            FROM links
            WHERE no = ?
            AND enabled = 1;
            `,
        [link_no]
      );

      if (result.length < 1) throw error(`해당 link가 존재하지 않습니다.`);

      const [results] = await pool.query(
        `
            SELECT
            no, link_no, title, content, start_datetime, end_datetime, create_datetime, update_datetime, delete_datetime
            FROM schedules
            WHERE enabled = 1
            AND link_no = ?
            `,
        [link_no]
      );

      utils.formatting_datetime(results);
      next({ results });
    } catch (e) {
      next(e);
    }
  },

  async readSchedule(req, res, next) {
    try {
      const query = req.query;
      const schedule_no = param(query, 'schedule_no');
      const link_no = param(query, 'link_no');

      const [result] = await pool.query(
        `
            SELECT *
            FROM links
            WHERE no = ?
            AND enabled = 1;
            `,
        [link_no]
      );

      if (result.length < 1) throw error(`해당 link가 존재하지 않습니다.`);

      const [results] = await pool.query(
        `
            SELECT
            no, link_no, title, content, start_datetime, end_datetime, create_datetime, update_datetime, delete_datetime
            FROM schedules
            WHERE enabled = 1
            AND no = ?
            AND link_no = ?
            `,
        [schedule_no, link_no]
      );

      utils.formatting_datetime(results);

      if (results.length < 1) throw error(`해당 일정이 존재하지 않습니다`);
      next({ results });
    } catch (e) {
      next(e);
    }
  },

  async addSchedule(req, res, next) {
    try {
      const body = req.body;
      const query = req.query;
      const teacher_no = req.user.teacher_no;
      const link_no = param(query, 'link_no');
      const title = param(body, 'title');
      const content = param(body, 'content');
      const start_datetime = param(body, 'start_datetime');
      const end_datetime = param(body, 'end_datetime');

      const [result] = await pool.query(
        `
            SELECT *
            FROM links
            WHERE no = ?
            AND teacher_no = ?
            AND enabled = 1;
            `,
        [link_no, teacher_no]
      );

      if (result.length < 1) throw error(`해당 link가 존재하지 않습니다.`);

      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();
        await connection.query(
          `
                INSERT INTO
                schedules(link_no, title, content, start_datetime, end_datetime)
                VALUE
                (?, ?, ?, ?, ?)
                `,
          [link_no, title, content, start_datetime, end_datetime]
        );
        await connection.commit();
        next({ message: `일정이 정상적으로 추가되었습니다.` });
      } catch (e) {
        await connection.rollback();
      } finally {
        connection.release();
      }
    } catch (e) {
      next(e);
    }
  },
  async editSchedule(req, res, next) {
    try {
      const body = req.body;
      const query = req.query;
      const teacher_no = req.user.teacher_no;
      const schedule_no = param(body, 'schedule_no');
      const link_no = param(query, 'link_no');
      const title = param(body, 'title');
      const content = param(body, 'content');
      const start_datetime = param(body, 'start_datetime');
      const end_datetime = param(body, 'end_datetime');

      const [result] = await pool.query(
        `
            SELECT *
            FROM links
            WHERE no = ?
            AND teacher_no = ?
            AND enabled = 1;
            `,
        [link_no, teacher_no]
      );

      if (result.length < 1) throw error(`해당 link가 존재하지 않습니다.`);

      const [result1] = await pool.query(
        `
            SELECT
            no, link_no, title, content, start_datetime, end_datetime, create_datetime, update_datetime, delete_datetime
            FROM schedules
            WHERE enabled = 1
            AND no = ?
            AND link_no = ?
            `,
        [schedule_no, link_no]
      );

      if (result1.length < 1) throw error(`해당 일정이 존재하지 않습니다.`);

      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();
        await connection.query(
          `
            UPDATE
            schedules
            SET
            title = ?,
            content = ?,
            start_datetime = ?,
            end_datetime = ?
            WHERE enabled = 1
            AND no = ?
            AND link_no = ?
            `,
          [title, content, start_datetime, end_datetime, schedule_no, link_no]
        );

        await connection.commit();
        next({ message: `일정이 정상적으로 수정되었습니다.` });
      } catch (e) {
        await connection.rollback();
      } finally {
        connection.release();
      }
    } catch (e) {
      next(e);
    }
  },

  async removeSchedule(req, res, next) {
    try {
      const teacher_no = req.user.teacher_no;
      const schedule_no = param(req.body, 'schedule_no');
      const link_no = param(req.query, 'link_no');

      const [result] = await pool.query(
        `
            SELECT *
            FROM links
            WHERE no = ?
            AND teacher_no = ?
            AND enabled = 1;
            `,
        [link_no, teacher_no]
      );

      if (result.length < 1) throw error(`해당 link가 존재하지 않습니다.`);

      const [result1] = await pool.query(
        `
            SELECT
            *
            FROM schedules
            WHERE enabled = 1
            AND no = ?
            AND link_no = ?
            `,
        [schedule_no, link_no]
      );

      if (result1.length < 1) throw error(`해당 일정이 존재하지 않습니다.`);

      const connection = await pool.getConnection((async) => async);
      try {
        await connection.beginTransaction();
        await connection.query(
          `
                UPDATE
                schedules
                SET
                delete_datetime = NOW(),
                enabled = 0
                WHERE no = ?
                AND link_no = ?
                `,
          [schedule_no, link_no]
        );
        next({ message: `일정이 정상적으로 삭제되었습니다.` });
      } catch (e) {
        await connection.rollback();
      } finally {
        connection.release();
      }
    } catch (e) {
      next(e);
    }
  },
};

module.exports = controller;
