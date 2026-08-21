import { useNavigate } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";

const Home = () => {
  const { session } = UserAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2">
      HOMEPAGE
      <a
        className="hover:underline hover:cursor-pointer"
        onClick={() => navigate("/signin")}
      >
        Login
      </a>
      <a
        className="hover:underline hover:cursor-pointer"
        onClick={() => navigate("/signup")}
      >
        Signup
      </a>
      {session && (
        <a
          className="hover:underline hover:cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </a>
      )}
      {session && (
        <a
          className="hover:underline hover:cursor-pointer"
          onClick={() => navigate("/ticket")}
        >
          Ticket
        </a>
      )}
      {session && (
        <a
          className="hover:underline hover:cursor-pointer"
          onClick={() => navigate("/account")}
        >
          Account
        </a>
      )}
    </div>
  );
};

export default Home;
