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
    // downloadLink: {
    //     type: Array,
    //     required: true
    // },

    // viewLink: {
    //     type: Array,
    //     required: true
    // },
    // driveId: {
    //     type: Array,
    //     required: true
    // },
    // uploadedBy: {
    //     type: Array,
    //     required: true
    // },
    // views:{
    //     type:Number,
    //     default:0
    // },
    dateAdded: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('CompetitiveExam', CompetitiveExamSchema)