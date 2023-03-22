import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";


function Dashboard() {

    const location = useLocation();
    const data = location.state;
    const user_name = data[0].USER_NAME;
    let navigate = useNavigate();

    const [popup, setPopup] = useState(false);
    const [view, setView] = useState(false);
    const [voting, setVoting] = useState(false);
    const [board, setBoard] = useState(false);
    const [members, setMembers] = useState([]);
    const [cases, setCases] = useState([]);
    const [vote, setVote] = useState([]);
    const [leaderr, setLeaderr] = useState([]);
    const [solution, setSolution] = useState('');
    const [postedstatus, setPostedstatus] = useState("");
    const [answeredstatus, setAnsweredstatus] = useState("");
    const [votedstatus, setVotedstatus] = useState("");


    const leader = (e) => {
        e.preventDefault();
        setBoard(!board);
    }

    useEffect(()=>{
        Axios.get("http://localhost:3001/getLeader").then((res) => {
            setLeaderr([...leaderr, ...res.data]);
        })
    },[])

    const create_bc = (e) => {
        e.preventDefault();
        setPopup(!popup);
    };

    useEffect(() => {
       console.log(user_name);
        Axios.post("http://localhost:3001/getcases", { username: user_name }).then((response) => {
            if (response.data.message) {
                console.log(response.data.message);
            } else {
                setCases([...cases, ...response.data]);
            }
        });
    }, [])


    const view_cases = (e) => {
        e.preventDefault();
        setView(!view);
    }

    useEffect(()=>{
        Axios.post("http://localhost:3001/get", { username: user_name }).then((res) => {
            console.log(res.data);
            setVote([...vote, ...res.data]);
        })
    },[])

    const drop_vote = (e) => {
        e.preventDefault();
        setVoting(!voting);
    }

    const increase_vote = (e, b_id) => {
        e.preventDefault();
        Axios.post("http://localhost:3001/vote", {
            b_id: b_id,
            username: user_name
        }).then((res) => {
            if (res.data.message) {
                setVotedstatus(res.data.message);
            }
        })
    }


    useEffect(() => {
        Axios.get("http://localhost:3001/getMembers").then((response) => {
            if (response.data.message) {
                console.log(response.data.message);
            } else {
                setMembers([...members, ...response.data]);
            }
        });
    }, []);


    const form_data = (e) =>{
        e.preventDefault();
        console.log("posting...")
        Axios.post("http://localhost:3001/postCase",{
            cases: e.target.businessCase.value,
            iteration: e.target.iteration.value,
            sprint: e.target.sprint.value,
            username: user_name
        }).then((res)=>{
            if(res.data.message){
                setPostedstatus(res.data.message);
            }
        })
    }

    return (
        <div>
            <h3>
                Hello {user_name} !!!
            </h3>
            <button class="btn btn-primary" style={{margin:"10px 10px 10px 10px"}} onClick={(e)=>create_bc(e)}>Create BC</button>
            <button class="btn btn-primary" style={{margin:"10px 10px 10px 10px"}} onClick={(e)=>{view_cases(e)}}>View Cases</button>

            <button class="btn btn-primary" style={{margin:"10px 10px 10px 10px"}} onClick={(e)=>leader(e)}>Star Performer Board</button>

            <button class="btn btn-danger" style={{float:"right"}} onClick={()=>{navigate('/')}}>Logout</button>
            {
                popup ? 
                <div>
                <form onSubmit={(e)=>form_data(e)}>
                    <div class="form-group">
                    <label>Write a Business Case:</label>
                    <input class="form-control input-normal" type="text" name="businessCase" required />
                    </div>
                    <br/>
                    <div class="form-group">
                    <label>Mention the Iteration:</label>
                    <input class="form-control input-normal" type="text" name="iteration" required/>
                    </div>
                    <br/>
                    <div class="form-group">
                    <label>Mention the Sprint:</label> 
                    <input class="form-control input-normal" type="text" name="sprint" required />
                    </div>
                    <br/>
                    <button class="btn btn-danger" type="submit">submit</button>
                </form> 
                <div style={{color:"green"}}>{postedstatus}</div>
                </div>
                : null
            }
            

            {view ?
                <Fragment>
                    <table class="table table-striped table-dark">
                        <thead>
                            <tr>
                                <th>Case Details</th>
                                <th>Iteration</th>
                                <th>Sprint</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cases.map((c) => (
                                <tr key={c.B_ID}>
                                    <td>{c.B_CASES}</td>
                                    <td>{c.ITERATION}</td>
                                    <td>{c.SPRINT}</td>
                                    <td><button class="btn btn-warning" onClick={(e) => increase_vote(e, c.B_ID)}>Vote</button></td>
                                </tr>
                            ))

                            }
                        </tbody>
                    </table>
                    <div style={{color: "green"}}>{votedstatus}</div>
                </Fragment> : null
            }

            {
                board ?
                    <table class="table table-striped table-dark">
                        <thead>
                            <tr>
                                <th>Business Case</th>
                                <th>Reporter</th>
                                <th>Iteration</th>
                                <th>Sprint</th>
                                <th>Votes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                leaderr.map((l) => (
                                    <tr key={l.B_ID}>
                                        <td scope="row">{l.B_CASES}</td>
                                        <td>{l.REPORTED_BY}</td>
                                        <td>{l.ITERATION}</td>
                                        <td>{l.SPRINT}</td>
                                        <td>{l.VOTES}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    : null
            }

        </div>
    )
}


export default Dashboard
