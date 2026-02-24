export function formatDate(
    isoDate: string | null,
    includeTime: boolean = false
): string {
    if (!isoDate) return "-";

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
    }

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    let result = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;

    if (includeTime) {
        let hours = date.getHours();
        const minutes = date.getMinutes();

        const ampm = hours >= 12 ? "PM" : "AM";
        let displayHour = hours % 12 || 12;

        result += ` , ${displayHour}:${minutes
            .toString()
            .padStart(2, "0")} ${ampm}`;
    }

    return result;
}