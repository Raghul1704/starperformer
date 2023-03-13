const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const conn = mysql.createConnection(
    {
        user: "root",
        host: "localhost",
        password: "root",
        database: "project"
    }
)

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    conn.query("SELECT * FROM users WHERE USER_NAME = ? AND USER_PASSWORD = ?", [username, password],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.length > 0) {
                    res.send(result);
                } else {
                    res.send({ message: "Incorrect username or password" });
                }
            }

        }
    )
})

app.get('/getMembers', (req, res) => {
    conn.query("SELECT USER_NAME FROM users", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0) {
                res.send(result);
            } else {
                res.send({ message: "Not able to fetch team members" });
            }
        }
    })
})

app.post('/postCase',(req,res)=>{
    const cases = req.body.cases;
    const member = req.body.member;
    const date = req.body.date;
    const username = req.body.username;
    
    conn.query("INSERT INTO Business_TBL (B_CASES, REPORTED_BY, ASSIGNED_TO, SUBMISSION_TIME) VALUES(?, ?, ?, ?)",[cases, username, member, date],
    (err, result)=>{
        if(err){
            console.log(err);
        }else{
            //res.send(result);
            if(result.affectedRows == 0){
                res.send({message:"not posted"});
            }else{
                res.send({message:"posted"});
            }
        }
    }
    )
})

app.post('/getcases', (req, res) => {
    const username = req.body.username;
    conn.query("SELECT B_ID, B_CASES, REPORTED_BY, REPORTED_TIME, SUBMISSION_TIME FROM Business_TBL WHERE ASSIGNED_TO = ?", [username],
        (err, result) => {
            if (err) {
                req.setEncoding({ err: err });
            } else {
                if (result.length > 0) {
                    res.send(result);
                } else {
                    res.send({ message: "No Business Cases for you" });
                }
            }

        }
    )
})

app.post('/solution', (req, res) => {
    const solution = req.body.solution;
    const b_id = req.body.b_id;
    conn.query("insert into Review_TBL (SOLUTION, B_ID) VALUES ( ? , ? )", [solution, b_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                //res.send(result);
               conn.query("insert into Votes_TBL (VOTES, B_ID, R_ID) values (0, ?, ?)", [b_id, result.insertId],
               (err, result)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.send({message:"answered"});
                    }
               }

                )
            }

        }
    )
});

app.get('/getLeader', (req, res) => {
    conn.query("select V.V_ID, B.B_CASES, B.REPORTED_BY, B.ASSIGNED_TO, R.SOLUTION, V.VOTES FROM Business_TBL B JOIN Review_TBL R ON B.B_ID = R.B_ID JOIN Votes_TBL V ON R.R_ID = V.R_ID ORDER BY V.VOTES desc",
        (err, result) => {
            if (err) {
                req.setEncoding({ err: err });
            } else {
                    res.send(result);
            }

        }
    )
})

app.post('/vote', (req, res) => {
    const votes = req.body.votes;
    const r_id = req.body.r_id;

        conn.query("UPDATE Votes_TBL SET VOTES = ? WHERE R_ID = ?;", [votes, r_id],
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send({message:"voted+++"});
                }
            }
        )
})

app.post('/get',(req,res)=>{
    const username = req.body.username;
    conn.query("select V.V_ID, B.B_ID, R.R_ID, B.B_CASES, R.SOLUTION, V.VOTES FROM Business_TBL B JOIN Review_TBL R ON B.B_ID = R.B_ID JOIN Votes_TBL V ON R.R_ID = V.R_ID WHERE NOT B.ASSIGNED_TO = ?",[username], 
    (err, result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    )
})




app.listen(3001, () => {
    console.log("server running in port 3001");
})