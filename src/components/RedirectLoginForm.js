import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { serverURL } from './constants';

function RedirectLoginForm() {
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control id="email" placeholder="Enter username" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" id="password" placeholder="Password" />
      </Form.Group>
      
      <Button variant="primary" onClick={submitLogin}>
        Submit
      </Button>
    </Form>
  );
}

async function submitLogin() {
  const loggedInArr = await validateCredentials();
  if (loggedInArr['loggedIn']) {
    const params = new URLSearchParams(window.location.search);
    window.location.href = params.get('redirect_url') + "?code=" + loggedInArr['code']
  } else {
    alert("Invalid username or password.");
  }
}

async function validateCredentials() {
  let userObj = {
    "username": document.getElementById("email").value,
    "password": document.getElementById("password").value
  };

  let response = await fetch(serverURL + "/login-user", {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userObj)
  });

  return (await response.json());
}

export default RedirectLoginForm;