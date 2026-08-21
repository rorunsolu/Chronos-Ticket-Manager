import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import type {
  AuthContextValue,
  AuthContextProviderProps,
} from "@/common/types";

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log("Supabase session:", session);
      console.log("Supabase user:", session?.user);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      console.log("Auth event:", event, "session:", session);
      console.log("Auth user:", session?.user);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, loading, signUpUser, signInUser, signOut }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export default AuthContextProviderV2;

export const UserAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("UserAuth must be used within AuthContextProviderV2");
  }

  return context;
};
