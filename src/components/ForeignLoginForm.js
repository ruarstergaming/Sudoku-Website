import {React, useState} from 'react'
import Select from 'react-select'
import {serverURL} from "./constants";
import Button from 'react-bootstrap/Button'

function ForeignLoginForm() {

    var selected = '0';
      
    var handleChange = (selectedOptions) => {
        selected = selectedOptions.value;
    }

    const getLink = async function(value)
    {
        window.location.href = serverURL + "/sign-in-foreign?gNumber=" + value;
    }

    const options = [
        { value: '1', label: 'Group 1' },
        { value: '2', label: 'Group 2' },
        { value: '3', label: 'Group 3' },
        { value: '4', label: 'Group 4' },
        { value: '5', label: 'Group 5' },
        { value: '7', label: 'Group 7' },
        { value: '8', label: 'Group 8' },
        { value: '9', label: 'Group 9' },
    ]

    return (
        <div>
            <label id='fl-login-from-text'>Login from:</label>
            <br></br>
            <Select options={options} onChange={handleChange}/>
            <br></br>
            <Button onClick={() => {getLink(selected)}}>Redirect to Login</Button>
        </div>
    );
}

export default ForeignLoginForm;