const mongoose = require('mongoose')
const colors = require('colors')
const config = require('./config/config')
const fs = require('fs')
// Load models
const User = require('./models/user.model')
const Token = require('./models/token.model')
const Photo = require('./models/photo.model')
const Topic = require('./models/topic.model')
// Connect to DB

const images = JSON.parse(fs.readFileSync(`${__dirname}/data-fake/data-fake.json`, 'utf-8'))
const topics = JSON.parse(fs.readFileSync(`${__dirname}/data-fake/topic.json`, 'utf-8'))
const topics1 = JSON.parse(
  fs.readFileSync(`${__dirname}/data-fake/topic1.json`, 'utf-8')
);
const topics2 = JSON.parse(
    fs.readFileSync(`${__dirname}/data-fake/topic2.json`, 'utf-8')
  );
mongoose.connect(config.URI_MONGO, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

// mongoose.connect(config.MONGO_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
// })

// Import into DB
const importData = async () => {
    try {
        // await Image.create(images)
        await Topic.create(topics2)
        console.log('Data imported...'.green.inverse)
        process.exit()
    } catch (error) {
        console.error(error);
    }
}

// Delete data
const deleteData = async () => {
    try {
        // await User.deleteMany()
        // await Token.deleteMany()
        // await Image.deleteMany()
        await Topic.deleteMany()
        console.log('Data Destroyed...'.red.inverse)
        process.exit()
    } catch (error) {
        console.error(error);
    }
}

if (process.argv[2] === '-i') {
    importData()
} else if (process.argv[2] === '-d') {
    deleteData()
}