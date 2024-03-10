export function setStorage(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}
export function getStorage() {
    const u = localStorage.getItem("currentUser");
    if (!u)
        return null;
    return JSON.parse(u);
}
export function removeStorage() { 
    localStorage.removeItem("currentUser")
}