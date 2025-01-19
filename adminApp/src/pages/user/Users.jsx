import DataUser from "./componentUser/DataUser";
import { AddUser } from "./componentUser/AddUser";
import Single from "./componentUser/Single";
import Layout from "../components/Layout";
import { VerifyUser } from "./componentUser/VerifyUser";
import UpdateUser from "./componentUser/updateUser";

const User = ({ type }) => {
    


    return (
        <Layout children={<>
            {type === "/" ? (<DataUser />) : ( type === "new" ? <AddUser />  : ( type === "edit" ? <UpdateUser />   : ( type === "verify" ? <VerifyUser /> : <Single />)))}
        </>} use="user" />
    );
};

export default User;
