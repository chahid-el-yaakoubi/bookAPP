 
import Layout from "../components/Layout";
import DataPartner from "./componentPartner/DataPartner";
 

const User = ({ type }) => {
    


    return (
        <Layout children={<>
            {/* {type === "/" ? (<DataUser />) : ( type === "new" ? <AddUser />  : ( type === "edit" ? <UpdateUser />   : ( type === "verify" ? <VerifyUser /> : <Single />)))} */}
            <DataPartner />
        </>} use="user" />
    );
};

export default User;
