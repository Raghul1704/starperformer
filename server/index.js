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


app.post('/postCase',(req,res)=>{
    const cases = req.body.cases;
    const iteration = req.body.iteration;
    const sprint = req.body.sprint;
    const username = req.body.username;
    
    conn.query("INSERT INTO Business_TBL (B_CASES, REPORTED_BY, ITERATION, SPRINT, VOTES) VALUES(?, ?, ?, ?, ?)",[cases, username, iteration, sprint, 0],
    (err, result)=>{
        if(err){
            console.log(err);
        }else{
            //res.send(result);
            if(result.affectedRows == 0){
                res.send({message:"not posted"});
            }else{
                console.log("result", result);
                conn.query("INSERT INTO Votes_TBL (B_ID, LIKED_BY) VALUES (?, ?)",[result.insertId, "Vinay"],
                (err, result)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log(result);
                    }
                }
                )
            }
        }
    }
    )
})

app.post('/getcases', (req, res) => {
    const username = req.body.username;
    conn.query("SELECT B.B_ID, B.B_CASES, B.ITERATION, B.SPRINT FROM Business_TBL B JOIN Votes_TBL V ON (B.B_ID = V.B_ID) WHERE NOT REPORTED_BY = ? and NOT LIKED_BY = ?", [username, username],
        (err, result) => {
            if (err) {
                res.send(result);
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
    conn.query("SELECT B_CASES,REPORTED_BY, ITERATION, SPRINT, VOTES FROM Business_TBL ORDER BY VOTES desc",
        (err, result) => {
            if (err) {
                res.send(result);
            } else {
                    res.send(result);
            }

        }
    )
})

app.post('/vote', (req, res) => {
    const b_id = req.body.b_id;
    const user = req.body.username;
        conn.query("INSERT INTO Votes_TBL (B_ID, LIKED_BY) VALUES (?, ?)", [b_id, user],
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    //res.send({message:"voted+++"});
                    conn.query("SELECT VOTES FROM Business_TBL WHERE B_ID = ?", [b_id],
                    (err,result)=>{
                        if(err){
                            console.log(err);
                        }else{
                            let votes = result[0].VOTES;
                            votes = votes+1;
                            conn.query("UPDATE Business_TBL SET VOTES = ? WHERE B_ID = ?",[votes, b_id],
                            (err,result)=>{
                                if(err){
                                    console.log(err);
                                }else{
                                    res.send({message:"voted...."});
                                }
                            }
                            )
                        }
                    }
                    )
                }
            }
        )
})

app.post('/get',(req,res)=>{
    const username = req.body.username;
   
})




app.listen(3001, () => {
    console.log("server running in port 3001");
})

//select V.V_ID, B.B_CASES, B.REPORTED_BY, B.ASSIGNED_TO, R.SOLUTION, V.VOTES FROM Business_TBL B JOIN Review_TBL R ON B.B_ID = R.B_ID JOIN Votes_TBL V ON R.R_ID = V.R_ID ORDER BY V.VOTES desc"