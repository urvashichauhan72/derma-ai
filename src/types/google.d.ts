// Type declarations for Google Identity Services (GIS)
// https://developers.google.com/identity/gsi/web/reference/js-reference

interface GoogleCredentialResponse {
  credential: string; // JWT token
  select_by: string;
  clientId: string;
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: 'signin' | 'signup' | 'use';
  itp_support?: boolean;
  ux_mode?: 'popup' | 'redirect';
}

interface GoogleButtonConfiguration {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: number | string;
  locale?: string;
}

interface GoogleAccountsId {
  initialize: (config: GoogleIdConfiguration) => void;
  renderButton: (parent: HTMLElement, config: GoogleButtonConfiguration) => void;
  prompt: (momentListener?: (notification: unknown) => void) => void;
  disableAutoSelect: () => void;
  revoke: (hint: string, callback: (response: { successful: boolean; error: string }) => void) => void;
}

interface Google {
  accounts: {
    id: GoogleAccountsId;
  };
}

declare global {
  interface Window {
    google?: Google;
  }
}

export {};
