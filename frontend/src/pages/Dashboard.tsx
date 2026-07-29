import { supabase } from "@/supabaseClient";
import { useState } from "react";

const Dashboard = () => {
  const [, setUserAccount] = useState(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserAccount(null);
  };

  return (
    <div>
      <h1>Welcome!</h1>
      {/* <p>You are logged in as: {claims.email}</p> */}
      <button onClick={handleLogout}>Sign Out</button>
    </div>
  );
};

export default Dashboard;
