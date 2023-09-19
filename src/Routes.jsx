import RegisterAndLogin from "./RegisterAndLogin"
import { useContext } from "react";
import {UserContext, UserContextProvider} from "./UserContext"

export default function Routes() {

    const {username, id} = useContext(UserContext);

    if(username){
        return 'logged in'  + username;
    }
    return(
        <RegisterAndLogin />
    )
}