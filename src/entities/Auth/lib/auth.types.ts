export interface AuthUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

export interface AuthSession {
  user: AuthUser;
  expires: string;
}

export interface PopupAuthOptions {
  provider?: string;
  callbackUrl?: string;
  redirect?: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: AuthSession | null;
}

export interface PopupAuthState extends AuthState {
  isPopupOpen: boolean;
  signInWithPopup: (options?: PopupAuthOptions) => Promise<boolean>;
  signOutWithPopup: () => Promise<void>;
}

export interface AuthMessage {
  type: "AUTH_SUCCESS" | "AUTH_ERROR";
  session?: AuthSession;
  error?: string;
}
