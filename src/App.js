import React from 'react';
import './index.css'
import axios from 'axios';
import {UserContextProvider} from "../src/utils/UserContext"
import  Routes from './routes/Routes'

function App() {

  axios.defaults.baseURL = 'http://localhost:4000'
  axios.defaults.withCredentials = true;

  return ( 
    <UserContextProvider>
    <Routes />
    </UserContextProvider>
  );
}

export default App;
