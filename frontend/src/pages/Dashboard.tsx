import { supabase } from "@/supabaseClient";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [, setUserAccount] = useState(null);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserAccount(null);
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
