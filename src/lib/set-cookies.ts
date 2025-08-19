"use client"
import {
    getCookie,
    setCookie,
    deleteCookie,
    hasCookie,
    useGetCookie,
    useSetCookie,
    useDeleteCookie,
    useHasCookie
} from "cookies-next/client";

/**
 * Sets a cookie with the given key and value.
 * Optionally, you can pass configuration options such as
 * `expires`, `path`, `secure`, etc.
 * 
 * Why use this?  
 * To save small bits of data on the client that persist across page reloads,
 * like UI preferences, authentication tokens, or session info.
 * 
 * @param key - cookie name
 * @param value - cookie value
 * @param options - optional cookie configuration (e.g., expires, path)
 */
interface Options {
    path: string,
    maxAge: number, // 7 days by default
    sameSite: boolean | "lax" | "strict" | "none" | undefined,
}
export function setCookieFun(
    key: string,
    value: string | boolean,
    options: Options = {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days by default
        sameSite: 'lax',
    }
) {
    setCookie(key, value, options);
}
/**
 * Retrieves the value of a cookie by its key.
 * 
 * Why use this?  
 * To read stored cookie data on the client, e.g., to check user preferences or
 * authentication state.
 * 
 * @param key - cookie name
 * @returns the cookie value or undefined if not found
 */
export function getCookieFun(key: string) {
    return getCookie(key);
}

/**
 * Checks if a cookie with the given key exists.
 * 
 * Why use this?  
 * Useful when you want to verify the presence of certain cookies before
 * proceeding (e.g., user session cookie).
 * 
 * @param key - cookie name
 * @returns true if cookie exists, false otherwise
 */
export function hasCookieFun(key: string) {
    return hasCookie(key);
}

/**
 * Deletes a cookie by its key.
 * 
 * Why use this?  
 * When you want to clear sensitive data or reset user preferences on logout
 * or other state changes.
 * 
 * @param key - cookie name
 */
export function deleteCookieFun(key: string) {
    deleteCookie(key);
}

/**
 * React hook to get a cookie value.
 * Useful inside React components for reactive state management.
 */
export const useGetCookieFun = useGetCookie;

/**
 * React hook to set a cookie.
 * Useful inside React components.
 */
export const useSetCookieFun = useSetCookie;

/**
 * React hook to delete a cookie.
 * Useful inside React components.
 */
export const useDeleteCookieFun = useDeleteCookie;

/**
 * React hook to check if a cookie exists.
 * Useful inside React components.
 */
export const useHasCookieFun = useHasCookie;
