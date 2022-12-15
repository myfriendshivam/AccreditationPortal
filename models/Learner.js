const mongoose = require('mongoose')

const LearnerSchema = mongoose.Schema({
    
    rollno: {
        type: String
    },
    type: {
        type: String
    },
    sessions: {
        type: String
    },
    class: {
        type: String
    },
    topic: {
        type: String
    },
    date: {
        type: String
    },
    
    dateAdded: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Learner', LearnerSchema)