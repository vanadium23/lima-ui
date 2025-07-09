import * as fs from "fs";
import * as path from "path";

import { RESULTS_FOLDER } from "../config/results.ts";

export const VIDEOS_FOLDER = path.join(
  process.cwd(),
  ...RESULTS_FOLDER,
  "videos",
);

const FAILED_VIDEO_PREFIX = "FAILED_";

export function createVideoPath(
  scenarioName: string,
  deviceSuffix: string,
): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const sanitizedName = scenarioName.replace(/[^a-zA-Z0-9]/g, "_");
  const videoName = `${FAILED_VIDEO_PREFIX}${timestamp}_${sanitizedName}_${deviceSuffix}.webm`;

  return path.join(VIDEOS_FOLDER, videoName);
}

export function prepareEmptyVideosFolder(): void {
  if (fs.existsSync(VIDEOS_FOLDER)) {
    for (const file of fs.readdirSync(VIDEOS_FOLDER)) {
      fs.unlinkSync(path.join(VIDEOS_FOLDER, file));
    }
  } else {
    fs.mkdirSync(VIDEOS_FOLDER, { recursive: true });
  }
}

/**
 * Cleans up video files in the videos folder, keeping only files with the FAILED_VIDEO_PREFIX
 * This should be called at the end of the test run
 */
export function cleanupVideoFiles(): void {
  try {
    if (!fs.existsSync(VIDEOS_FOLDER)) {
      return;
    }

    const files = fs.readdirSync(VIDEOS_FOLDER);
    let removedCount = 0;

    for (const file of files) {
      // Only keep files that start with the FAILED_VIDEO_PREFIX
      if (!file.startsWith(FAILED_VIDEO_PREFIX) && file.endsWith(".webm")) {
        const filePath = path.join(VIDEOS_FOLDER, file);

        try {
          fs.unlinkSync(filePath);
          removedCount++;
        } catch (error) {
          console.error(`Failed to remove video file ${filePath}: ${error}`);
        }
      }
    }

    if (removedCount > 0) {
      console.log(`Cleaned up ${removedCount} non-failure video files`);
    }
  } catch (error) {
    console.error(`Error during video cleanup: ${error}`);
  }
}

/**
 * Handles the latest video file - either renames it for failed tests or removes it for passed tests
 * @param failedVideoPath Path to rename the video to if it's a failed test, or undefined to remove it
 * @returns Promise that resolves when the operation is complete
 */
export async function renameFailedRemovePassedVideo(
  failedVideoPath: string,
): Promise<void> {
  try {
    const latestVideo = fs
      .readdirSync(VIDEOS_FOLDER)
      .filter((file) => file.endsWith(".webm"))
      .map((file) => {
        const fullVideoPath = path.join(VIDEOS_FOLDER, file);

        return {
          name: file,
          path: fullVideoPath,
          mtime: fs.statSync(fullVideoPath).mtime,
        };
      })
      .sort(
        (video, anotherVideo) =>
          anotherVideo.mtime.getTime() - video.mtime.getTime(),
      )[0];

    if (latestVideo) {
      if (failedVideoPath) {
        fs.renameSync(latestVideo.path, failedVideoPath);
      } else {
        fs.unlinkSync(latestVideo.path);
      }
    }
  } catch (error) {
    console.error(`Failed to handle video file: ${error}`);
  }
}
