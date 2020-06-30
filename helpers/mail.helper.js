const mailRegisterReply = "registration is successfully from helpers"
const mailFrom = "no-reply@yourdomain.com"

const mailRegisterSubject = 'Account Verification Token'

const mailResetPasswordSubject = 'Password Reset Request'

 const mailContent = (name, link) => {
    return `
        Hey ${name} <br>
        In order to update your Unsplash account email you need to confirm 
        the new address by following the link below.<br>
        <a href=${link}>Click here to confirm your new email</a><br>
        Your email address won't be updated until you access the link above.<br>
        — Unsplash
    `
 }

const mailRegister = {
    mailRegisterReply: "registration is successfully from helpers",
    mailFrom: "no-reply@yourdomain.com",
    mailRegisterSubject: 'Account Verification Token',
    mailResetPasswordSubject: 'Password Reset Request',
    mailContent: (name, link) => {
        return `
            Hey ${name} <br>
            In order to update your Unsplash account email you need to confirm 
            the new address by following the link below.<br>
            <a href=${link}>Click here to confirm your new email</a><br>
            Your email address won't be updated until you access the link above.<br>
            — Unsplash
        `
     }
}

module.exports = {
    mailRegisterReply,
    mailFrom,
    mailContent,
    mailRegisterSubject,
    mailResetPasswordSubject,
    mailRegister
}