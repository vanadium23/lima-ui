import { devices } from "@playwright/test";

type Devices = typeof devices;
export type DeviceProfile = Devices[keyof Devices];

export const DESKTOP_PROFILE: DeviceProfile = {
  viewport: {
    width: 1024,
    height: 800,
  },
  isMobile: false,
  hasTouch: false,
  deviceScaleFactor: 1,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  defaultBrowserType: "chromium",
};

export const TABLET_PROFILE: DeviceProfile = devices["iPad (gen 5)"];

export const MOBILE_PROFILE: DeviceProfile = devices["Galaxy S9+"];

export enum DeviceProfiles {
  desktop = "desktop",
  tablet = "tablet",
  mobile = "mobile",
}

export function isDeviceProfile(profile: string): profile is DeviceProfiles {
  return Object.keys(DeviceProfiles).includes(profile);
}

export const DEVICE_PROFILES: Record<DeviceProfiles, DeviceProfile> = {
  desktop: DESKTOP_PROFILE,
  tablet: TABLET_PROFILE,
  mobile: MOBILE_PROFILE,
};
