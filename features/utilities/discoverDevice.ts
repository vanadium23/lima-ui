import {
  DEVICE_PROFILES,
  DeviceProfiles,
  isDeviceProfile,
} from "../config/deviceProfiles.ts";

export function getDeviceProfile() {
  const deviceProfileName = getDeviceProfileName();

  if (isDeviceProfile(deviceProfileName)) {
    return DEVICE_PROFILES[deviceProfileName];
  } else {
    return DEVICE_PROFILES.desktop;
  }
}

export function getDeviceProfileName() {
  return process.env.DEVICE_PROFILE || DeviceProfiles.desktop;
}

export function isDesktop() {
  return getDeviceProfileName() === DeviceProfiles.desktop;
}

export function isTablet() {
  return getDeviceProfileName() === DeviceProfiles.tablet;
}

export function isMobile() {
  return getDeviceProfileName() === DeviceProfiles.mobile;
}
