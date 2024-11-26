/**
 * Convert milliseconds to mm:ss format
 * @param ms - Time in milliseconds
 * @returns Time string in mm:ss format
 */
export const convertMsToMmSs = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
