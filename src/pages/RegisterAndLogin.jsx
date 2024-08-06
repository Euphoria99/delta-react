import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../utils/UserContext.jsx";

export default function RegisterAndLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  async function handleSubmit(ev) {
    ev.preventDefault();
  
    // Form validation
    if (!username || !password) {
      console.error('Username and password are required');
      return;
    }
  
    try {
      const url = isLoginOrRegister === 'register' ? 'register' : 'login';
      const response = await axios.post(url, { username, password });
  
      // Assuming the response contains user data including an ID
      const { data } = response;
      setLoggedInUsername(username);
      setId(data.id);
    } catch (error) {
      console.error('Login failed:', error.message);
      // Handle specific error cases here, e.g., display error messages to the user
    }
  }

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          type="text"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border border-gray-300"
        />
        <input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          type="password"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border border-gray-300"
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </button>
        <div className="text-center mt-2">
          {isLoginOrRegister === "register" && (
            <div>
              Already a member ?
              <button onClick={() => setIsLoginOrRegister("login")}>
                Login Here
              </button>
            </div>
          )}
          {isLoginOrRegister === "login" && (
            <div>
              Dont have an account ?
              <button onClick={() => setIsLoginOrRegister("register")}>
                Register Here
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
