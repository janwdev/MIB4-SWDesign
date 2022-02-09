import { Control } from "./classes/control";

//TODO in echtem Server muesste das hier in Environment Variablen
process.env.dbUserName = "ConnectFourUser";
process.env.dbUserPW = "5RUAlpGA8sfAN2eJ";

export let control: Control = new Control();
control.main();