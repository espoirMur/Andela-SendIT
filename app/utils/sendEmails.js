import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'espoir.mur@gmail.com', // email
    pass: '', // should be removed and never pushed to github
  },
});
// ask olivier about the best service to use for emails
const sendEmail = async (data) => {
  return transporter.sendMail(data);
};

// eslint-disable-next-line import/prefer-default-export
export { sendEmail };
