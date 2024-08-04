import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AuthorRoute = ({allowedRoles}) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    let location = useLocation();

    return (
        <>
            { currentUser?.roles?.find(role => allowedRoles.includes(role))
                ? <Outlet/>
                    : <Navigate to="/not-found" state={{from: location}} replace/>
                }
        </>
        
    )
};

export default AuthorRoute;
