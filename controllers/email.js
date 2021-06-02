const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql;
const pool = mysql.createPool(dbconfig);
const { transporter } = require('../config/email');
const ejs = require('ejs');
const path = require('path');
var appDir = path.dirname(require.main.filename);

const controller = {
  async sendEmail(req, res) {
    try {
      const email = req.body.email;
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
        res.json({ message: '이미 존재하는 계정입니다.' });
      } else {
        const auth_num = Math.random().toString().substr(2, 6);
        let emailTemplete;
        ejs.renderFile(
          appDir + '/template/email.ejs',
          { authCode: auth_num },
          function (err, data) {
            if (err) {
              console.log(err);
            }
            emailTemplete = data;
          }
        );

        const mailOptions = {
          from: `GongHa`,
          to: req.body.email,
          subject: '[GongHa] 회원가입을 위한 인증번호입니다.',
          html: emailTemplete,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          }
          res.status(200).json({ auth_num });
          transporter.close();
        });
      }
    } catch (e) {
      console.log(e);
    }
  },
};

module.exports = controller;
