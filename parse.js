var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'harshit.zehntech1998@gmail.com',
        pass: 'Rofa123@123'
    }
});

var mailOptions = {
    from: 'harshit.zehntech1998@gmail.com',
    to: 'patidarharshit228@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
