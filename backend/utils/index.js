// YYYY-MM-DD
export const  isDateValid = (dateStr) => {
    return !isNaN(new Date(dateStr));
}

//HH:MM
export const isValidTime = (str) => {
    let regex = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d)$/);

    if (!str) return false

    if (!regex.test(str)) return false

    return true

}