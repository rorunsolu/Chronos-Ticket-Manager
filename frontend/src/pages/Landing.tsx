import { useNavigate } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";

const Landing = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <div>
      <div>
        <p>This is the landing page</p>
      </div>

      <div className="flex flex-col gap-2">
        {!session && (
          <>
            {" "}
            <a
              className="hover:underline hover:cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </a>
            <a
              className="hover:underline hover:cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </a>
          </>
        )}

        {session && (
          <>
            {" "}
            <a
              className="hover:underline hover:cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </a>{" "}
            <a
              className="hover:underline hover:cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </a>{" "}
            <a
              className="hover:underline hover:cursor-pointer"
              onClick={() => navigate("/ticket")}
            >
              Ticket
            </a>{" "}
            <a
              className="hover:underline hover:cursor-pointer"
              onClick={() => navigate("/account")}
            >
              Manage Account
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Landing;
