// Registration is a named export so we are importing with destructuring
import { Registration } from "./registration.js";
import { HashRouter, Route } from "react-router-dom";
import { Login } from "./Login";
import { ResetPassword } from "./ResetPassword";

export default function Welcome() {
    return (
        // Using a react fragment as the root element
        <>
            <h1>Welcome</h1>
            <HashRouter>
                <>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/password-reset" component={ResetPassword} />
                </>
            </HashRouter>
        </>
    );
}
