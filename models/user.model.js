const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

let userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String, unique: true, lowercase: true
  },
  password: String,
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date
})

// userSchema.pre('save', function (next) {
//   // get access to the user model
//   const user = this

//   // generate salt
//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) { return next(err) }

//     // generate hash password
//     bcrypt.hash(user.password, salt, (err, hash) => {
//       if (err) { return next(err) }

//       user.password = hash
//       next()
//     })
//   })
// })

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password); // Return comparison of login password to password in database (true or false)
};

let User = mongoose.model('User', userSchema)

module.exports = User
