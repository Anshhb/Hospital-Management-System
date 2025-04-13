// Set transaction isolation level to SERIALIZABLE
con.query('SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;', (err) => {
    if (err) {
      console.error('Error setting isolation level:', err);
    } else {
      console.log('Isolation level set to SERIALIZABLE');
    }
  });
  
  // Required to handle file uploads
  const multer = require('multer');
  const upload = multer();
  
  app.post('/makeAccount', upload.single('PreviousDocuments'), (req, res) => {
    let query = req.body;
    let name = query.name + " " + query.lastname;
    let email = query.email;
    let password = query.password;
    let address = query.address;
    let gender = query.gender;
    let medications = query.medications || "none";
    let conditions = query.conditions || "none";
    let surgeries = query.surgeries || "none";
    let previousDocuments = req.file ? req.file.buffer : null; // BLOB data
    
    // Validation
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  
    if (gender !== 'M' && gender !== 'F') {
      return res.status(400).json({ error: 'Invalid gender value, must be "M" or "F"' });
    }
  
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
  
        // Fetch the last MedicalHistory id to generate a new id
        let idQuery = 'SELECT id FROM MedicalHistory ORDER BY id DESC LIMIT 1;';
        con.query(idQuery, (error, results) => {
          if (error) {
            return con.rollback(() => {
              res.status(500).json({ error: 'Database error during MedicalHistory ID fetch' });
            });
          }
  
          let generated_id = results.length ? results[0].id + 1 : 1;
  
          // Insert into MedicalHistory table with PreviousDocuments BLOB
          let historyQuery = `INSERT INTO MedicalHistory (id, date, conditions, surgeries, medication, PreviousDocuments) 
                              VALUES (?, CURDATE(), ?, ?, ?, ?)`;
          con.query(historyQuery, [generated_id, conditions, surgeries, medications, previousDocuments], (error, results) => {
            if (error) {
              return con.rollback(() => {
                res.status(500).json({ error: 'Database error during MedicalHistory insert' });
              });
            }
  
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
                    res.status(500).json({ error: 'Error committing transaction' });
                  });
                }
                email_in_use = email;
                password_in_use = password;
                who = "pat";
                res.json({ message: 'Account created successfully', data: results });
              });
            });
          });
        });
      });
    });
  });
  












  
// Set up the /makeDocAccount route
app.get('/makeDocAccount', (req, res) => {
    let params = req.query;
    let name = params.name + " " + params.lastname;
    let email = params.email;
    let password = params.password;
    let gender = params.gender;
    let schedule = params.schedule;
  
    // Validation
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  
    if (gender !== 'M' && gender !== 'F') {
      return res.status(400).json({ error: 'Invalid gender value, must be "M" or "F"' });
    }
  
    // Set isolation level to SERIALIZABLE
    con.query('SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;', (err) => {
      if (err) {
        console.error('Error setting isolation level:', err);
        return res.status(500).json({ error: 'Error setting transaction isolation level' });
      }
  
      // Begin transaction after setting isolation level
      con.beginTransaction(err => {
        if (err) {
          return res.status(500).json({ error: 'Transaction error' });
        }
  
        // Insert into Doctor table
        let doctorQuery = `INSERT INTO Doctor (email, gender, password, name) 
                           VALUES (?, ?, ?, ?)`;
        con.query(doctorQuery, [email, gender, password, name], (error, results) => {
          if (error) {
            return con.rollback(() => {
              res.status(500).json({ error: 'Database error during Doctor insert' });
            });
          }
  
          // Insert into DocsHaveSchedules table
          let scheduleQuery = `INSERT INTO DocsHaveSchedules (sched, doctor) 
                               VALUES (?, ?)`;
          con.query(scheduleQuery, [schedule, email], (error, results) => {
            if (error) {
              return con.rollback(() => {
                res.status(500).json({ error: 'Database error during DocsHaveSchedules insert' });
              });
            }
  
            // Commit transaction if all inserts succeed
            con.commit(err => {
              if (err) {
                return con.rollback(() => {
                  res.status(500).json({ error: 'Error committing transaction' });
                });
              }
              email_in_use = email;
              password_in_use = password;
              who = 'doc';
              res.json({ message: 'Doctor account created successfully', data: results });
            });
          });
        });
      });
    });
  });
  
  const axios = require('axios');

async function sendToChatbot(message, sessionId) {
  try {
    const response = await axios.post('http://localhost:8000/chatbot', {
      session_id: sessionId,
      message: message,
    });
    console.log(response.data.response);
  } catch (error) {
    console.error("Error communicating with the chatbot:", error);
  }
}

// Example usage
sendToChatbot("I have a headache and feel dizzy", "c1");

  
