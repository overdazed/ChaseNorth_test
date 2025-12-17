import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({children, role}) => {
    const {user} = useSelector((state) => state.auth);

    if(!user) {
        return <Navigate to="/" replace />;
        // when you want to redirect to home page
        //return <Navigate to="/" replace />;
    }

    if(role && user.role !== role) {
        return <Navigate to="/" replace />;
        // when you want to redirect to home page
        //return <Navigate to="/" replace />;
    }

    return children
}
export default ProtectedRoute
