const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const url = "mongodb+srv://Pavaman:Pavaman@20@studentmentorassignment.z8quo.mongodb.net/?retryWrites=true&w=majority";
const cors = require('cors');

app.use(cors({
    origin : "https://naughty-wiles-c647b3.netlify.app"
}))

app.use(bodyParser.json());

app.get("/", (req,res)=>{
    res.send("<h1>Welcome!</h1>");
});

app.get("/student", async function(req,res){
    try {
        let client = await mongoClient.connect(url);
    let db = client.db("StudentMentorAssignment");
    let studentList = await db.collection("students").find().toArray();
    client.close();
    res.json(studentList);
    } catch (error) {
      res.json({
          message : "Something Went wrong"
      })  
    }
})

app.post("/student", async function (req,res){
   try {
    let client  = await mongoClient.connect(url);
    let db = client.db("StudentMentorAssignment");
   await db.collection("students").insertOne({
    name : req.body.name,
    id : req.body.id,
    contact : req.body.contact,
    email : req.body.email,
    batch : req.body.batch,
    mentorAssigned : false,
    mentorName : "Not Assigned"
});
   client.close();
   res.json({
       message : "Student Added!"
   })
   } catch (error) {
       res.json({
           message : "Something Went Wrong"
       })
   }
})

app.post("/mentor", async function(req,res){
    try {
        let client = await mongoClient.connect(url);
        let db = client.db("StudentMentorAssignment");
        let inserted = await db.collection("mentors").insertOne({
            name : req.body.name,
            id : req.body.id,
            contact : req.body.contact,
            email : req.body.email,
            studentList : []
        });
        console.log(inserted + " Inserted");
        client.close();
        res.json({
            message : "Mentor Added!"
        })
    } catch (error) {
        res.json({
            message : "Something Went wrong"
        })
    }
})

app.get("/mentor", async function(req,res){
    try {
        let client = await mongoClient.connect(url);
    let db = client.db("StudentMentorAssignment");
    let mentorList = await db.collection("mentors").find().toArray();
    client.close();
    res.json(mentorList);
    } catch (error) {
      res.json({
          message : "Something Went wrong"
      })  
    }
})


app.put('/mentor/addStudent', async function(req,res){
    try {
        let client = await mongoClient.connect(url);
        let db = client.db('StudentMentorAssignment');
        await db.collection('mentors').findOneAndUpdate({name : req.body.mentor},{$push: {studentList : req.body.studentName}});
        await db.collection('students').findOneAndUpdate({name : req.body.studentName}, {$set : {mentorAssigned : true}});
        await db.collection('students').findOneAndUpdate({name : req.body.studentName}, {$set : {mentorName : req.body.mentor }});
        client.close();
    } catch (error) {
        console.log(error);
    }
})

app.listen(process.env.PORT || 3030, ()=>{
    console.log("Server is Live !");
})