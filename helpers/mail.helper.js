const mailRegister = {
  mailFrom: 'delivery@unsplash.com',
  mailSender: 'Unsplash Team',
  mailRegisterSubject: 'Confirm your Unsplash Account',
  mailContent: (name, link) => {
    return `
            Hey ${name} <br>
            In order to get full access to Unsplash features, you need to confirm your email address by
            following the link below<br>
            <a href=${link}>Click here to confirm your account</a><br>
            Note: If you did not sign up for this account, you can ignore thi email and the account will be deleted 
            within 60 days<br>
            — Unsplash
        `;
  },
};

const mailChangeEmail = {
  mailFrom: 'delivery@unsplash.com',
  mailSender: 'Unsplash Team',
  mailRegisterSubject: 'Confirm your new email address',
  mailContent: (name, link) => {
    return `
            Hey ${name} <br>
            In order to update your Unsplash account email you need to confirm the new address by
            following the link below<br>
            <a href=${link}>Click here to confirm your new email</a><br>
            Your email address won't be updated until you access the link above<br>
            — Unsplash
        `;
  },
};

module.exports = {
  mailChangeEmail,
  mailRegister,
};
