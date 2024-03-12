const FormatNumber = (num) => {
    const str = num.toString();
    const reversed = str.split("").reverse().join("");
    const formatted = reversed.replace(/(\d{3})(?=\d)/g, "$1.");
    return formatted.split("").reverse().join("");
}
export default FormatNumber;