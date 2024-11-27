/**
 * Convert milliseconds to mm:ss format
 * @param ms - Time in milliseconds. Positive values represent remaining time,
 *             while negative values represent elapsed time.
 * @returns Time string in mm:ss format, prefixed with "-" if time is elapsed.
 */
export const convertMsToMmSs = (ms: number): string => {
    const totalSeconds = ms >= 0 ? Math.ceil(ms / 1000) : Math.floor(-ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return ms < 0 ? `-${formattedTime}` : formattedTime;
};
