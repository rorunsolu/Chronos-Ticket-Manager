import { useNavigate } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { signOut } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    signOut();
  };

  return (
    <div>
      <h1>This is your dashboard</h1>
      {/* <p>You are logged in as: {claims.email}</p> */}
      <div>
        <button onClick={handleLogout}>Sign Out</button>
      </div>

      <a
        className="hover:underline hover:cursor-pointer"
        onClick={() => navigate("/landing")}
      >
        Landing
      </a>
    </div>
  );
};

export default Dashboard;
