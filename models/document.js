const mongoose = require('mongoose')

const documentSchema = mongoose.Schema({
    name: {
        type:String,
        
    },
    branch: {
        type: Array,
        
    },
    branch_year: {
        type: Array,
        
    },
    year: {
        type: String,
        
    },
    session: {
        type: String,
        
    },
    
    type: {
        type: String,
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

module.exports = mongoose.model('Documents', documentSchema)