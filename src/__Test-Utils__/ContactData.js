export const makeUser = (id,admin) => {
    let e = {};

    e.id = id;
    e.firstName = 'jon';
    e.lastName = 'doe';
    e.email = 'jdoe@nowhere.org';
    e.displayName = 'doe, jon';
    e.isAdmin = admin;

    return e;
}