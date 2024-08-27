
export const normalizeDateInput = (input) => {

    if (input instanceof Date) {
        return input;
    }

    const date = new Date(input);
    if (isNaN(date)) {
        console.error("Unable to parse date:", input);
        return null;
    }

    return date;
};


export const getWeekOfMonth = (input) => {
    const date = normalizeDateInput(input);
    if (!date) {
        console.error("Invalid Date object in getWeekOfMonth:", input);
        return "Invalid Date";
    }

    const dayOfMonth = date.getDate();
    const week = Math.ceil(dayOfMonth / 7);
    return `Week ${week}`;
};


export const numberWeekOfMonth = (input) => {
    const date = normalizeDateInput(input);
    if (!date) {
        console.error("Invalid Date object in numberWeekOfMonth:", input);
        return "Invalid Date";
    }

    const dayOfMonth = date.getDate();
    const week = Math.ceil(dayOfMonth / 7);
    return week;
};


export const getMonthYear = (input) => {
    const date = normalizeDateInput(input);
    if (!date) {
        console.error("Invalid Date object in getMonthYear:", input);
        return "Invalid Date";
    }

    const month = date.toLocaleString('default', { month: "long" });
    const year = date.getFullYear();
    return `${month} ${year}`;
};