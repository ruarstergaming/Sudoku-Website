import { React, useState } from 'react'
import { serverURL } from './constants';

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

function RegisterForm() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const onInputChange = (event) => {
        if (event.target.id === "username") {
            setUsername(event.target.value);
        } else if (event.target.id === "email") {
            setEmail(event.target.value);
        } else if (event.target.id === "password") {
            setPassword(event.target.value);
        } else if (event.target.id === "confirmPassword") {
            setConfirmPassword(event.target.value);
        } else if (event.target.id === "is-admin") {
            setIsAdmin(event.target.checked);
        }
    }

    const onSubmit = async function(event) {
        event.preventDefault();
        if (username === "" || password === "" || email === "") {
            alert("Don't leave any fields blank");
        } else if (password !== confirmPassword) {
            alert("Passwords don't match!");
        } else {
            let submitResponse = await submitRegistration(username, email, password);
            if (submitResponse['valid']) {
                alert("Account successfully created!")
                window.location.href = "/fpf06"; // redirect to homepage
            } else {
                alert("Failed to create account. " + submitResponse['reason']);

            }
        }
    }

    const submitRegistration = async function(username, email, password) {
        let userObj = {
            "username": username,
            "email": email,
            "password": password,
            "admin": isAdmin
        };
        let response = await fetch(serverURL + "/add-user", {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userObj)
        });
        return await response.json();
    }

    return (
        <Form onSubmit = { onSubmit } >
            <Form.Group className = 'mb-3'controlId = 'formBasicUsername' >
                <Form.Label > Username </Form.Label> 
                <Form.Control placeholder = 'Enter username' id = 'username' value = { username } onChange = { onInputChange }/> 
                <Form.Text className = 'text-muted' > </Form.Text> 
            </Form.Group>
            <Form.Group className = "mb-3"controlId = "formBasicEmail">
                <Form.Label> Email address </Form.Label> 
                <Form.Control type = "email" placeholder = "Enter email" id = 'email' value = { email } onChange = { onInputChange }/>
                <Form.Text className = "text-muted" >We 'll never share your email with anyone else. </Form.Text > 
            </Form.Group>

            <Form.Group className = "mb-3" controlId = "formBasicPassword" >
                <Form.Label > Password </Form.Label> 
                <Form.Control type = "password" placeholder = "Password" id = 'password' value = { password } onChange = { onInputChange }/> 
            </Form.Group>

            <Form.Group className = "mb-3" controlId = "formBasicPassword" >
                <Form.Label> Confirm Password </Form.Label>
                <Form.Control type = "password" placeholder = "Password" id = 'confirmPassword' value = { confirmPassword } onChange = { onInputChange }/>
            </Form.Group >

            <Form.Check type = "checkbox" label = "Admin?" onChange = { onInputChange } id = "is-admin" className = "mb-3"/>

            <Button variant = "primary" type = "submit">Register </Button> 
        </Form>
    );
}

export default RegisterForm;