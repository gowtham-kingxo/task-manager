const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gowtham.gourov@gmail.com',
        subject: 'Thanks for joining TaskApp!',
        text: `Welcome to TaskApp, ${name}. Note all your tasks on the go...`
    }) 
}

module.exports = {
    sendWelcomeEmail
}
