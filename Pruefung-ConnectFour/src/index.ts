import { Control } from "./classes/control";

// in real server, this should not be set here
process.env.dbUserName = "ConnectFourUser";
process.env.dbUserPW = "5RUAlpGA8sfAN2eJ"; 

// create Control and start program
export let control: Control = new Control();
control.main();