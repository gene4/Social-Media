// Registration is a named export so we are importing with destructuring
import { Registration } from "./registration.js";

export default function Welcome() {
    return (
        // Using a react fragment as the root element
        <>
            <h1>Welcome</h1>
            <Registration />
        </>
    );
}
