// index.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client } = require('cassandra-driver');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const client = new Client({
    cloud: {
    secureConnectBundle: "/Users/kamalpreetsingh/downloads/secure-connect-mock-cassandra-db.zip", // replace it with actual path of cassandra bundle
    },
    credentials: {
    username: `${process.env.CLIENT_ID}`,
    password: `${process.env.SECRET}`,
    },
});

async function run() {
    await client.connect();
    console.log(`Database Connected!`);
  
    // Execute a query
    const rs = await client.execute("SELECT * FROM system.local");
    console.log(`Your cluster returned ${rs.rowLength} row(s)`);
  }

  run();



// Define schemas
const createDoctorsTable = `
  CREATE TABLE IF NOT EXISTS local_db.doctors (
    doctorid UUID PRIMARY KEY,
    name TEXT,
    specialization TEXT,
    contactnumber TEXT,
    email TEXT,
    password TEXT
  );
`;

const createPatientsTable = `
  CREATE TABLE IF NOT EXISTS local_db.patients (
    patientid UUID PRIMARY KEY,
    name TEXT,
    address TEXT,
    contact TEXT,
    email TEXT,
    password TEXT
  );
`;

const createMedicalHistoryTable = `
CREATE TABLE IF NOT EXISTS local_db.medicalHistory (
  historyid UUID PRIMARY KEY,
  patientid UUID,
  testName TEXT,
  testResult TEXT,
  date TEXT
);
`;

const createAppointmentsTable = `
  CREATE TABLE IF NOT EXISTS local_db.appointments (
    appointmentid UUID PRIMARY KEY,
    doctorid UUID,
    patientid UUID,
    appointmentdate TEXT,
    venue TEXT,
  );
`;

// Create tables
client.execute(createDoctorsTable);
client.execute(createPatientsTable);
client.execute(createAppointmentsTable);
client.execute(createMedicalHistoryTable);

// Express routes

// Select all doctors
app.get('/doctors', async (req, res) => {
  const result = await client.execute('SELECT * FROM local_db.doctors');
  res.json(result.rows);
});

app.post('/sign-up-doctor',async(req,res)=>{
    const name = req.body.name;
    const specialization = req.body.specialization;
    const contact = req.body.contact;
    const email = req.body.email;
    const password = req.body.password;
    const result = await client.execute(`INSERT INTO local_db.doctors (doctorid, name, specialization, contactnumber, email, password)
    VALUES (uuid(), '${name}', '${specialization}', '${contact}', '${email}','${password}');
    `);
    res.json({result});
});

app.post('/login-doctor',async(req,res)=>{
    const {email,password} = req.body;
    const result = await client.execute(`SELECT * FROM local_db.doctors WHERE email = '${email}' ALLOW FILTERING`);
    if(result.rows[0].password == password){
        res.json(result.rows[0]);
    }else{
        res.json({
            message: 'Invalid Credentials'
        })
    }
})

app.post('/sign-up-patient',async(req,res)=>{
    const name = req.body.name;
    const address = req.body.address;
    const contact = req.body.contact;
    const email = req.body.email;
    const password = req.body.password;
    const result = await client.execute(`INSERT INTO local_db.patients (patientid, name, address, contact, email, password)
    VALUES (uuid(), '${name}', '${address}', '${contact}', '${email}','${password}');
    `);
    res.json({result});
});

app.post('/login-patient',async(req,res)=>{
    const {email,password} = req.body;
    const result = await client.execute(`SELECT * FROM local_db.patients WHERE email = '${email}' ALLOW FILTERING`);
    console.log(result);
    if(result && result.rows.length>0 && result.rows[0].password === password){
        const medicalHistory = await client.execute(`SELECT * FROM local_db.medicalHistory WHERE patientid = ${result.rows[0].patientid} ALLOW FILTERING`);
        res.json({...result.rows[0],
        medicalHistory: medicalHistory.rows});
    }else{
        res.json({
            message: 'Invalid Credentials'
        })
    }
});

app.post('/add-appointment',async (req,res)=>{
    const {
    doctorid,
    patientid,
    appointmentdate,
    venue } = req.body;

    const result = await client.execute(`INSERT INTO local_db.appointments (appointmentid, doctorid, patientid, appointmentdate, venue)
    VALUES (uuid(), ${doctorid}, ${patientid}, '${appointmentdate}', '${venue}');
    `);

    res.json({result});
});

app.put('/update-appointment',async (req,res)=>{
    const {
    appointmentid,
    appointmentdate,
    venue } = req.body;

    const result = await client.execute(`UPDATE local_db.appointments SET venue = '${venue}', appointmentDate = '${appointmentdate}' where appointmentid = ${appointmentid}`);

    res.json({result});
});

app.delete('/delete-appointment',async (req,res)=>{
    const {
    appointmentid,
 } = req.body;

    const result = await client.execute(`DELETE FROM local_db.appointments where appointmentid = ${appointmentid}`);

    res.json({result});
});

app.post('/add-medical-history',async (req,res)=>{
    const {
    patientid,
    testName,
    testResult,
    date } = req.body;

    const result = await client.execute(`INSERT INTO local_db.medicalHistory (historyid, patientid, testName,testResult, date)
    VALUES (uuid(), ${patientid}, '${testName}', '${testResult}', '${date}');
    `);

    res.json({result});
});



app.post('/get-appointments-patient',async(req,res)=>{
    const {patientid} = req.body;
    const result = await client.execute(`SELECT * FROM local_db.appointments WHERE patientid = ${patientid} ALLOW FILTERING`);
    if(result){
        res.json({
            appointments: result.rows
        })
    }else{
        res.json({
            appointments: []
        })
    }
});

app.post('/get-appointments-doctors',async(req,res)=>{
    const {doctorid} = req.body;
    const result = await client.execute(`SELECT * FROM local_db.appointments WHERE doctorid = ${doctorid} ALLOW FILTERING`);
    if(result){
        res.json({
            appointments: result.rows
        })
    }else{
        res.json({
            appointments: []
        })
    }
});



// Select doctor by doctorID
app.get('/doctors/:doctorID', async (req, res) => {
  const { doctorID } = req.params;
  const result = await client.execute('SELECT * FROM local_db.doctors WHERE doctorid = ?', [doctorID]);
  res.json(result.rows[0]);
});


// Select patient by patientID
app.get('/patients', async (req, res) => {
  const { patientID } = req.params;
  const result = await client.execute('SELECT * FROM local_db.patients');
  res.json(result.rows);
});

// Select all appointments of a patient
app.get('/appointments/patient/:patientID', async (req, res) => {
  const { patientID } = req.params;
  const result = await client.execute('SELECT * FROM local_db.appointments WHERE patientid = ?', [patientID]);
  res.json(result.rows);
});

// Select all appointments of a doctor
app.get('/appointments/doctor/:doctorID', async (req, res) => {
  const { doctorID } = req.params;
  const result = await client.execute('SELECT * FROM local_db.appointments WHERE doctorid = ?', [doctorID]);
  res.json(result.rows);
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});