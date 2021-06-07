import ReactDOM from "react-dom";
// Welcome is a default export, so we can import without destructuring
import Welcome from "./welcome.js";
import axios from "./axios";

axios.get("/user/id.json").then(function ({ data }) {
    console.log("data in start", data);
    if (!data.userId) {
        ReactDOM.render(<Welcome />, document.querySelector("main"));
    } else {
        ReactDOM.render(
            <img src="/logo.png" alt="logo" />,
            document.querySelector("main")
        );
    }
});
