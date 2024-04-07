export function get_cookie(cookie_name: string): string {
    const c_name         = cookie_name + "=";
    const cookie_decoded = decodeURIComponent(document.cookie);
    const cookie_parts   = cookie_decoded.split(';');

    for (const c of cookie_parts) {
        c.trim();
        if (c.indexOf(c_name) === 0) {
            return c.substring(c_name.length, c.length);
        }
    }
    return "";
}