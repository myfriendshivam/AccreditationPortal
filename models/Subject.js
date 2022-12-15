const mongoose = require('mongoose');

//------------ User Schema ------------//
const SubjectSchema = new mongoose.Schema({
  sub_code: {
    type: String,
    required: true
  },
  sub_name: {
    type: String,
    required: true
  },
  sub_dept: {
    type: String,
    required: true                                                                                          
    
  },
  semester: {
    type: String,
    required: true                                                                                          
    
  },

  alloted_to:[{
    
    tea_name:{
        type: String, 
    },
    tea_phoneno:{
      type: String, 
  },
    alloted_branch:{
        type:String
    },
    alloted_branch_year:{
      type:String
  },
    alloted_sem: {
        type: String,
        
    },
      alloted_session: {
        type: String,
    },
    alloted_by:{
        type:String,
        ref:"User"
      }
    
  }],
  added_by:{
    type:String,
    ref:"User"

  }
}, { timestamps: true });


const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = Subject; 
