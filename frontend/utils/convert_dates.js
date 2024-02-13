export function convertAge(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export function getElapsedTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const elapsedMilliseconds = now - date;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);
    const elapsedMonths = Math.floor(elapsedDays / 30);
    const elapsedYears = Math.floor(elapsedDays / 365);

    if (elapsedYears > 0) {
        return { value: elapsedYears, unit: "year" };
    } else if (elapsedMonths > 0) {
        return { value: elapsedMonths, unit: "month" };
    } else if (elapsedDays > 0) {
        return { value: elapsedDays, unit: "day" };
    } else if (elapsedHours > 0) {
        return { value: elapsedHours, unit: "h" };
    } else if (elapsedMinutes > 0) {
        return { value: elapsedMinutes, unit: "m" };
    } else {
        return { value: elapsedSeconds, unit: "s" };
    }
}


