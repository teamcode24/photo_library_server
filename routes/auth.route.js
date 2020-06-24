const authController = require('../controllers/auth.controller')
const validateToken = require('../middlewares/validateToken');
const passport = require('passport');
const router = require('express').Router();
  /* ==============
     Register Route
  ============== */
  router.post('/register', authController.register);

  /* ============================================================
     Route to check if user's email is available for registration
  ============================================================ */
  //router.get('/checkEmail/:email', authController.checkEmail);

  /* ===============================================================
     Route to check if user's username is available for registration
  =============================================================== */
  //router.get('/checkUsername/:username', authController.checkUsername);

 /* ===============================================================
   route will be used for token confirmation
  =============================================================== */
  router.post('/confirmation/:id', authController.confirmationUser);

 /* ===============================================================
   route will be used in case a user needs to resend a new confirmation token.
  =============================================================== */
  router.post('/resend', authController.resendTokenUser);


  /* ========
  LOGIN ROUTE
  ======== */
  // router.post('/login', authController.login);
//   router.post('/login', passport.authenticate('local', {failureRedirect:'/login'}, authController.login));
   router.post('/login', passport.authenticate('local'), authController.login);


    /* ===============================================================
   reset-password
  =============================================================== */
  router.post('/reset-password', authController.resetPassword);

      /* ===============================================================
      verify reset password
  =============================================================== */
  router.get('/lost-password/confirm/:token', authController.verifyResetPassword);

  /* ===============================================================
     Route to get user's profile data
  =============================================================== */
  router.get('/profile', validateToken, authController.profile);

  /* ===============================================================
     Route to get user's public profile data
  =============================================================== */
//   router.get('/publicProfile/:username', validateToken, authController.publicProfile);

   



module.exports = router;