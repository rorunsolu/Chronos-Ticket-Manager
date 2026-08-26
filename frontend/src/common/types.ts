import type { ReactNode } from "react";
import type { AuthError, Session, User } from "@supabase/supabase-js";

// Shared component and icon types used across the application.
export type FunctionComponent = React.ReactElement | null;

export type HeroIconSVGProps = React.PropsWithoutRef<
  React.SVGProps<SVGSVGElement>
> &
  React.RefAttributes<SVGSVGElement>;
export type IconProps = HeroIconSVGProps & {
  title?: string;
  titleId?: string;
};
export type Heroicon = React.FC<IconProps>;

// Auth context contract for session state and authentication handlers.
export interface AuthContextValue {
  loading: boolean;
  session: Session | null;
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
}

export interface AuthContextProviderProps {
  children: ReactNode;
}

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
};

export type TicketComment = {
  id: string;
  message: string;
  created_at: string;
  user_id: string;
  ticket_id: string;
};
