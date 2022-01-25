const express = require('express');
const app = express();
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const {sign, verify, decode} = require("jsonwebtoken")

app.use(express.json());
app.use(cors({credentials: true, origin: true}))
app.use(cookieParser())

// Connecting to db and listening on port
const db = new sqlite3.Database('./OEA_System.db', err =>
{
    if (err) {console.log(err.message); res.status(500).json({message: err.message})}

    else 
    {
        app.listen(3001, () =>
        {
            console.log("Server running on port 3001")
            console.log("Connected to OEA_System database");
        });
    }
});


// Login endpoint
app.post('/login', (req, res) =>
{
    const {email, password} = req.body;

    db.all(`SELECT * FROM user where email = '${email}'`, (err, row) =>
    {
        if (row.length === 0) {res.status(401).json({message: "invalid email address and/or password"})}

        else
        {
            const dbPassword = row[0].password

            bcrypt.compare(password, dbPassword).then( (match) =>
            {
                if (!match)
                {
                    res.status(401).json({message: "invalid email address and/or password"})
                }
                else
                {
                    const user = row[0]
                    const accessToken = sign( {id:user.id}, "secret" )
                    res.cookie("access-token", accessToken, { maxAge: 86400000, /*httpOnly: true, secure: true*/ })
                    res.status(200).json({message: "login successful"})
                }
            })
        }

    });
});


// JWT authorisation of accessToken in cookie
app.get("/loggedIn", (req, res) =>
{
    const accessToken = req.cookies["access-token"]
    if (!accessToken)
    {
        res.status(401).json( {message: "not logged in"} )
    }
    else
    {
        try
        {
            const tokenValid = verify(accessToken, "secret")
            if (tokenValid)
            {
                const decodedToken = decode(accessToken, {complete: true})
                
                db.all(`SELECT id, fname, lname, email, accountType FROM user where id=${decodedToken.payload.id}`, (err, row) =>
                {
                    if (err){console.log(err.message); res.status(500).json({message: err.message})}
                    
                    else if (row.length === 0) {res.status(401).json({message: "invalid id"})}
            
                    else {res.status(200).json({message: row[0]})}
                });
            }
        }
        catch (err) { res.status(401).json( {message: "not logged in"} ) }
    }
})



app.post("/createUser", (req, res) =>
{
    const {fname, lname, accountType, accessKey} = req.body
    bcrypt.hash(accessKey, 10).then ( (hash) =>
    {
        db.run(`INSERT INTO user (fname, lname, accountType, accessKey) VALUES ('${fname}', '${lname}', '${accountType}', '${hash}')`, (err) =>
        {
            if (err){console.log(err.message); res.status(500).json({message: err.message})}
            else
            {
                db.all(`select last_insert_rowid()`, (err, row) =>
                {
                    if (err){console.log(err.message); res.status(500).json({message: err.message})}
            
                    else {res.status(200).json({message: row[0]["last_insert_rowid()"]})}
                })
            }
        })
    })
})

app.post("/checkAccessKey", (req, res) =>
{
    const {accessKey} = req.body
    const id = parseInt(accessKey.substring(0, accessKey.indexOf('-')))
    const accessKeyInDB = accessKey.substring(accessKey.indexOf('-')+1)

    db.all(`SELECT * FROM user where id=${id}`, (err, row) =>
    {
        if (err){console.log(err.message); res.status(500).json({message: err.message})}
        
        else if (row.length === 0) {res.status(401).json({message: "invalid access key"})}

        else
        {
            const dbAccessKey = row[0].accessKey
            
            if (dbAccessKey === null) {res.status(401).json({message: "invalid access key"})}
            
            else
            {
                bcrypt.compare(accessKeyInDB, dbAccessKey).then( (match) =>
                {
                    if (!match) {res.status(401).json({message: "invalid access key"})}
                    
                    else {res.status(200).json({message: "valid access key"})}
                })
            }
        }
    });
})


app.post("/getUserDetails", (req, res) =>
{
    const {id} = req.body

    db.all(`SELECT id, fname, lname, email, accountType FROM user where id=${id}`, (err, row) =>
    {
        if (err){console.log(err.message); res.status(500).json({message: err.message})}
        
        else if (row.length === 0) {res.status(401).json({message: "invalid id"})}

        else {res.status(200).json({message: row[0]})}
    });
})


app.put("/submitUser", (req, res) =>
{
    const {email, password, accessKey} = req.body
    const id = parseInt(accessKey.substring(0, accessKey.indexOf('-')))
    const accessKeyInDB = accessKey.substring(accessKey.indexOf('-')+1)

    db.all(`SELECT * FROM user where id=${id}`, (err, row) =>
    {
        if (err){console.log(err.message); res.status(500).json({message: err.message})}
        
        else if (row.length === 0) {res.status(401).json({message: "invalid access key"})}

        else
        {
            const dbAccessKey = row[0].accessKey

            bcrypt.compare(accessKeyInDB, dbAccessKey).then( (match) =>
            {
                if (!match) {res.status(401).json({message: "invalid access key"})}
                
                else
                {
                    bcrypt.hash(password, 10).then ( (hash) => 
                    {
                        db.run(`UPDATE user SET email='${email}', password='${hash}', accessKey=NULL WHERE id=${id}`, (err) =>
                        {
                            if (err){console.log(err.message); res.status(500).json({message: err.message})}
                            else {res.status(200).json({message: "user details successfully updated"})}
                        })
                    })
                }
            })
        }
    });
})

app.put("/editUserDetails", (req, res) =>
{
    const {id, email, password} = req.body
    
    bcrypt.hash(password, 10).then ( (hash) => 
    {
        db.run(`UPDATE user SET email='${email}', password='${hash}' WHERE id=${id}`, (err) =>
        {
            if (err){console.log(err.message); res.status(500).json({message: err.message})}
            else {res.status(200).json({message: "user details successfully changed"})}
        })
    })
})


app.put("/addAccessKey", (req, res) =>
{
    const {id, accessKey} = req.body
    
    bcrypt.hash(accessKey, 10).then ( (hash) =>
    {
        db.run(`UPDATE user SET accessKey='${hash}' WHERE id=${id}`, (err) =>
        {
            if (err) {console.log(err.message); res.status(500).json({message: err.message})}
            else {res.status(200).json({message: id})}
        })
    })
})

app.put("/editUser", (req, res) =>
{
    const {id, email, fname, lname, accountType} = req.body
    
    db.run(`UPDATE user SET email='${email}', fname='${fname}', lname='${lname}', accountType='${accountType}' WHERE id=${id}`, (err) =>
    {
        if (err) {console.log(err.message); res.status(500).json({message: err.message})}
        else {res.status(200).json({message: "user successfully edited"})}
    })
})

app.post("/deleteUser", (req, res) =>
{
    const {id} = req.body
    
    db.run(`DELETE from user WHERE id=${id}`, (err) =>
    {
        if (err) {console.log(err.message); res.status(500).json({message: err.message})}
        else {res.status(200).json({message: "user successfully deleted"})}
    })
})


app.get('/getUsers', (req, res) =>
{
    db.all(`SELECT id, fname, lname, email, accountType FROM user`, (err, row) =>
    {
        if (err) { console.log(err.message); res.status(500).json({message: err.message}) }

        else { res.status(200).json(row) }
    })
})




app.post("/createExam", (req, res) =>
{
    const {examTitle, examDescription, examStartDate, examEndDate, questions} = req.body
    const questionsID = []
    const answers = []

    db.run(`INSERT INTO exam (title, description, startDate, endDate) VALUES ('${examTitle}', '${examDescription}', '${examStartDate}', '${examEndDate}')`, (err) =>
    {
        if (err){console.log(err.message); res.status(500).json({message: err.message})}
        else
        {
            db.all(`select last_insert_rowid()`, async (err, row) =>
            {
                if (err){console.log(err.message); res.status(500).json({message: err.message})}
        
                else 
                {
                    var examID = row[0]["last_insert_rowid()"]

                    var i;
                    for (i=0; i<questions.length; i++)
                    {
                        var currentQuestion = questions[i]
                        
                        db.run(`INSERT INTO question (examID, questionText) VALUES (${examID}, '${currentQuestion.questionText}')`, (err) =>
                        {
                            if (err){console.log(err.message); res.status(500).json({message: err.message})}
                            else
                            {
                                db.get(`select last_insert_rowid()`, (err, row) =>
                                {
                                    if (err){console.log(err.message); res.status(500).json({message: err.message})}
                            
                                    else {questionsID.push(row['last_insert_rowid()'])}
                                })
                            }

                        })

                        answers.push(currentQuestion.answerOptions)

                        await new Promise(r => setTimeout(r, 100))
                    }
                    
                    var j;
                    for (j=0; j<answers.length; j++)
                    {
                        var currentAnswerOptions = answers[j]
                        var currentQuestionID = questionsID[j]
                        
                        var k;
                        for (k=0; k<currentAnswerOptions.length; k++)
                        {
                            var currentAnswer = currentAnswerOptions[k]
                            db.run(`INSERT INTO answer (questionID, answerText, answerMarks) VALUES (${currentQuestionID}, '${currentAnswer.answerText}', ${currentAnswer.answerMarks})`, (err) =>
                            {
                                if (err){console.log(err.message); res.status(500).json({message: err.message})}
                            })
                        }
                    }
                    res.status(200).json({message: "exam successfully created"})
                }
            })
        }
    })
})

app.get('/getExams', (req, res) =>
{
    const exams = []
    db.all(`SELECT * FROM exam`, (err, row) =>
    {
        if (err) { console.log(err.message); res.status(500).json({message: err.message}) }

        else 
        { 
            var i;
            for (i=0; i<row.length; i++)
            {
                examStartDate = new Date(row[i].startDate)
                examEndDate = new Date(row[i].endDate)
                todayDate = new Date()

                if (examEndDate > todayDate && examStartDate <= todayDate)
                {
                    exams.push(row[i])
                }
            }
            res.status(200).json(exams)
        }
    })
})

app.post('/getTakenExams', (req, res) =>
{
    const {userID} = req.body
    db.all(`SELECT examID FROM result WHERE userID=${userID}`, (err, row) =>
    {
        if (err) { console.log(err.message); res.status(500).json({message: err.message}) }

        else { res.status(200).json(row)}
    })
})



app.post('/getExamContent', (req, res) =>
{
    const {examID} = req.body

    db.all(`SELECT id, questionText FROM question WHERE examID=${examID}`, (err, row1) =>
    {
        if (err) { console.log(err.message); res.status(500).json({message: err.message}) }

        else 
        { 
            db.all(`SELECT * FROM answer`, (err, row2) =>
            {
                if (err) { console.log(err.message); res.status(500).json({message: err.message}) }
        
                else 
                {
                    var questions = row1.slice() 
                    var answers = []
                    
                    var i
                    for (i=0; i<questions.length; i++)
                    {
                        var a = []
                        var j
                        for (j=0; j<row2.length; j++)
                        {
                            if (row2[j].questionID === questions[i].id)
                            {
                                a.push(row2[j])
                            }
                        }
                        answers.push(a)
                    }

                    var examContent = []
                    examContent.push(questions, answers)

                    res.status(200).json(examContent)
                }
            })
        }
    })  
})

app.post('/submitExam', (req, res) =>
{
    const {userID, examID, score} = req.body

    db.get(`SELECT title from exam where id=${examID}`, (err, row) =>
    {
        if (err){console.log(err.message); res.status(500).json({message: err.message})}
        else
        {
            var examTitle = row.title
            const todayDate = new Date()

            db.run(`INSERT INTO result (userID, examID, examTitle, score, date) VALUES (${userID}, ${examID}, '${examTitle}','${score}', '${todayDate}')`, (err) =>
            {
                if (err){console.log(err.message); res.status(500).json({message: err.message})}
                else { res.status(200).json({message: "exam successfully submitted"}) }
            })
        }
    })
})



app.post('/getResults', (req, res) =>
{
    const {userID} = req.body
    
    db.all(`SELECT examID, examTitle, score, date FROM result WHERE userID=${userID}`, (err, row) =>
    {
        if (err) { console.log(err.message); res.status(500).json({message: err.message}) }

        else { res.status(200).json(row) }
    })
})


app.post('/getUserTickets', (req, res) =>
{
    const {userID} = req.body
    
    db.all(`SELECT id, ticketType, ticketDescription from ticket WHERE userID=${userID}`, (err, row) =>
    {
        if (err) { console.log(err.message); res.status(500).json({message: err.message}) }

        else { res.status(200).json(row) }
    })
})

app.post('/submitTicket', (req, res) =>
{
    const {userID, accountType, ticketType, ticketDescription} = req.body
    
    db.run(`INSERT INTO ticket (userID, accountType, ticketType, ticketDescription) VALUES (${userID}, '${accountType}', '${ticketType}','${ticketDescription}')`, (err) =>
    {
        if (err){console.log(err.message); res.status(500).json({message: err.message})}
        else { res.status(200).json({message: "ticket successfully submitted"}) }
    })
})

app.get('/getTickets', (req, res) =>
{
    
    db.all(`SELECT * from ticket`, (err, row) =>
    {
        if (err) { console.log(err.message); res.status(500).json({message: err.message}) }

        else { res.status(200).json(row) }
    })
})

app.post("/deleteTicket", (req, res) =>
{
    const {ticketID} = req.body
    
    db.run(`DELETE from ticket WHERE id=${ticketID}`, (err) =>
    {
        if (err) {console.log(err.message); res.status(500).json({message: err.message})}
        else {res.status(200).json({message: "ticket successfully deleted"})}
    })
})





