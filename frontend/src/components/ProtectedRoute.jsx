import { useAuth } from "../context/auth.context";
import { useNavigate } from "react-router";

export default function ProtectedRoute({ children }) {
    const {user, loading} = useAuth();
    const navigate = useNavigate();

    if(loading) return (
        <p>Loading...</p>
    )

    if(!user) navigate('/login');
    return children;
}