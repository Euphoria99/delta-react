import RegisterAndLogin from "../pages/RegisterAndLogin"
import Chat from "../pages/Chat"
import { useContext } from "react";
import {UserContext, UserContextProvider} from "../utils/UserContext"

export default function Routes() {

    const {username, id} = useContext(UserContext);

    if(username){
        return(<Chat />);
        // return 'logged in'  + username;
    }
    return(
        <RegisterAndLogin />
    )
}