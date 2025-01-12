export const URL_REGEX = /(https?:\/\/[^\s]+)/g;

/** Time in seconds */
export enum Time {
  Minute = 60,
  Hour = 3600,
  Day = 86400,
  Week = 604800,
  Month = 2628000,
}

export enum KeyCodes {
  Enter = 'Enter',
  Escape = 'Escape',
}

export enum TruncationSizes {
  ExtraSmall = 16,
  Small = 25,
  Medium = 35,
  Large = 65,
  ExtraLarge = 175,
}

export enum BrowserEvents {
  Keydown = 'keydown',
  MouseDown = 'mousedown',
  MouseUp = 'mouseup',
  Resize = 'resize',
  Scroll = 'scroll',
}

export enum NavigationPaths {
  Home = '/',
  Login = '/auth/login',
  SignUp = '/auth/signup',
  Settings = '/settings',
}

export enum LocalStorageKeys {
  AccessToken = 'access_token',
}
