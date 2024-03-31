import { React, useState, useEffect } from 'react'
import { serverURL } from './constants';

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

function LoginForm() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function logoutUser() {
        // clear logged in user
        await fetch(serverURL + "/sign-out");
    }

    useEffect(() => {
        logoutUser();
    }, []);

    const onInputChange = (event) => {
        if (event.target.id === "username") {
            setUsername(event.target.value);
        } else if (event.target.id === "password") {
            setPassword(event.target.value);
        }
    }

    const onSubmit = async function(event) {
        event.preventDefault();
        if (username === "" || password === "") {
            alert("Please do not leave any fields blank!");
        } else {
            let submitResponse = await submitCredentials(username, password);
            if (submitResponse['loggedIn']) {
                let tokenResponse = await fetch(serverURL + "/oauth/token", {
                    method: "POST",
                    mode: "cors",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({"access_code": submitResponse['code'], "client_id": "g6"})
                });
                tokenResponse = await tokenResponse.json();
                if (tokenResponse.access_token !== "") {
                    let userResponse = await fetch(serverURL + "/api/user/me", {
                        method: "POST",
                        mode: "cors",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({"access_token": tokenResponse.access_token, local: true})
                    })
                    await userResponse.json();
                    alert("Logged in successfully!");
                    window.location.href = "/fpf06"; // redirect to homepage
                } else {
                    alert('Failed to retrieve authentication token!')
                }
            } else {
                alert("Invalid username or password!");
            }
        }
    }

    const submitCredentials = async function(username, password) {
        let userObj = {
            "username": username,
            "password": password
        };
        let response = await fetch(serverURL + "/login-user", {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userObj)
        });
        return await response.json();
    }

    return (
        <Form onSubmit = { onSubmit }>
            <Form.Group className = "mb-3" >
                <Form.Label > Username </Form.Label> 
                <Form.Control placeholder = "Enter username" id = 'username' value = { username } onChange = { onInputChange }/> 
            </Form.Group >

            < Form.Group className = "mb-3" controlId = "formBasicPassword" >
                < Form.Label > Password </Form.Label> 
                <Form.Control type = "password" placeholder = "Password" id = 'password' value = { password } onChange = { onInputChange }/> 
            </Form.Group >
            <script>window.onload={logoutUser}</script>
            < Button variant = "primary" type = "submit" > Log in </Button> 
        </Form>


    );
}

export default LoginForm;