import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/supabaseClient";
import type { Session, AuthError, User } from "@supabase/supabase-js";

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  signUpUser: (
    email: string,
    password: string,
  ) => Promise<
    | {
        sucesses: boolean;
        error: AuthError;
        data?: undefined;
      }
    | {
        error?: undefined;
        sucesses: boolean;
        data: { user: User | null; session: Session | null };
      }
  >;
  signInUser: (
    email: string,
    password: string,
  ) => Promise<
    | {
        sucesses: boolean;
        error: AuthError;
        data?: undefined;
      }
    | {
        error?: undefined;
        sucesses: boolean;
        data: { user: User | null; session: Session | null };
      }
  >;
  signOut: () => Promise<void>;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthContextProviderV2: React.FC<AuthContextProviderProps> = ({
  children,
}: AuthContextProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const signUpUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      console.log("SIgn up error", error);
      return { sucesses: false, error: error };
    }
    return { sucesses: true, data };
  };

  const signInUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      console.log("SIgn in error", error);
      return { sucesses: false, error: error };
    }
    return { sucesses: true, data };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
    }
  };

  //   useEffect(() => {
  //     const getSession = async () => {
  //       const {
  //         data: { session },
  //       } = await supabase.auth.getSession();

  //       setLoading(false);
  //       setSession(session);
  //     };

  //     const {
  //       data: { subscription },
  //     } = supabase.auth.onAuthStateChange((event, session) => {
  //       if (event === "SIGNED_OUT") {
  //         setSession(null);
  //       } else if (session) {
  //         setSession(session);
  //       }
  //     });

  //     getSession();

  //     return () => {
  //       subscription.unsubscribe();
  //     };
  //   }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, loading, signUpUser, signInUser, signOut }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );

  // return (
  //   <AuthContext.Provider
  //     value={{ session, loading, signUpUser, signInUser, signOut }}
  //   >
  //     {loading ? (
  //       <div>Loading...</div>
  //     ) : !session ? (
  //       <Navigate to="/signin" />
  //     ) : (
  //       children
  //     )}
  //   </AuthContext.Provider>
  // );
};

export default AuthContextProviderV2;

export const UserAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("UserAuth must be used within AuthContextProviderV2");
  }

  return context;
};
