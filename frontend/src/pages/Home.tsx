import type { FunctionComponent } from "../common/types";

export const Home = (): FunctionComponent => {
  return (
    <div className="bg-blue-300 font-bold w-screen h-screen flex flex-col justify-center items-center">
      <p className="text-white text-6xl">Whats good my boy</p>
      <button className="hover:cursor-pointer" type="submit">
        translate
      </button>
    </div>
  );
};
