export function formatDateTime(isoString: string | null) {
    if (!isoString) {
        return { date: 'not available', time: 'not available' };
    }
    const dateObj = new Date(isoString);

    const date = dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const time = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    return { date, time };
}