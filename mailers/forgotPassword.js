const nodeMailer =  require('../config/nodemailer');

exports.sendOtp = (payLoad) => {
    console.log("send otp called");
    console.log()
    let html = nodeMailer.renderTamplet( {user:payLoad}, '/mailTemplets/forgotPassword.ejs');
    console.log("send otp called 2");
    nodeMailer.transporter.sendMail({
        from: 'akshaypamchal201318@gmail.com',
        to: 'akshay@daffodilsw.com',
        subject: 'Reset Password OTP',
        html: html
     },
        (err, info) => {
            if (err) {
                console.log('Error in sending email!', err);
                return;
            }
            console.log("Mail delevered", info);
        })
}
