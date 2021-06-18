import ReactDOM from "react-dom";
// Welcome is a default export, so we can import without destructuring
import Welcome from "./welcome.js";
import axios from "./axios";
import App from "./app.js";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import reducer from "./reducers";
import { io } from "socket.io-client";
import { init } from "./socket";

io.connect();

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

axios.get("/user/id.json").then(function ({ data }) {
    if (!data.userId) {
        ReactDOM.render(<Welcome />, document.querySelector("main"));
    } else {
        init(store);
        ReactDOM.render(
            <Provider store={store}>
                <App />
            </Provider>,
            document.querySelector("main")
        );
    }
});
