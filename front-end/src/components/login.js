import React, {useState} from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";


function Login(){

    let navigate = useNavigate();

    const [username,setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginstatus, setLoginstatus] = useState("");

    const login = (e)=>{
        e.preventDefault();
        Axios.post("http://localhost:3001/login",{
            username: username,
            password: password
        }).then((response)=>{
            if(response.data.message){
                setLoginstatus(response.data.message);
            }else{
                //console.log(response);
                navigate('/dashboard',{state: response.data});
            }
        })
    }

    return(
        <>
        <div style={{margin: "60px", backgroundColor:"lightgrey"}}>
            
            <form>
            <h4 style={{marginLeft:"120px",color:"red"}}>Login Dashboard</h4>
            <div class="form-group col-lg-8" style={{margin: "80px"}}>
            <label htmlFor="username">Username:</label>
            <input class="form-control input-normal" type="text" name="username" onChange={(e)=>{setUsername(e.target.value)}} required/>
            <br/>
            <br/>
            <label htmlFor="password">Password:</label>
            <input type="password" class="form-control input-normal" name="password" onChange={(e)=>{setPassword(e.target.value)}} required/>
            <br/>
            <br/>
            <input type="submit" value="Login" class="btn btn-danger" onClick={login}/>
            <h4 style={{color:'red'}}>{loginstatus}</h4>
            </div>
            </form>
        </div>
        </>
    )
}

export default Login