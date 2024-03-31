import {useEffect} from 'react';
import {getCookie, serverURL} from "./constants";

function MandateLogin() {
    // ensures the user is logged in on every single page
    useEffect(() => {
        async function checkLoggedIn() {
            let res = await fetch(serverURL + "/check-logged-in");
            res = await res.json();
            if (res['loggedIn'] == false) window.location.href = "/fpf06/login";
        }
        checkLoggedIn();
    }, []);
    return (
        <div>
            <noscript>You should not see this - enable JavaScript!</noscript>
        </div>
    );
}

export default MandateLogin;
