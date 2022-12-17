const mongoose = require('mongoose')

const CompetitiveExamSchema = mongoose.Schema({
    
    rollno: {
        type: String
    },
    exam: {
        type: String
    },
    percentile: {
        type: String
    },
    score: {
        type: String
    },
    rank: {
        type: String
    },
    date: {
        type: String
    },
    downloadLink: {
        type: String,
        required: true
    },
    viewLink: {
        type: String,
        required: true
    },
    driveId: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: String,
        required: true
    },
    views:{
        type:Number,
        default:0
    },
    dateAdded: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('CompetitiveExam', CompetitiveExamSchema)