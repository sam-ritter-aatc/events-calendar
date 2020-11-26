import {makeBaseUrl, axiosCall} from "./WildApricotUtils";

export const getContact = async (contactId, cb) => {
    await axiosCall('GET', makeBaseUrl() + '/contacts/' + contactId, null, (result => convertContactData(result, cb)));
}

const convertContactData = async (data, cb) => {
    let e = {};

    e.id = data.Id;
    e.firstName = data.FirstName;
    e.lastName = data.LastName;
    e.email = data.Email;
    e.displayName = data.DisplayName;
    e.isAdmin = isAdmin(data.FieldValues);
    e.url = data.Url;

    cb(e);
}
const isAdmin = (fields) => {
    let adminField = fields.filter(x => x.SystemCode === 'AdminRole');
    return adminField.length>0 && adminField[0].Value.length > 0;
}