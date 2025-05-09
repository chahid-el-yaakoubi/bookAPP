import React from 'react'
import OptimizedUsersTable from './components/DataUsers';
import HostLayout from '../../Hosting/ComponentHost/HostLayout';
import SingleUserPage from './components/SingleUser';
import AddUserPage from './components/AddUser';

const User = ({type}) => {
    return (
        <>
            <HostLayout>
            {/* {type === "/" ? (<DataUser />) : ( type === "new" ? <AddUser />  : ( type === "edit" ? <UpdateUser />   : ( type === "verify" ? <VerifyUser /> : <Single />)))} */}

                {type === 'table' ? <OptimizedUsersTable /> : (type === "user" ?   <SingleUserPage /> : <AddUserPage /> )    }
                
                
            </HostLayout>
        </>
    )
}

export default User;
