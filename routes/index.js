const express = require("express");
const router = express.Router();
const { ensureAuthenticated, authorizeRoles } = require("../config/checkAuth");
const Str = require("@supercharge/strings");
const fs = require("fs");
const { google } = require("googleapis");
const app = express();
const fileUpload = require("express-fileupload");
app.use(fileUpload());

//------------ User Model ------------//
const User = require("../models/User");
const Documents = require("../models/document.js");
const Subject = require("../models/Subject");
const Placement = require("../models/Placement");
const Internships = require("../models/Internship");
const Internship = require("../models/Internship");
const Learner = require("../models/Learner");

/*=============================================================================*/
// GOOGLE-DRIVE API STUFF

const REFRESH_TOKEN =
  "1//04DH4rR4USUusCgYIARAAGAQSNwF-L9IrJguFQcUzQwzNbpnxOCalKbazaKAJTs1qHcS6TXjyTQ7riZMDZIUvwC2H-V4a44u8zJ8";

const oauth2Client = new google.auth.OAuth2(
  (CLIENT_ID =
    "56043891589-r93pkb0t72iq70o44oqtjdcsp1sdoheq.apps.googleusercontent.com"),
  (CLIENT_SECRET = "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"),
  (REDIRECT_URI = "https://developers.google.com/oauthplayground")
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

//------------ Welcome Route ------------//
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/", (req, res) => {
  res.render("home");
});
router.get("/about", (req, res) => {
  res.render("about");
});
router.get("/contact_us", (req, res) => {
  res.render("contact_us");
});
router.get("/documents", (req, res) => {
  res.render("course_doc");
});

//---------- Internship data -------//
router.get("/internship_record", ensureAuthenticated, (req, res) => {
  res.render("internship", {
    rollno: req.user.rollno,
  });
});
//------- user profile page router-------//
router.get(
  "/User_profile",
  ensureAuthenticated,

  (req, res) =>
    res.render("User_profile", {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      branch: req.user.branch,
      phoneno: req.user.phoneno,
      address: req.user.address,
    })
);
//------- Teacher profile page router-------//
router.get(
  "/teacher_profile",
  ensureAuthenticated,

  (req, res) =>
    res.render("teacher_profile", {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      department: req.user.department,
      phoneno: req.user.phoneno,
      qualification: req.user.qualification,
      roa: req.user.roa,
    })
);
//------------ Dashboard Route ------------//
router.get(
  "/dashboard",
  ensureAuthenticated,
  authorizeRoles("user"),
  (req, res) =>
    res.render("dash", {
      name: req.user.name,
    })
);
router.get(
  "/dashboard1",
  ensureAuthenticated,
  authorizeRoles("admin"),
  (req, res) =>
    res.render("dash1", {
      name: req.user.name,
    })
);

router.get(
  "/dashboard2",
  ensureAuthenticated,
  authorizeRoles("teacher"),
  (req, res) =>
    res.render("dash3", {
      name: req.user.name,
    })
);

//----------------View all subject----------//
router.get("/admin_dashboard", function (req, res, next) {
  Subject.find({}, function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("admin_dash", { users: users });
      console.log(users);
    }
  });
});



/* GET SINGLE User BY ID */
router.get("/assign_sub_:id", ensureAuthenticated, function (req, res) {
  console.log(req.params.id);

  User.find({ department: req.user.department }, function (err, data) {
    if (err) {
      console.log(err);
    }

    Subject.findById(req.params.id, req.body, function (err, user) {
      console.log(user.sub_dept);

      User.find({ department: user.sub_dept }, function (err, datas) {
        console.log(user.sub_dept);
        if (err) {
          console.log(err);
        }
        User.find({ department: user.department }, function (err, datass) {
          if (err) {
            console.log(err);
          }
          if (err) {
            console.log(err);
          } else {
            console.log(user);

            res.render("assign_sub", {
              name: req.user.name,
              users: user,
              data: data,
              datas: datas,
              datass: datass,
            });
          }
        });
      });
    });
  });
});

/* UPDATE User */
router.post("/assign_sub_:id", ensureAuthenticated, function (req, res) {
  const {
    tea_name,
    tea_phoneno,
    alloted_branch,
    alloted_branch_year,
    alloted_session,
    alloted_sem,
    alloted_by,
  } = req.body;
  var assign = {
    tea_name,
    tea_phoneno,
    alloted_branch,
    alloted_branch_year,
    alloted_session,
    alloted_sem,
    alloted_by,
  };
  Subject.findByIdAndUpdate(
    req.params.id,
    { $push: { alloted_to: assign } },
    function (err) {
      if (err) {
        req.flash("error_msg", "Something went wrong!  could not updated.");
        console.log(err);
        res.redirect("" + req.params.id);
      } else {
        req.flash("success_msg", "subjects Assigned / Committed Successfully!");
        res.redirect("../admin_dashboard");
      }
    }
  );
});

router.get("/delete_assign_sub_:Id/:id", function (req, res) {
  console.log(req.params.id);
  console.log(req.params.Id);
  var _id = req.params.id;
  Subject.findByIdAndUpdate(
    req.params.Id,
    { $pull: { alloted_to: { _id: _id } } },
    function (err) {
      if (err) {
        req.flash("error_msg", "Assign Subject not deleted");
        res.redirect("../admin_dashboard");
      } else {
        req.flash("success_msg", "Assiged Subject Deleted");
        res.redirect("../admin_dashboard");
      }
    }
  );
});

router.get("/delete_assign_sub_:id", function (req, res) {
  Subject.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash("error_msg", "Something went wrong ! , Subject not deleted");
      res.redirect("../admin_dashboard");
    } else {
      req.flash("success_msg", "Subject Deleted");
      res.redirect("../admin_dashboard");
    }
  });
});

/*===================================================================*/
// All middlewares lie here

async function getInternship(req, res, next) {
  let internship;
  try {
    internship = await Internships.findById(req.params.id);
    if (internship == null)
      return res.status(404).json({ message: "Cannot find Document" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.internship = internship;
  next();
}

/*===================================================================*/
// All middlewares lie here
async function getDocument(req, res, next) {
  let document;
  try {
    document = await Documents.findById(req.params.id);
    if (document == null)
      return res.status(404).json({ message: "Cannot find Document" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.document = document;
  next();
}
async function uploadFileToDrive(filePath, newName) {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: newName,
        mimeType: "application/pdf",
      },
      media: {
        mimeType: "application/pdf",
        body: fs.createReadStream(filePath),
      },
    });
    return response.data.id;
  } catch (error) {
    console.log("we failed while uploading " + error.message);
  }
}
async function getFileLink(id) {
  try {
    await drive.permissions.create({
      fileId: id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: id,
      fields: "webViewLink, webContentLink",
    });
    return result.data;
  } catch (err) {
    console.log(err.message);
  }
}
async function deleteFileFromDrive(id) {
  try {
    const response = drive.files.delete({
      fileId: id,
    });
    // console.log(response.data, response.status)
  } catch (error) {
    console.log(error.message);
  }
}

/*==============================Upload file router=====================================*/
router.post("/documents", async (req, res) => {
  if (res.files === null)
    return res.status(400).json({ msg: "No file uploaded" });
  const file = req.files.file;
  const newName = Str.random(8) + file.name;
  file.mv(`${__dirname}/../public/uploads/${newName}`, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    const filePath = `${__dirname}/../public/uploads/${newName}`;
    // upload file
    const id = await uploadFileToDrive(filePath, file.name);
    // get its link
    const link = await getFileLink(id);
    fs.unlink(`${__dirname}/../public/uploads/${newName}`, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      let documentData;
      try {
        documentData = new Documents({
          name: req.body.name,
          branch: req.body.branch,
          branch_year: req.body.branch_year,
          year: req.body.year,
          session: req.body.session,
          type: req.body.type,
          fileName: newName,
          downloadLink: link.webContentLink,
          viewLink: link.webViewLink,
          driveId: id,
          uploadedBy: req.user.name,
        });
        const newDoc = await documentData.save();
        // console.log(newDoc)
        req.flash("success_msg", "Uploaded Successfully!");
        res.redirect("../view_timetable");
      } catch (err) {
        console.log(err.message);
      }
    });
  });
});

// ------ Internship data-----//
router.post("/internship_record", async (req, res) => {
  if (res.files === null)
    return res.status(400).json({ msg: "No file uploaded" });
  const file = req.files.file;
  const newName = Str.random(8) + file.name;
  file.mv(`${__dirname}/../public/uploads/${newName}`, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    const filePath = `${__dirname}/../public/uploads/${newName}`;

    // upload file
    const id = await uploadFileToDrive(filePath, file.name);

    // get its link
    const link = await getFileLink(id);

    fs.unlink(`${__dirname}/../public/uploads/${newName}`, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      let documentData;
      try {
        documentData = new Internships({
          rollno: req.body.rollno,
          company: req.body.company,
          stipand: req.body.stipand,
          role: req.body.role,
          project: req.body.project,
          startdate: req.body.startdate,
          enddate: req.body.enddate,
          fileName: newName,
          downloadLink: link.webContentLink,
          viewLink: link.webViewLink,
          driveId: id,
          uploadedBy: req.user.name,
        });
        const newDoc = await documentData.save();
        // console.log(newDoc)
        req.flash("success_msg", "Uploaded Successfully!");
        res.redirect("../view_internship");
      } catch (err) {
        console.log(err.message);
      }
    });
  });
});

//----------------View all Timetabe----------//
router.get("/view_timetable", function (req, res, next) {
  Documents.find({ type: "TIMETABLE" }, function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("view_timetable", { users: users });
      console.log(users);
    }
  });
});

//----------------View all Syllabus----------//
router.get("/view_syllabus", function (req, res, next) {
  Documents.find({ type: "SYLLABUS" }, function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("view_syllabus", { users: users });
      console.log(users);
    }
  });
});
//----------------View all POCO----------//
router.get("/view_poco", function (req, res, next) {
  Documents.find({ type: "POCO" }, function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("view_poco", { users: users });
      console.log(users);
    }
  });
});
//----------------View all Mid sem paper----------//
router.get("/view_mid", function (req, res, next) {
  Documents.find({ type: "MIDSEM" }, function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("view_mid", { users: users });
      console.log(users);
    }
  });
});
//----------------View all End sem paper----------//
router.get("/view_end", function (req, res, next) {
  Documents.find({ type: "ENDSEM" }, function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("view_end", { users: users });
      console.log(users);
    }
  });
});
//----------------View all Assignment----------//
router.get("/view_assignment", function (req, res, next) {
  Documents.find({ type: "ASSIGNMENT" }, function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("view_assignment", { users: users });
      console.log(users);
    }
  });
});

//----------------View all Students----------//
router.get("/view_all_students", function (req, res, next) {
  User.find({ role: "user" }, function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("view_all_students", { users: users });
      console.log(users);
    }
  });
});

//----------------View all Teachers----------//
router.get("/view_all_teacher", function (req, res, next) {
  User.find({ role: "teacher" }, function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("view_all_teacher", { users: users });
      console.log(users);
    }
  });
});

//----------------View data collection for placement----------//

router.get("/view_data_collection", function (req, res, next) {
  User.aggregate([
    {
      $lookup: {
        from: "placements",
        localField: "rollno",
        foreignField: "rollno",
        as: "placement_info",
      },
    },
    {
      $unwind: "$placement_info",
    },
  ])
    .then((users) => {
      res.render("view_data_collection", { users: users });
      console.log(users);
    })
    .catch((error) => {
      console.log(error);
    });
});

//----------------View data collection for Internship----------//
router.get("/view_internship", function (req, res, next) {
  User.aggregate([
    {
      $lookup: {
        from: "internships",
        localField: "rollno",
        foreignField: "rollno",
        as: "internship_info",
      },
    },
    {
      $unwind: "$internship_info",
    },
  ])
    .then((users) => {
      res.render("view_internship", { users: users });
      console.log(users);
    })
    .catch((error) => {
      console.log(error);
    });
});

//----------------View data collection for Alumni----------//
router.get("/view_alumni", function (req, res, next) {
  User.aggregate([
    {
      $lookup: {
        from: "placements",
        localField: "rollno",
        foreignField: "rollno",
        as: "alumni_info",
      },
    },
    {
      $unwind: "$alumni_info",
    },
  ])
    .then((users) => {
      res.render("view_alumni", { users: users });
      console.log(users);
    })
    .catch((error) => {
      console.log(error);
    });
});

//----------------View slow  learner ----------//
router.get("/view_slowlearner", function (req, res, next) {
  User.aggregate([
    {
      $lookup: {
        from: "learners",
        localField: "rollno",
        foreignField: "rollno",
        as: "learner_info",
      },
    },
    {
      $unwind: "$learner_info",
    },
    {
      $match: { "learner_info.type": "Slow Learner" },
    },
  ])
    .then((users) => {
      res.render("view_slowlearner", { users: users });
      console.log(users);
    })
    .catch((error) => {
      console.log(error);
    });
});
//----------------View  fast learner ----------//
router.get("/view_fastlearner", function (req, res, next) {
  User.aggregate([
    {
      $lookup: {
        from: "learners",
        localField: "rollno",
        foreignField: "rollno",
        as: "flearner_info",
      },
    },
    {
      $unwind: "$flearner_info",
    },
    {
      $match: { "flearner_info.type": "Fast Learner" },
    },
  ])
    .then((users) => {
      res.render("view_fastlearner", { users: users });
      console.log(users);
    })
    .catch((error) => {
      console.log(error);
    });
});

// ========================================================================================================================

// All delete routes lie here
//  Timetable

router.get("/delete_timetable_:id", getDocument, async (req, res) => {
  const {
    id,
    name,
    branch,
    branch_year,
    year,
    session,
    type,
    viewLink,
    downloadLink,
    dateAdded,
    url,
    driveId,
    uploadedBy,
    views,
  } = res.document;

  deleteFileFromDrive(driveId);

  try {
    await res.document.remove();
    req.flash("success_msg", "Deleted Successfully!");
    res.redirect("../view_timetable");
  } catch (err) {}
});

// View Syllabus

router.get("/delete_syllabus_:id", getDocument, async (req, res) => {
  const {
    id,
    name,
    branch,
    branch_year,
    year,
    session,
    type,
    viewLink,
    downloadLink,
    dateAdded,
    url,
    driveId,
    uploadedBy,
    views,
  } = res.document;

  deleteFileFromDrive(driveId);

  try {
    await res.document.remove();
    req.flash("success_msg", "Deleted Successfully!");
    res.redirect("../view_syllabus");
  } catch (err) {}
});
// View POCO

router.get("/delete_poco_:id", getDocument, async (req, res) => {
  const {
    id,
    name,
    branch,
    branch_year,
    year,
    session,
    type,
    viewLink,
    downloadLink,
    dateAdded,
    url,
    driveId,
    uploadedBy,
    views,
  } = res.document;

  deleteFileFromDrive(driveId);

  try {
    await res.document.remove();
    req.flash("success_msg", "Deleted Successfully!");
    res.redirect("../view_poco");
  } catch (err) {}
});
// View syllabus

router.get("/delete_mid_:id", getDocument, async (req, res) => {
  const {
    id,
    name,
    branch,
    branch_year,
    year,
    session,
    type,
    viewLink,
    downloadLink,
    dateAdded,
    url,
    driveId,
    uploadedBy,
    views,
  } = res.document;

  deleteFileFromDrive(driveId);

  try {
    await res.document.remove();
    req.flash("success_msg", "Deleted Successfully!");
    res.redirect("../view_mid");
  } catch (err) {}
});
// View syllabus

router.get("/delete_end_:id", getDocument, async (req, res) => {
  const {
    id,
    name,
    branch,
    branch_year,
    year,
    session,
    type,
    viewLink,
    downloadLink,
    dateAdded,
    url,
    driveId,
    uploadedBy,
    views,
  } = res.document;

  deleteFileFromDrive(driveId);

  try {
    await res.document.remove();
    req.flash("success_msg", "Deleted Successfully!");
    res.redirect("../view_end");
  } catch (err) {}
});
// View syllabus

router.get("/delete_assignment_:id", getDocument, async (req, res) => {
  const {
    id,
    name,
    branch,
    branch_year,
    year,
    session,
    type,
    viewLink,
    downloadLink,
    dateAdded,
    url,
    driveId,
    uploadedBy,
    views,
  } = res.document;

  deleteFileFromDrive(driveId);

  try {
    await res.document.remove();
    req.flash("success_msg", "Deleted Successfully!");
    res.redirect("../view_assignment");
  } catch (err) {}
});

//   delete collection of placement data
router.get("/delete_data_:id", function (req, res) {
  Placement.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash("error_msg", "Something went wrong ! , data not deleted");
      res.redirect("../view_data_collection");
    } else {
      req.flash("success_msg", "Data Deleted");
      res.redirect("../view_data_collection");
    }
  });
});

//  delete collection of Internship data
router.get("/delete_internship_:id", getInternship, async (req, res) => {
  const {
    id,
    rollno,
    company,
    stipand,
    role,
    project,
    startdate,
    enddate,
    viewLink,
    downloadLink,
    dateAdded,
    url,
    driveId,
    uploadedBy,
    views,
  } = res.internship;

  deleteFileFromDrive(driveId);

  try {
    await res.internship.remove();
    req.flash("success_msg", "Deleted Successfully!");
    res.redirect("../view_internship");
  } catch (err) {}
});

//   delete Students register data
router.get("/delete_student_:id", function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash("error_msg", "Something went wrong ! , data not deleted");
      res.redirect("../view_all_students");
    } else {
      req.flash("success_msg", "Data Deleted");
      res.redirect("../view_all_students");
    }
  });
});
//   delete teachers register data
router.get("/delete_teacher_:id", function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash("error_msg", "Something went wrong ! , data not deleted");
      res.redirect("../view_all_teacher");
    } else {
      req.flash("success_msg", "Data Deleted");
      res.redirect("../view_all_teacher");
    }
  });
});

//   delete for slow learner data
router.get("/delete_slow_:id", function (req, res) {
  Learner.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash("error_msg", "Something went wrong ! , data not deleted");
      res.redirect("../view_slowlearner");
    } else {
      req.flash("success_msg", "Data Deleted");
      res.redirect("../view_slowlearner");
    }
  });
});
//  delete for fast learner data
router.get("/delete_fast_:id", function (req, res) {
  Learner.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash("error_msg", "Something went wrong ! , data not deleted");
      res.redirect("../view_fastlearner");
    } else {
      req.flash("success_msg", "Data Deleted");
      res.redirect("../view_fastlearner");
    }
  });
});

/* UPDATE collection of placement data */
router.get("/update_data_:id", function (req, res) {
  console.log(req.params.id);
  Placement.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);

      res.render("edit_collection_data", { users: user });
    }
  });
});
router.post("/update_data_:id", function (req, res) {
  Placement.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if (err) {
      req.flash("error_msg", "Something went wrong! User could not updated.");
      console.log(err);
      res.redirect("" + req.params.id);
    } else {
      req.flash("success_msg", "Updated Successfully!");
      res.redirect("../view_data_collection");
    }
  });
});

/* UPDATE collection of Internship data */
router.get("/update_internship_:id", function (req, res) {
  console.log(req.params.id);
  Internship.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);

      res.render("edit_internship", { users: user });
    }
  });
});
router.post("/update_internship_:id", function (req, res) {
  Internship.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if (err) {
      req.flash("error_msg", "Something went wrong! User could not updated.");
      console.log(err);
      res.redirect("" + req.params.id);
    } else {
      req.flash("success_msg", "Updated Successfully!");
      res.redirect("../view_internship");
    }
  });
});

/* UPDATE user profile page data */
router.get("/edit_user_profile_:id", function (req, res) {
  console.log(req.params.id);
  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);

      res.render("edit_user_profile", { users: user });
    }
  });
});

/* UPDATE Students register data */
router.get("/update_student_:id", function (req, res) {
  console.log(req.params.id);
  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);

      res.render("edit_register", { users: user });
    }
  });
});
router.post("/update_student_:id", function (req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if (err) {
      req.flash("error_msg", "Something went wrong! User could not updated.");
      console.log(err);
      res.redirect("" + req.params.id);
    } else {
      req.flash("success_msg", "Updated Successfully!");
      res.redirect("../view_all_students");
    }
  });
});

/* UPDATE teachers register data */
router.get("/update_teacher_:id", function (req, res) {
  console.log(req.params.id);
  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);

      res.render("edit_teacher_register", { users: user });
    }
  });
});
router.post("/update_teacher_:id", function (req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if (err) {
      req.flash("error_msg", "Something went wrong! User could not updated.");
      console.log(err);
      res.redirect("" + req.params.id);
    } else {
      req.flash("success_msg", "Updated Successfully!");
      res.redirect("../view_all_teacher");
    }
  });
});

/* UPDATE slow learner data */
router.get("/update_slow_:id", function (req, res) {
  console.log(req.params.id);
  Learner.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);

      res.render("edit_slowlearner", { users: user });
    }
  });
});
router.post("/update_slow_:id", function (req, res) {
  Learner.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if (err) {
      req.flash("error_msg", "Something went wrong! User could not updated.");
      console.log(err);
      res.redirect("" + req.params.id);
    } else {
      req.flash("success_msg", "Updated Successfully!");
      res.redirect("../view_slowlearner");
    }
  });
});

/* UPDATE fast learner data */
router.get("/update_fast_:id", function (req, res) {
  console.log(req.params.id);
  Learner.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);

      res.render("edit_fastlearner", { users: user });
    }
  });
});
router.post("/update_fast_:id", function (req, res) {
  Learner.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if (err) {
      req.flash("error_msg", "Something went wrong! User could not updated.");
      console.log(err);
      res.redirect("" + req.params.id);
    } else {
      req.flash("success_msg", "Updated Successfully!");
      res.redirect("../view_fastlearner");
    }
  });
});


//---------- Placement data -------//
router.get("/placement_record", ensureAuthenticated, (req, res) =>
  res.render("data_collection", {
    rollno: req.user.rollno,
  })
);

//---- slow and fast----//
router.get("/student_learner", ensureAuthenticated, (req, res) =>
  res.render("learner", {
    rollno: req.user.rollno,
  })
);

//--------- view all subject for users------//
router.get("/user_admin_dashboard", function (req, res, next) {
  Subject.find({}, function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("user_admin_dash", { users: users });
      console.log(users);
    }
  });
});

module.exports = router;
