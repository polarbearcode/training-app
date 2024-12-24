/** Define object properties for data pulled from database. */

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    accessToken?: string;
};
