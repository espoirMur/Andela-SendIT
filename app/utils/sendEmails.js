import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const orderRecieved = async (user, order) => {
  const mailBody = `
  <div style="color: #5a5a5a;">
    <div style="border-bottom: 1px solid #3359DF; padding: 15px;">
      <h2 style="color: #3359DF; text-align: center;">SendIT - Parcel Status Changed</h2>
    </div>
    <p style="font-size: 1.2rem; line-height: 2rem; color: #5a5a5a;">
      Dear ${user.name}, <br>
      Your order has been processed.
      Your tracking number ${order.TrackingNumber}
      You can view and pay your invoice from the link <a href="http://paypal.com">below</a> .
       After your payment, we will dispatch your order within one working day.
       Orders paid before 12 noon (CAT) will be dispatched the same day. Thank you!
    <p/>
    <p style="color: #5a5a5a !important;"
      Thank you, <br> Andela - SendIT Team
    </p>
  </div>
`;
  return transporter.sendMail({
    from: 'espoir.mur@gmail.com',
    to: user.email,
    subject: 'Send It Order Recieved',
    html: mailBody,
  });
};

const orderLocationChanged = async (user, order) => {
  const mailBody = `
      <div style="color: #5a5a5a;">
        <div style="border-bottom: 1px solid #3359DF; padding: 15px;">
          <h2 style="color: #3359DF; text-align: center;">SendIT - Parcel Status Changed</h2>
        </div>
        <p style="font-size: 1.2rem; line-height: 2rem; color: #5a5a5a;">
          Dear ${user.name}, <br>
          The current location of your parcel (${order.TrackingNumber}) 
          is at ${order.presentLocation}
        <p/>
        <p style="color: #5a5a5a !important;"
          Thank you, <br> Andela - SendIT Team
        </p>
      </div>
    `;
  return transporter.sendMail({
    from: 'espoir.mur@gmail.com',
    to: user.email,
    subject: 'Send It Location changed',
    html: mailBody,
  });
};

const oderDelivered = async (user, order) => {
  const mailBody = `
        <div style="color: #5a5a5a;">
          <div style="border-bottom: 1px solid #3359DF; padding: 15px;">
            <h2 style="color: #3359DF; text-align: center;">SendIT - Parcel Status Changed</h2>
          </div>
          <p style="font-size: 1.2rem; line-height: 2rem; color: #5a5a5a;">
            Dear ${user.name}, <br>
            The current location of your parcel (${order.TrackingNumber}) 
            has been delivered,
            Thanks for using our service
          <p/>
          <p style="color: #5a5a5a !important;"
            Thank you, <br> Andela - SendIT Team
          </p>
        </div>
      `;
  return transporter.sendMail({
    from: 'espoir.mur@gmail.com',
    to: user.email,
    subject: 'Send It Order Delivered',
    html: mailBody,
  });
};

const orderCanceled = async (user, order) => {
  const mailBody = `
          <div style="color: #5a5a5a;">
            <div style="border-bottom: 1px solid #3359DF; padding: 15px;">
              <h2 style="color: #3359DF; text-align: center;">SendIT - Parcel Status Changed</h2>
            </div>
            <p style="font-size: 1.2rem; line-height: 2rem; color: #5a5a5a;">
              Dear ${user.name}, <br>
              Your order with tarcking number ${order.TrackingNumber} 
              has been canceled
              Thanks for using our service
            <p/>
            <p style="color: #5a5a5a !important;"
            <br> Andela - SendIT Team
            </p>
          </div>
        `;
  return transporter.sendMail({
    from: 'espoir.mur@gmail.com',
    to: user.email,
    subject: 'Send It Location changed',
    html: mailBody,
  });
};

const orderStatusChanged = (user, order) => {
  const mailBody = `
            <div style="color: #5a5a5a;">
              <div style="border-bottom: 1px solid #3359DF; padding: 15px;">
                <h2 style="color: #3359DF; text-align: center;">SendIT - Parcel Status Changed</h2>
              </div>
              <p style="font-size: 1.2rem; line-height: 2rem; color: #5a5a5a;">
                Dear ${user.name}, <br>
                Your order with tarcking number ${order.TrackingNumber} 
                has changed the status to ${order.status}
                Thanks for using our service
              <p/>
              <p style="color: #5a5a5a !important;"
              <br> Andela - SendIT Team
              </p>
            </div>
          `;
  return transporter.sendMail({
    from: 'espoir.mur@gmail.com',
    to: user.email,
    subject: 'Send It Status Changed',
    html: mailBody,
  });
};
// eslint-disable-next-line import/prefer-default-export
export {
  orderRecieved,
  orderLocationChanged,
  oderDelivered,
  orderCanceled,
  orderStatusChanged,
};
