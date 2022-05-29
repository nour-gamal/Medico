const nodemailer = require("nodemailer");

const getSelectedProperties = (originalObject, removedParameters, addedParameters) => {
    const targetObject = originalObject.toObject()

    //Remove data from object
    if (removedParameters) {
        removedParameters.map(params => {
            delete targetObject[params]
        })
    }
    if (addedParameters) {
        //Added data from object
        for (let index = 0; index < Object.keys(addedParameters).length; index++) {
            targetObject[Object.keys(addedParameters)[index]] = Object.values(addedParameters)[index]
        }

    }
    return targetObject;
}

async function sendEmail(subject, html, toEmail) {
    console.log(subject, html, toEmail)
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();
    // console.log(testAccount)
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 587,
        service: 'gmail',
        secure: false, // true for 465, false for other ports
        auth: {
            user: "na3463612@gmail.com", // generated ethereal user
            pass: "meshfr2a123", // generated ethereal password
        },
        // debug: true, // show debug output
        // logger: true // log information in console
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "na3463612@gmail.com", // sender address
        to: [toEmail], // list of receivers
        subject, // Subject line
        html, // html body
    });

    // console.log("Message sent: %s", info.accepted);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


module.exports = { getSelectedProperties, sendEmail }