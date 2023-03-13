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
        <div style={{margin: "60px"}}>
            <h4>Login</h4>
            <form>
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" onChange={(e)=>{setUsername(e.target.value)}} required/>
            <br/>
            <br/>
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" onChange={(e)=>{setPassword(e.target.value)}} required/>
            <br/>
            <br/>
            <input type="submit" value="Login" onClick={login}/>
            <h4 style={{color:'red'}}>{loginstatus}</h4>
            </form>
        </div>
    )
}

export default Login