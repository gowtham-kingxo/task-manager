const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gowtham.gourov@gmail.com',
        subject: 'Thanks for joining TaskApp!',
        text: `Welcome to TaskApp, ${name}. Note all your tasks on the go...`
    }) 
}

const sendCancelationEmail = (email, name) => {
    console.log('to email', email)
    return sgMail.send({
        to: email,
        from: 'gowtham.gourov@gmail.com',
        subject: 'Your account removed successfully',
        text: `Hey ${name}, please let us know why you have deleted your account and we assure to rectify and provide 
               you with the best possible experience.
               
               Thank you!
               
               Best Wishes,
               Team TaskApp`
    }) 
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
