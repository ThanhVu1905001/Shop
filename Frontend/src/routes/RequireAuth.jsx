import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireAuth = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    let location = useLocation();

    return (
        <>
            { currentUser 
                ? <Outlet/> 
                : <Navigate to="/" state={{from: location}} replace/>}
        </>
        
    )
};

export default RequireAuth;
