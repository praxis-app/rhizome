export const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export enum KeyCodes {
  Enter = 'Enter',
  Escape = 'Escape',
}

export enum Time {
  Minute = 60,
  Hour = 3600,
  Day = 86400,
  Week = 604800,
  Month = 2628000,
}

export enum TruncationSizes {
  ExtraSmall = 16,
  Small = 25,
  Medium = 35,
  Large = 65,
  ExtraLarge = 175,
}