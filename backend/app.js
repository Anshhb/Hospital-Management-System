var createError = require('http-errors');
var express = require('express');
var path = require('path');
//Logger that was used for debugging, commented later
// var logger = require('morgan');
var mysql = require('mysql2');
var cors = require('cors');
var port = 3001
var fs = require('fs');
const { exec } = require('child_process');
// "start": "nodemon ./bin/www"
//Connection Info
var con = mysql.createConnection({
  host: 'localhost',
  user: 'fnf',
  password: 'Mysql',
  database: 'Project',
  multipleStatements: true
});

//Connecting To Database
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL");
});

//Variables to keep state info about who is logged in
var email_in_use = "";
var password_in_use = "";
var who = "";
var name_in_use="";

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

//Signup, Login, Password Reset Related Queries

//Checks if patient exists in database
app.get('/checkIfPatientExists', (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM Patient WHERE email = "${email}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

// Required to handle file uploads
const multer = require('multer'); //npm install multer
const { copyFileSync } = require('fs');
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory as Buffer
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Making User Account
console.log("Line 64");
app.get('/makeAccount', upload.single('PreviousDocuments'),(req, res) => {
  let query = req.query;
  let name = query.name + " " + query.lastname;
  let email = query.email;
  let password = query.password;
  let address = query.address;
  let gender = query.gender;
  let medications = query.medications || "none";
  let conditions = query.conditions || "none";
  let surgeries = query.surgeries || "none";
  let previousDocuments = req.file ? req.file.buffer : null; // BLOB data
  console.log("Reached line 75");
  console.log(req.query)
  console.log(query)
  console.log(email)
  // Validation
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  console.log("Reached line 80");
  if (gender !== 'Male' && gender !== 'Female') {
    return res.status(400).json({ error: 'Invalid gender value, must be "M" or "F"' });
  }

  console.log("Reached line 85");
  // Begin transaction
  con.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ error: 'Transaction error' });
    }

    // Insert into Patient table
    let patientQuery = `INSERT INTO Patient (email, password, name, address, gender) 
                        VALUES (?, ?, ?, ?, ?)`;
    con.query(patientQuery, [email, password, name, address, gender], (error, results) => {
      if (error) {
        return con.rollback(() => {
          res.status(500).json({ error: 'Database error during Patient insert' });
        });
      }
      console.log("Reached line 105");
      // Fetch the last MedicalHistory id to generate a new id
      let idQuery = 'SELECT id FROM MedicalHistory ORDER BY id DESC LIMIT 1;';
      con.query(idQuery, (error, results) => {
        if (error) {
          return con.rollback(() => {
            res.status(500).json({ error: 'Database error during MedicalHistory ID fetch' });
          });
        }

        console.log("Reached line 115");
        console.log(results);
        let generated_id = results.length ? results[0].id + 1 : 1;
        console.log(generated_id);
        // Insert into MedicalHistory table with PreviousDocuments BLOB
        let historyQuery = `INSERT INTO MedicalHistory (id, date, conditions, surgeries, medication, PreviousDocuments) 
                            VALUES (?, CURDATE(), ?, ?, ?, ?)`;
        console.log("Reached line 122");
        con.query(historyQuery, [generated_id, conditions, surgeries, medications, previousDocuments], (error, results) => {
          if (error) {
            console.log(error);
            return con.rollback(() => {
              res.status(500).json({ error: 'Database error during MedicalHistory insert' });
            });
          }
          console.log("Reached line 127");
          // Insert into PatientsFillHistory junction table
          let junctionQuery = `INSERT INTO PatientsFillHistory (patient, history) 
                               VALUES (?, ?)`;
          con.query(junctionQuery, [email, generated_id], (error, results) => {
            if (error) {
              return con.rollback(() => {
                res.status(500).json({ error: 'Database error during PatientsFillHistory insert' });
              });
            }

            // Commit transaction if all inserts succeed
            con.commit(err => {
              if (err) {
                return con.rollback(() => {
                  console.log("Account creation failed");
                  res.status(500).json({ message:"Account creation failed",error: 'Error committing transaction' });
                });
              }
              email_in_use = email;
              password_in_use = password;
              name_in_use=name;
              who = "pat";
              res.json({ message: 'Account created successfully', data: results });
            });
          });
        });
      });
    });
  });
});


//Checks If Doctor Exists
app.get('/checkIfDocExists', (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM Doctor WHERE email = "${email}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});


app.post('/resetPasswordDoctor', (req, res) => {
  let something = req.query;
  let email = something.email;
  let oldPassword = "" + something.oldPassword;
  let newPassword = "" + something.newPassword;

  if (newPassword.length < 8 || !/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one uppercase letter.' });
  }

  console.log(something.oldPassword);
  console.log(something.newPassword);

  // Set the isolation level before starting the transaction
  con.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;', err => {
      if (err) {
          return res.status(500).json({ error: 'Error setting isolation level' });
      }

      // Begin the transaction
      con.beginTransaction(err => {
          if (err) {
              return res.status(500).json({ error: 'Transaction error' });
          }

          // Prepare SQL statement
          let statement = `UPDATE Doctor SET password = ? WHERE email = ? AND password = ?;`;
          con.query(statement, [newPassword, email, oldPassword], (error, results) => {
              if (error) {
                  return con.rollback(() => {
                      res.status(500).json({ error: 'Database error during password reset' });
                  });
              }

              con.commit(err => {
                  if (err) {
                      return con.rollback(() => {
                          res.status(500).json({ error: 'Error committing transaction' });
                      });
                  }
                  return res.json({ message: 'Password reset successfully', data: results });
              });
          });
      });
  });
});



app.post('/resetPasswordPatient', (req, res) => {
  let something = req.query;
  let email = something.email;
  let oldPassword = "" + something.oldPassword;
  let newPassword = "" + something.newPassword;

  console.log(something.oldPassword);
  console.log(something.newPassword);

  if (newPassword.length < 8 || !/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one uppercase letter.' });
  }

  // Set isolation level before starting the transaction
  con.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;', err => {
      if (err) {
          return res.status(500).json({ error: 'Error setting isolation level' });
      }

      // Begin the transaction
      con.beginTransaction(err => {
          if (err) {
              return res.status(500).json({ error: 'Transaction error' });
          }

          // Prepare SQL statement
          let statement = `UPDATE Patient SET password = ? WHERE email = ? AND password = ?;`;
          con.query(statement, [newPassword, email, oldPassword], (error, results) => {
              if (error) {
                  return con.rollback(() => {
                      res.status(500).json({ error: 'Database error during password reset' });
                  });
              }

              con.commit(err => {
                  if (err) {
                      return con.rollback(() => {
                          res.status(500).json({ error: 'Error committing transaction' });
                      });
                  }
                  return res.json({ message: 'Password reset successfully', data: results });
              });
          });
      });
  });
});
app.post('/makeDocAccount', upload.fields([{ name: 'degrees' }, { name: 'cover_letter' }]), (req, res) => {
  let params1 = req.body;
  let name2 = params1.name +params1.lastname;
  let email = params1.email;
  let password = params1.password;
  let gender = params1.gender;
  let schedule = params1.schedule;
  let degrees = req.files['degrees'] ? req.files['degrees'][0].buffer : null;
  let coverLetter = req.files['cover_letter'] ? req.files['cover_letter'][0].buffer : null;
  console.log(name2,degrees);
  // Validation
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (gender !== 'Male' && gender !== 'Female') {
    return res.status(400).json({ error: 'Invalid gender value, must be "Male" or "Female"' });
  }
  console.log("Reached Line 327")
  // Set transaction isolation level and insert data
  con.query('SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;', err => {
    if (err) {
      console.error('Error setting isolation level:', err);
      return res.status(500).json({ error: 'Error setting transaction isolation level' });
    }

    con.beginTransaction(err => {
      if (err) {
        return res.status(500).json({ error: 'Transaction error' });
      }

      // Insert into Doctor table
      let doctorQuery = `INSERT INTO Doctor (email, gender, password, name, degrees, cover_letter) 
                         VALUES (?, ?, ?, ?, ?, ?)`;
      con.query(doctorQuery, [email, gender, password, name2, degrees, coverLetter], (error, results) => {
        if (error) {
          console.log(error.message)
          return con.rollback(() => {
            res.status(500).json({ error: 'Database error during Doctor insert' });
          });
        }
        console.log("Results", results)
        // Insert into DocsHaveSchedules table
        let scheduleQuery = `INSERT INTO DocsHaveSchedules (sched, doctor) VALUES (?, ?)`;
        con.query(scheduleQuery, [schedule, email], (error, results) => {
          if (error) {
            return con.rollback(() => {
              res.status(500).json({ error: 'Database error during DocsHaveSchedules insert' });
            });
          }
          console.log("Before Commiting")
          // Commit transaction
          con.commit(err => {
            if (err) {
              return con.rollback(() => {
                res.status(500).json({ error: 'Error committing transaction' });
              });
            }
            res.json({ message: 'Doctor account created successfully' });
          });
        });
      });
    });
  });
});



//Checks if patient is logged in
app.get('/checklogin', (req, res) => {
  let params = req.query;
  let email = params.email;
  let password = params.password;
  let sql_statement = `SELECT * FROM Patient 
                       WHERE email="${email}" 
                       AND password="${password}"`;
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) {
      console.log("error");
      return res.status(500).json({ failed: 'error ocurred' })
    }
    else {
      {console.log(results)};
      if (results.length === 0) {
      } else {
        var string = JSON.stringify(results);
        // console.log(string);
        var json = JSON.parse(string);
        // console.log(json);
        email_in_use = email;
        password_in_use = password;
        name_in_use = json[0].name;
        who = "pat";
      }
      return res.json({
        data: results
      })
    };
  });
});

//Checks if doctor is logged in
app.get('/checkDoclogin', (req, res) => {
  let params = req.query;
  let email = params.email;
  let password = params.password;
  let sql_statement = `SELECT * 
                       FROM Doctor
                       WHERE email="${email}" AND password="${password}"`;
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) {
      console.log("eror");
      return res.status(500).json({ failed: 'error ocurred' })
    }
    else {
      if (results.length === 0) {
      } else {
        var string = JSON.stringify(results);
        var json = JSON.parse(string);
        console.log(json);
        email_in_use = json[0].email;
        password_in_use = json[0].password;
        name_in_use = json[0].name;
        who="doc";
        console.log(email_in_use);
        console.log(password_in_use);
      }
      return res.json({
        data: results
      })
    };
  });
});

//Return degrees and cover letter for a doctor
app.get('/seeDocs', (req, res) => {
  // const email = req.params.email;
  const email=email_in_use;
  console.log("email in seeDocs", email);
  // console.log(req)
  // console.log(req.params)
  // // Query to retrieve the degrees and cover letter for the specified email
  const query = `SELECT degrees, cover_letter FROM Doctor WHERE email = ?`;

  con.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error retrieving files:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No files found for the specified email' });
    }

    const degrees = results[0].degrees;
    const coverLetter = results[0].cover_letter;

    // Return files as a JSON response with base64 encoding
    res.json({
      degrees: degrees ? degrees.toString('base64') : null,
      coverLetter: coverLetter ? coverLetter.toString('base64') : null,
    });
  });
});



//Returns Who is Logged in
app.get('/userInSession', (req, res) => {
  return res.json({ email: `${email_in_use}`, who:`${who}`,name:`${name_in_use}`});
});

//Logs the person out
app.get('/endSession', (req, res) => {
  console.log("Ending session");
  email_in_use = "";
  password_in_use = "";
  name_in_use = "";
});

//Appointment Related

//Checks If a similar appointment exists to avoid a clash
app.get('/checkIfApptExists', (req, res) => {
  let cond1, cond2, cond3 = ""
  let params = req.query;
  let email = params.email;
  let doc_email = params.docEmail;
  let startTime = params.startTime;
  let date = params.date;
  let ndate = new Date(date).toLocaleDateString().substring(0, 10)
  let sql_date = `STR_TO_DATE('${ndate}', '%m/%d/%Y')`;
  console.log("Reached 369");
  //sql to turn string to sql time obj
  let sql_start = `CONVERT('${startTime}', TIME)`;
  let statement = `SELECT * FROM PatientsAttendAppointments, Appointment  
  WHERE patient = "${email}" AND
  appt = id AND
  date = ${sql_date} AND
  starttime = ${sql_start}`
  // console.log(statement)
  console.log("Reached 378");
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      cond1 = results;
      console.log("Reached 383");
      console.log(cond1);
      statement=`SELECT * FROM Diagnose d INNER JOIN Appointment a 
      ON d.appt=a.id WHERE doctor="${doc_email}" AND date=${sql_date} AND status="NotDone" 
      AND ${sql_start} >= starttime AND ${sql_start} < endtime`
      console.log(statement)
      con.query(statement, function (error, results, fields) {
        if (error) throw error;
        else {
          cond2 = results;
          console.log("Reached cond2");
          console.log(cond2);
          statement = `SELECT doctor, starttime, endtime, breaktime, day FROM DocsHaveSchedules 
          INNER JOIN Schedule ON DocsHaveSchedules.sched=Schedule.id
          WHERE doctor="${doc_email}" AND 
          day=DAYNAME(${sql_date}) AND 
          (DATE_ADD(${sql_start},INTERVAL +1 HOUR) <= breaktime OR ${sql_start} >= DATE_ADD(breaktime,INTERVAL +1 HOUR));`
          //not in doctor schedule
          console.log(statement)
          con.query(statement, function (error, results, fields) {
            if (error) throw error;
            else {
              console.log("Results are : " + results);
              console.log(results.length);
              if(results.length){
                results = []
              }
              else{
                results = [1]
              }
              console.log(
             cond1.concat(cond2,results)
              )
              return res.json({
                data: cond1.concat(cond2,results)
              })
            };
          });
        };
      });
    };
  });
  //doctor has appointment at the same time - Your start time has to be greater than all prev end times
});

//Returns Date/Time of Appointment
app.get('/getDateTimeOfAppt', (req, res) => {
  let tmp = req.query;
  let id = tmp.id;
  let statement = `SELECT starttime as start, 
                          endtime as end, 
                          date as theDate 
                   FROM Appointment 
                   WHERE id = "${id}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      console.log(JSON.stringify(results));
      return res.json({
        data: results
      })
    };
  });
});

//Patient Info Related
app.post('/submitQuestion', async(req, res) => {
  const data = req.body.content;  // Get the content from the request
  console.log("Received data:", data);
  

  try {
    // Step 1: Write file
    await new Promise((resolve, reject) => {
      fs.writeFile('user_input.txt', data, (err) => {
        if (err) {
          return reject("Error saving file");
        }
        resolve();
      });
    });

    // Step 2: Execute script
    await new Promise((resolve, reject) => {
      exec('sh ./run.sh', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing script: ${error.message}`);
          return reject("Error executing script");
        }
        if (stderr) {
          console.error(`Script stderr: ${stderr}`);
        }
        resolve();
      });
    });

    // Step 3: Read file
    fs.readFile('output.log', 'utf8', (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).send("Error reading file");
      }
      console.log(data);
      // Send the content to the client
      res.send(data);
    });

  } catch (error) {
    res.status(500).send(error);
  }
  
});
//to get all doctor names
app.get('/docInfo', (req, res) => {
  let statement = 'SELECT * FROM Doctor';
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Function to Contribute

app.get('/Contribute', (req, res) => {
  let params = req.query;
  let email = params.email;
  let money = params.money;
 
  let statement = `INSERT INTO Contribution(money,email)
                    VALUES(${money},'${email}');`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});
//To return a particular patient history
app.get('/OneHistory', (req, res) => {
  let params = req.query;
  let email = params.patientEmail;
  let statement = `SELECT gender,name,email,address,conditions,surgeries,medication
                    FROM PatientsFillHistory,Patient,MedicalHistory
                    WHERE PatientsFillHistory.history=id
                    AND patient=email AND email = ` + email;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    }
  })
});

//To show all patients whose medical history can be accessed
app.get('/MedHistView', (req, res) => {
  let params = req.query;
  let patientName = "'%" + params.name + "%'";
  let secondParamTest = "" + params.variable;
  let statement = `SELECT name AS 'Name',
                    PatientsFillHistory.history AS 'ID',
                    email FROM Patient,PatientsFillHistory
                    WHERE Patient.email = PatientsFillHistory.patient
                    AND Patient.email IN (SELECT patient from PatientsAttendAppointments 
                    NATURAL JOIN Diagnose WHERE doctor="${email_in_use}")`;
  if (patientName != "''")
    statement += " AND Patient.name LIKE " + patientName
  console.log(statement)
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Returns Appointment Info To patient logged In
app.get('/patientViewAppt', (req, res) => {
  let tmp = req.query;
  let email = tmp.email;
  let statement = `SELECT PatientsAttendAppointments.appt as ID,
                  PatientsAttendAppointments.patient as user, 
                  PatientsAttendAppointments.concerns as theConcerns, 
                  PatientsAttendAppointments.symptoms as theSymptoms, 
                  Appointment.date as theDate,
                  Appointment.starttime as theStart,
                  Appointment.endtime as theEnd,
                  Appointment.status as status
                  FROM PatientsAttendAppointments, Appointment
                  WHERE PatientsAttendAppointments.patient = "${email}" AND
                  PatientsAttendAppointments.appt = Appointment.id`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Checks if history exists
app.get('/checkIfHistory', (req, res) => {
    let params = req.query;
    let email = params.email;
    let statement = "SELECT patient FROM PatientsFillHistory WHERE patient = " + email;
    console.log(statement)
    con.query(statement, function (error, results, fields) {
        if (error) throw error;
        else {
            return res.json({
                data: results
            })
        };
    });
});


app.get('/addToPatientSeeAppt', (req, res) => {
  let params = req.query;
  let email = params.email;
  let appt_id = params.id;
  let concerns = params.concerns;
  let symptoms = params.symptoms;

  // Set the isolation level before starting the transaction
  con.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;', err => {
      if (err) {
          return res.status(500).json({ error: 'Error setting isolation level' });
      }

      // Begin transaction
      con.beginTransaction(err => {
          if (err) {
              return res.status(500).json({ error: 'Transaction error' });
          }

          let sql_try = `INSERT INTO PatientsAttendAppointments (patient, appt, concerns, symptoms) VALUES (?, ?, ?, ?)`;
          con.query(sql_try, [email, appt_id, concerns, symptoms], (error, results) => {
              if (error) {
                  return con.rollback(() => {
                      res.status(500).json({ error: 'Database error during appointment insertion' });
                  });
              }

              con.commit(err => {
                  if (err) {
                      return con.rollback(() => {
                          res.status(500).json({ error: 'Error committing transaction' });
                      });
                  }
                  return res.json({ message: 'Appointment added successfully', data: results });
              });
          });
      });
  });
});




app.get('/schedule', (req, res) => {
  let params = req.query;
  let time = params.time;
  let date = params.date;
  let id = params.id;
  let endtime = params.endTime;
  let concerns = params.concerns;
  let symptoms = params.symptoms;
  let doctor = params.doc;

  let ndate = new Date(date).toLocaleDateString().substring(0, 10);
  let sql_date = `STR_TO_DATE('${ndate}', '%m/%d/%Y')`; 
  let sql_start = `CONVERT('${time}', TIME)`;
  let sql_end = `CONVERT('${endtime}', TIME)`;

  // Set the isolation level before beginning the transaction
  con.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;', err => {
      if (err) {
          return res.status(500).json({ error: 'Error setting isolation level' });
      }

      // Begin transaction
      con.beginTransaction(err => {
          if (err) {
              return res.status(500).json({ error: 'Transaction error' });
          }

          let sql_try = `INSERT INTO Appointment (id, date, starttime, endtime, status) 
                         VALUES (${id}, ${sql_date}, ${sql_start}, ${sql_end}, "NotDone")`;
          console.log(sql_try);

          con.query(sql_try, (error, results) => {
              if (error) {
                  return con.rollback(() => {
                      res.status(500).json({ error: 'Database error during appointment scheduling' });
                  });
              }

              let diagnoseQuery = `INSERT INTO Diagnose (appt, doctor, diagnosis, prescription) 
                                   VALUES (${id}, "${doctor}", "Not Yet Diagnosed", "Not Yet Diagnosed")`;
              console.log(diagnoseQuery);

              con.query(diagnoseQuery, (error, results) => {
                  if (error) {
                      return con.rollback(() => {
                          res.status(500).json({ error: 'Database error during diagnosis entry' });
                      });
                  }

                  con.commit(err => {
                      if (err) {
                          return con.rollback(() => {
                              res.status(500).json({ error: 'Error committing transaction' });
                          });
                      }
                      return res.json({ message: 'Appointment scheduled successfully', data: results });
                  });
              });
          });
      });
  });
});


//Generates ID for appointment
app.get('/genApptUID', (req, res) => {
  console.log("Generating ID for Appointment");
  let statement = 'SELECT id FROM Appointment ORDER BY id DESC LIMIT 1;'
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let generated_id = results[0].id + 1;
      return res.json({ id: `${generated_id}` });
    };
  });
});

//To fill diagnoses
app.get('/diagnose', (req, res) => {
  let params = req.query;
  let id = params.id;
  let diagnosis = params.diagnosis;
  let prescription = params.prescription;
  let statement = `UPDATE Diagnose SET diagnosis="${diagnosis}", prescription="${prescription}" WHERE appt=${id};`;
  console.log(statement)
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let statement = `UPDATE Appointment SET status="Done" WHERE id=${id};`;
      console.log(statement)
      con.query(statement, function (error, results, fields){
        if (error) throw error;
      })
    };
  });
});

//To show diagnoses
app.get('/showDiagnoses', (req, res) => {
  let id = req.query.id;
  let statement = `SELECT * FROM Diagnose WHERE appt=${id}`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//To show appointments to doctor
app.get('/doctorViewAppt', (req, res) => {
  let a = req.query;
  let email = a.email;
  let statement = `SELECT a.id,a.date, a.starttime, a.status, p.name, psa.concerns, psa.symptoms
  FROM Appointment a, PatientsAttendAppointments psa, Patient p
  WHERE a.id = psa.appt AND psa.patient = p.email
  AND a.id IN (SELECT appt FROM Diagnose WHERE doctor="${email_in_use}")`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//To show diagnoses to patient
app.get('/showDiagnoses', (req, res) => {
  let id = req.query.id;
  let statement = `SELECT * FROM Diagnose WHERE appt=${id}`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//To Show all diagnosed appointments till now
app.get('/allDiagnoses', (req, res) => {
  let params = req.query;
  let email = params.patientEmail;
  let statement =`SELECT date,doctor,concerns,symptoms,diagnosis,prescription FROM 
  Appointment A INNER JOIN (SELECT * from PatientsAttendAppointments NATURAL JOIN Diagnose 
  WHERE patient=${email}) AS B ON A.id = B.appt;`
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//To delete appointment
app.get('/deleteAppt', (req, res) => {
  let a = req.query;
  let uid = a.uid;
  let statement = `SELECT status FROM Appointment WHERE id=${uid};`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      results = results[0].status
      if(results == "NotDone"){
        statement = `DELETE FROM Appointment WHERE id=${uid};`;
        console.log(statement);
        con.query(statement, function (error, results, fields) {
          if (error) throw error;
        });
      }
      else{
        if(who=="pat"){
          statement = `DELETE FROM PatientsAttendAppointments p WHERE p.appt = ${uid}`;
          console.log(statement);
          con.query(statement, function (error, results, fields) {
            if (error) throw error;
          });
        }
      }
    };
  });
  return;
});

// If 404, forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Listening on port ${port} `);
});

module.exports = app;