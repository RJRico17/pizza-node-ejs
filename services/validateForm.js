export function validateForm(data) {
    const errors = [];
    if (!data.fname || data.fname.trim() === "") {
        errors.push("First name required.");
    }
    if (!data.lname || data.lname.trim() === "") {
        errors.push("Last name required.");
    }
    if (!data.email || data.email.trim() === "" || data.email.indexOf("@") === -1 || data.email.indexOf('.') === -1) {
        errors.push("Email is missing or invalid.");
    }
    if (!data.method) {
        errors.push("Select Pickup or Delivery.");
    }   else {
        const validOptions = ["pickup","delivery"];
        if (!validOptions.includes(data.method)) {
            errors.push("Suck it hacker");
        }
    }
    if (!data.size) {
        errors.push("Select Size.");
    }   else {
        const validOptions = ["small","med","large"];
        if (!validOptions.includes(data.method)) {
            errors.push("Suck it hacker");
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    }
}