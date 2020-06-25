import  {isAdmin, getContact}  from '../WildApricotContacts';
import axios from 'axios';
import {makeAToken} from "../../__Test-Utils__/TokenData";

jest.mock('axios');

describe('checks FieldValues in contact for admin access', () => {

    it('should return contact as not admin', async () => {
        let data = makeData(NoAdminValue.FieldValues);
        axios.get.mockImplementationOnce(() => Promise.resolve(data));
        let contact = null;
        await getContact(makeAToken(), 1234, (data) => {contact = Object.assign({},data)} );
        console.log(contact);
        expect(contact.isAdmin).toBeFalsy();
    })

    it('should return contact as admin', async () => {
        let data = makeData(HasAdminValue.FieldValues);
        axios.get.mockImplementationOnce(() => Promise.resolve(data));
        let contact = null;
        await getContact(makeAToken(), 1234, (data) => {contact = Object.assign({},data)} );
        console.log(contact);
        expect(contact.isAdmin).toBeTruthy();
    })
});



const makeData = (fields) => {
    return {
        data: {
            FirstName: 'Jon',
            LastName: 'Doe',
            DisplayName: 'Doe, Jon',
            Email: 'jon.doe@nowhere.org',
            FieldValues: fields
        }
    }
}


const NoAdminValue = {
    "FieldValues": [
        {
            "FieldName": "Archived",
            "Value": false,
            "SystemCode": "IsArchived"
        },
        {
            "FieldName": "Donor",
            "Value": false,
            "SystemCode": "IsDonor"
        },
        {
            "FieldName": "Event registrant",
            "Value": true,
            "SystemCode": "IsEventAttendee"
        },
        {
            "FieldName": "Member",
            "Value": true,
            "SystemCode": "IsMember"
        },
        {
            "FieldName": "Suspended member",
            "Value": false,
            "SystemCode": "IsSuspendedMember"
        },
        {
            "FieldName": "Event announcements",
            "Value": true,
            "SystemCode": "ReceiveEventReminders"
        },
        {
            "FieldName": "Member emails and newsletters",
            "Value": true,
            "SystemCode": "ReceiveNewsletters"
        },
        {
            "FieldName": "Email delivery disabled",
            "Value": false,
            "SystemCode": "EmailDisabled"
        },
        {
            "FieldName": "Receiving emails disabled",
            "Value": false,
            "SystemCode": "RecievingEMailsDisabled"
        },
        {
            "FieldName": "Balance",
            "Value": 0.0000,
            "SystemCode": "Balance"
        },
        {
            "FieldName": "Total donated",
            "Value": 0.0000,
            "SystemCode": "TotalDonated"
        },
        {
            "FieldName": "Registered for specific event",
            "Value": null,
            "SystemCode": "RegistredForEvent"
        },
        {
            "FieldName": "Profile last updated",
            "Value": "2019-04-22T19:55:27-04:00",
            "SystemCode": "LastUpdated"
        },
        {
            "FieldName": "Profile last updated by",
            "Value": 10446434,
            "SystemCode": "LastUpdatedBy"
        },
        {
            "FieldName": "Creation date",
            "Value": "2013-07-15T07:39:17-04:00",
            "SystemCode": "CreationDate"
        },
        {
            "FieldName": "Last login date",
            "Value": "2020-06-16T19:06:56-04:00",
            "SystemCode": "LastLoginDate"
        },
        {
            "FieldName": "Administrator role",
            "Value": [],
            "SystemCode": "AdminRole"
        },
        {
            "FieldName": "Notes",
            "Value": "\nRenewal processed on 22 Dec 2014 from 01 Jan 2015 until 01 Jan 2016\n\nRenewal processed on 02 Dec 2015 from 01 Jan 2016 until 01 Jan 2017\n\nRenewal processed on 10 Dec 2016.\nMembership is effective from 01 Jan 2017 until 01 Jan 2018\n\nRenewal processed on 08 Mar 2018.\nMembership is effective from 01 Apr 2018 until 01 Apr 2019\n\nRenewal processed on 08 Mar 2019.\nMembership is effective from 01 Apr 2019 until 01 Apr 2020\n\nRenewal processed on 07 Mar 2020.\nMembership is effective from 01 Apr 2020 until 01 Apr 2021",
            "SystemCode": "Notes"
        },
        {
            "FieldName": "Terms of use accepted",
            "Value": true,
            "SystemCode": "SystemRulesAndTermsAccepted"
        },
        {
            "FieldName": "Subscription source",
            "Value": [],
            "SystemCode": "SubscriptionSource"
        },
        {
            "FieldName": "User ID",
            "Value": 10446434,
            "SystemCode": "MemberId"
        },
        {
            "FieldName": "First name",
            "Value": "Samuel",
            "SystemCode": "FirstName"
        },
        {
            "FieldName": "Last name",
            "Value": "Ritter",
            "SystemCode": "LastName"
        },
        {
            "FieldName": "Organization",
            "Value": "",
            "SystemCode": "Organization"
        },
        {
            "FieldName": "e-Mail",
            "Value": "annandsamritter@gmail.com",
            "SystemCode": "Email"
        },
        {
            "FieldName": "Phone",
            "Value": "734-604-4820",
            "SystemCode": "Phone"
        },
        {
            "FieldName": "DOB",
            "Value": "2/11/63",
            "SystemCode": "custom-2691406"
        },
        {
            "FieldName": "Member role",
            "Value": null,
            "SystemCode": "MemberRole"
        },
        {
            "FieldName": "Member since",
            "Value": "2013-07-13T20:00:00-04:00",
            "SystemCode": "MemberSince"
        },
        {
            "FieldName": "Renewal due",
            "Value": "2021-04-01T00:00:00",
            "SystemCode": "RenewalDue"
        },
        {
            "FieldName": "Membership level ID",
            "Value": 245231,
            "SystemCode": "MembershipLevelId"
        },
        {
            "FieldName": "Access to profile by others",
            "Value": true,
            "SystemCode": "AccessToProfileByOthers"
        },
        {
            "FieldName": "Renewal date last changed",
            "Value": "2020-03-07T08:38:14-05:00",
            "SystemCode": "RenewalDateLastChanged"
        },
        {
            "FieldName": "Level last changed",
            "Value": "2017-11-03T23:30:05-04:00",
            "SystemCode": "LevelLastChanged"
        },
        {
            "FieldName": "Bundle ID",
            "Value": null,
            "SystemCode": "BundleId"
        },
        {
            "FieldName": "Membership status",
            "Value": {
                "Id": 1,
                "Label": "Active",
                "Value": "Active",
                "SelectedByDefault": false,
                "Position": 0
            },
            "SystemCode": "Status"
        },
        {
            "FieldName": "Membership enabled",
            "Value": true,
            "SystemCode": "MembershipEnabled"
        },
        {
            "FieldName": "Group participation",
            "Value": [],
            "SystemCode": "Groups"
        },
        {
            "FieldName": "Bio",
            "Value": "Working on my cycling this year. - Cycling is my meditation and I have close access to dirt roads.   Also like the trails these days...\r\n\r\nI've done 2 Ironman races(Madison 2012 and Mont Tremblant 2014)  The Goofy Challenge, and many half marathons.",
            "SystemCode": "custom-2676630"
        },
        {
            "FieldName": "Address",
            "Value": "1373 Middlewood Dr.",
            "SystemCode": "custom-2676625"
        },
        {
            "FieldName": "City",
            "Value": "Saline",
            "SystemCode": "custom-2676626"
        },
        {
            "FieldName": "State",
            "Value": {
                "Id": 1864923,
                "Label": "MI"
            },
            "SystemCode": "custom-2679531"
        },
        {
            "FieldName": "Zip Code",
            "Value": "48176",
            "SystemCode": "custom-2679532"
        },
        {
            "FieldName": "Waiver",
            "Value": true,
            "SystemCode": "custom-2676685"
        },
        {
            "FieldName": "USAT Member?",
            "Value": {
                "Id": 2089731,
                "Label": "YES"
            },
            "SystemCode": "custom-2886266"
        },
        {
            "FieldName": "USAT Membership Number",
            "Value": "2065080979",
            "SystemCode": "custom-2886267"
        },
        {
            "FieldName": "Gender",
            "Value": {
                "Id": 2790665,
                "Label": "M"
            },
            "SystemCode": "custom-3225771"
        },
        {
            "FieldName": "Emergency Contact Name",
            "Value": "Annie Ritter",
            "SystemCode": "custom-10111632"
        },
        {
            "FieldName": "Emergency Contact Phone",
            "Value": "734 730 9750",
            "SystemCode": "custom-10111633"
        }
    ]
};

const HasAdminValue = {
    "FieldValues": [
        {
            "FieldName": "Archived",
            "Value": false,
            "SystemCode": "IsArchived"
        },
        {
            "FieldName": "Donor",
            "Value": false,
            "SystemCode": "IsDonor"
        },
        {
            "FieldName": "Event registrant",
            "Value": true,
            "SystemCode": "IsEventAttendee"
        },
        {
            "FieldName": "Member",
            "Value": true,
            "SystemCode": "IsMember"
        },
        {
            "FieldName": "Suspended member",
            "Value": false,
            "SystemCode": "IsSuspendedMember"
        },
        {
            "FieldName": "Event announcements",
            "Value": true,
            "SystemCode": "ReceiveEventReminders"
        },
        {
            "FieldName": "Member emails and newsletters",
            "Value": true,
            "SystemCode": "ReceiveNewsletters"
        },
        {
            "FieldName": "Email delivery disabled",
            "Value": false,
            "SystemCode": "EmailDisabled"
        },
        {
            "FieldName": "Receiving emails disabled",
            "Value": false,
            "SystemCode": "RecievingEMailsDisabled"
        },
        {
            "FieldName": "Balance",
            "Value": 0.0000,
            "SystemCode": "Balance"
        },
        {
            "FieldName": "Total donated",
            "Value": 0.0000,
            "SystemCode": "TotalDonated"
        },
        {
            "FieldName": "Registered for specific event",
            "Value": null,
            "SystemCode": "RegistredForEvent"
        },
        {
            "FieldName": "Profile last updated",
            "Value": "2019-03-07T10:48:45-05:00",
            "SystemCode": "LastUpdated"
        },
        {
            "FieldName": "Profile last updated by",
            "Value": null,
            "SystemCode": "LastUpdatedBy"
        },
        {
            "FieldName": "Creation date",
            "Value": "2016-01-05T18:59:23-05:00",
            "SystemCode": "CreationDate"
        },
        {
            "FieldName": "Last login date",
            "Value": "2020-06-15T11:35:06-04:00",
            "SystemCode": "LastLoginDate"
        },
        {
            "FieldName": "Administrator role",
            "Value": [
                {
                    "Id": 256,
                    "Label": "Account administrator (Full access)"
                }
            ],
            "SystemCode": "AdminRole"
        },
        {
            "FieldName": "Notes",
            "Value": "\nRenewal processed on 20 Dec 2016.\nMembership is effective from 01 Jan 2017 until 01 Jan 2018\n\nRenewal processed on 07 Mar 2018.\nMembership is effective from 01 Apr 2018 until 01 Apr 2019\n\nRenewal processed on 07 Mar 2019.\nMembership is effective from 01 Apr 2019 until 01 Apr 2020\n\nRenewal processed on 08 Mar 2020.\nMembership is effective from 01 Apr 2020 until 01 Apr 2021",
            "SystemCode": "Notes"
        },
        {
            "FieldName": "Terms of use accepted",
            "Value": true,
            "SystemCode": "SystemRulesAndTermsAccepted"
        },
        {
            "FieldName": "Subscription source",
            "Value": [],
            "SystemCode": "SubscriptionSource"
        },
        {
            "FieldName": "User ID",
            "Value": 31120971,
            "SystemCode": "MemberId"
        },
        {
            "FieldName": "First name",
            "Value": "Randy",
            "SystemCode": "FirstName"
        },
        {
            "FieldName": "Last name",
            "Value": "Schwemmin",
            "SystemCode": "LastName"
        },
        {
            "FieldName": "Organization",
            "Value": "",
            "SystemCode": "Organization"
        },
        {
            "FieldName": "e-Mail",
            "Value": "randy@schwemmin.com",
            "SystemCode": "Email"
        },
        {
            "FieldName": "Phone",
            "Value": "650-346-8792",
            "SystemCode": "Phone"
        },
        {
            "FieldName": "DOB",
            "Value": "12/28/1973",
            "SystemCode": "custom-2691406"
        },
        {
            "FieldName": "Member role",
            "Value": null,
            "SystemCode": "MemberRole"
        },
        {
            "FieldName": "Member since",
            "Value": "2016-01-03T19:00:00-05:00",
            "SystemCode": "MemberSince"
        },
        {
            "FieldName": "Renewal due",
            "Value": "2021-04-01T00:00:00",
            "SystemCode": "RenewalDue"
        },
        {
            "FieldName": "Membership level ID",
            "Value": 245231,
            "SystemCode": "MembershipLevelId"
        },
        {
            "FieldName": "Access to profile by others",
            "Value": true,
            "SystemCode": "AccessToProfileByOthers"
        },
        {
            "FieldName": "Renewal date last changed",
            "Value": "2020-03-08T11:21:27-04:00",
            "SystemCode": "RenewalDateLastChanged"
        },
        {
            "FieldName": "Level last changed",
            "Value": "2017-11-03T23:28:09-04:00",
            "SystemCode": "LevelLastChanged"
        },
        {
            "FieldName": "Bundle ID",
            "Value": null,
            "SystemCode": "BundleId"
        },
        {
            "FieldName": "Membership status",
            "Value": {
                "Id": 1,
                "Label": "Active",
                "Value": "Active",
                "SelectedByDefault": false,
                "Position": 0
            },
            "SystemCode": "Status"
        },
        {
            "FieldName": "Membership enabled",
            "Value": true,
            "SystemCode": "MembershipEnabled"
        },
        {
            "FieldName": "Group participation",
            "Value": [
                {
                    "Id": 85795,
                    "Label": "Board Members"
                }
            ],
            "SystemCode": "Groups"
        },
        {
            "FieldName": "Bio",
            "Value": "",
            "SystemCode": "custom-2676630"
        },
        {
            "FieldName": "Address",
            "Value": "216 West St",
            "SystemCode": "custom-2676625"
        },
        {
            "FieldName": "City",
            "Value": "Howell",
            "SystemCode": "custom-2676626"
        },
        {
            "FieldName": "State",
            "Value": {
                "Id": 1864923,
                "Label": "MI"
            },
            "SystemCode": "custom-2679531"
        },
        {
            "FieldName": "Zip Code",
            "Value": "48843",
            "SystemCode": "custom-2679532"
        },
        {
            "FieldName": "Waiver",
            "Value": true,
            "SystemCode": "custom-2676685"
        },
        {
            "FieldName": "USAT Member?",
            "Value": {
                "Id": 2089731,
                "Label": "YES"
            },
            "SystemCode": "custom-2886266"
        },
        {
            "FieldName": "USAT Membership Number",
            "Value": "552316",
            "SystemCode": "custom-2886267"
        },
        {
            "FieldName": "Gender",
            "Value": {
                "Id": 2790665,
                "Label": "M"
            },
            "SystemCode": "custom-3225771"
        },
        {
            "FieldName": "Emergency Contact Name",
            "Value": "",
            "SystemCode": "custom-10111632"
        },
        {
            "FieldName": "Emergency Contact Phone",
            "Value": "",
            "SystemCode": "custom-10111633"
        }
    ]
};