export type AddToCalendarButtonProps = {
  proKey?: string;
  name?: string;
  dates?: {
    name?: string;
    description?: string;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    timeZone?: string;
    location?: string;
    status?: "TENTATIVE" | "CONFIRMED" | "CANCELLED";
    sequence?: number;
    uid?: string;
    organizer?: string;
    attendee?: string;
  }[];
  description?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  timeZone?: string;
  location?: string;
  status?: "TENTATIVE" | "CONFIRMED" | "CANCELLED";
  sequence?: number;
  uid?: string;
  organizer?: string;
  attendee?: string;
  icsFile?: string;
  images?: string[] | string;
  recurrence?: string;
  recurrence_interval?: number;
  recurrence_until?: string;
  recurrence_count?: number;
  recurrence_byDay?: string;
  recurrence_byMonth?: string;
  recurrence_byMonthDay?: string;
  recurrence_weekstart?: string;
  availability?: "busy" | "free";
  created?: string;
  updated?: string;
  identifier?: string;
  subscribe?: boolean;
  options?: (
    | "Apple"
    | "Google"
    | "iCal"
    | "Microsoft365"
    | "MicrosoftTeams"
    | "Outlook.com"
    | "Yahoo"
  )[];
  iCalFileName?: string;
  listStyle?:
    | "dropdown"
    | "dropdown-static"
    | "dropup-static"
    | "overlay"
    | "modal";
  buttonStyle?:
    | "default"
    | "3d"
    | "flat"
    | "round"
    | "neumorphism"
    | "text"
    | "date"
    | "custom"
    | "none";
  trigger?: "hover" | "click";
  inline?: boolean;
  buttonsList?: boolean;
  hideIconButton?: boolean;
  hideIconList?: boolean;
  hideIconModal?: boolean;
  hideTextLabelButton?: boolean;
  hideTextLabelList?: boolean;
  hideBackground?: boolean;
  hideCheckmark?: boolean;
  hideBranding?: boolean;
  hideButton?: boolean;
  size?: string;
  label?: string;
  inlineRsvp?: string;
  customLabels?: CustomLabelsObjectType;
  customCss?: string;
  lightMode?: "system" | "dark" | "light" | "bodyScheme";
  language?:
    | "en"
    | "de"
    | "nl"
    | "fa"
    | "fr"
    | "es"
    | "et"
    | "pt"
    | "tr"
    | "zh"
    | "ar"
    | "hi"
    | "pl"
    | "ro"
    | "id"
    | "no"
    | "fi"
    | "sv"
    | "cs"
    | "ja"
    | "it"
    | "ko"
    | "vi";
  hideRichData?: boolean;
  ty?: object;
  rsvp?: object;
  bypassWebViewCheck?: boolean;
  debug?: boolean;
  cspnonce?: string;
  blockInteraction?: boolean;
  styleLight?: string;
  styleDark?: string;
  disabled?: boolean;
  hidden?: boolean;
  pastDateHandling?: string;
  proxy?: boolean;
  forceOverlay?: boolean;
};
