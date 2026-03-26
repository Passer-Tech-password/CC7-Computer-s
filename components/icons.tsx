import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

export function CartIcon({ title = "Cart", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden={title ? undefined : true} {...props}>
      {title ? <title>{title}</title> : null}
      <path
        d="M6.5 6.5h14l-1.5 7.5H8L6.5 6.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M6.5 6.5 5.8 4H3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M9 20a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 9 20Zm9 0a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 18 20Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MenuIcon({ title = "Menu", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden={title ? undefined : true} {...props}>
      {title ? <title>{title}</title> : null}
      <path d="M4 6.5h16M4 12h16M4 17.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ title = "Close", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden={title ? undefined : true} {...props}>
      {title ? <title>{title}</title> : null}
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SunIcon({ title = "Light mode", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden={title ? undefined : true} {...props}>
      {title ? <title>{title}</title> : null}
      <path
        d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M4.2 12H2M22 12h-2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon({ title = "Dark mode", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden={title ? undefined : true} {...props}>
      {title ? <title>{title}</title> : null}
      <path
        d="M21 14.8A8 8 0 0 1 9.2 3a6.7 6.7 0 0 0 8.8 11.8A6.7 6.7 0 0 0 21 14.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchIcon({ title = "Search", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden={title ? undefined : true} {...props}>
      {title ? <title>{title}</title> : null}
      <path
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UserIcon({ title = "User", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden={title ? undefined : true} {...props}>
      {title ? <title>{title}</title> : null}
      <path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WhatsAppIcon({ title = "WhatsApp", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden={title ? undefined : true} {...props}>
      {title ? <title>{title}</title> : null}
      <path
        d="M12 21a9 9 0 1 0-7.8-4.5L3 21l4.7-1.2A8.9 8.9 0 0 0 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.4 8.8c.2-.5.4-.5.7-.5h.6c.2 0 .4 0 .5.4l.6 1.4c.1.3.1.5-.1.7l-.4.5c-.1.2-.1.4 0 .6.3.7 1.1 1.6 2 2 .2.1.4.1.6 0l.6-.4c.2-.2.4-.2.7-.1l1.4.6c.3.1.4.3.4.5v.6c0 .3 0 .5-.5.7-.5.3-1.6.5-2.8 0-1.2-.5-2.5-1.6-3.4-2.7-.8-1.1-1.5-2.4-1.2-3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function GoogleIcon({ title = "Google", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden={title ? undefined : true} {...props}>
      {title ? <title>{title}</title> : null}
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function SpinnerIcon({ title = "Loading", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
