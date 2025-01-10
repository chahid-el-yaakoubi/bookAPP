import DataUser from "./componentUser/Datauser";
import { AddUser } from "./componentUser/AddUser";
import Single from "./componentUser/Single";
import Layout from "../components/Layout";

const User = ({ type }) => {
    


    return (
        <Layout children={<>
            {type === "/" ? (<DataUser />) : ( type === "new" ? <AddUser />  : ( type === "edit" ? <AddUser />   : <Single />))}
        </>} use="user" />
    );
};

export default User;
