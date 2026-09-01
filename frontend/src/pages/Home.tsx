import { useNavigate } from "react-router-dom";

const Home = () => {
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
    </div>
  );
};

export default Home;
