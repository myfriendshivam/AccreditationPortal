const mongoose = require('mongoose')

const InternshipSchema = mongoose.Schema({
    
    
    rollno: {
        type: String
    },
    company: {
        type: String
    },
    stipand: {
        type: String
    },
    role: {
        type: String
    },
    project: {
        type: String
    },
    startdate: {
        type: String
    },
    enddate: {
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

module.exports = mongoose.model('Internship', InternshipSchema)