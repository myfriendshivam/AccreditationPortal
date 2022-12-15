const mongoose = require('mongoose')

const PlacementSchema = mongoose.Schema({
    
    rollno: {
        type: String
    },
    company: {
        type: String
    },
    package: {
        type: String
    },
    role: {
        type: String
    },
    joindate: {
        type: String
    },
    
    dateAdded: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Placement', PlacementSchema)