export function formatDate(
    isoDate: string | null,
    includeTime: boolean = false
): string {
    if (!isoDate) {
        return "-";
    }

    const date = new Date(isoDate);

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
    }

    // ✅ Use LOCAL time instead of UTC
    let year = date.getFullYear();
    let month = date.getMonth(); // 0-based
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Round minutes based on seconds
    if (seconds > 30) {
        minutes += 1;
    }

    // Handle minute overflow
    if (minutes === 60) {
        minutes = 0;
        hours += 1;
    }

    // Handle hour overflow
    if (hours === 24) {
        hours = 0;
        const newDate = new Date(year, month, day + 1);
        year = newDate.getFullYear();
        month = newDate.getMonth();
        day = newDate.getDate();
    }

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    let result = `${day} ${months[month]} ${year}`;

    if (includeTime) {
        const ampm = hours >= 12 ? "PM" : "AM";
        let displayHour = hours % 12;
        if (displayHour === 0) displayHour = 12;

        const formattedMinutes = minutes.toString().padStart(2, "0");

        result += ` , ${displayHour}:${formattedMinutes} ${ampm}`;
    }

    return result;
}