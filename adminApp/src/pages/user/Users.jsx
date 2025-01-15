import DataUser from "./componentUser/Datauser";
import { AddUser } from "./componentUser/AddUser";
import Single from "./componentUser/Single";
import Layout from "../components/Layout";
import { VerifyUser } from "./componentUser/VerifyUser";

const User = ({ type }) => {
    


    return (
        <Layout children={<>
            {type === "/" ? (<DataUser />) : ( type === "new" ? <AddUser />  : ( type === "edit" ? <AddUser />   : ( type === "verify" ? <VerifyUser /> : <Single />)))}
        </>} use="user" />
    );
};

export default User;
