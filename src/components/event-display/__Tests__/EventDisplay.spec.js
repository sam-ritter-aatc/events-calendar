import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import EventDisplay from "../EventDisplay";
import axios from 'axios';
// import getAuthTokens from '../../../utils/WildApricotOAuthUtils';
import {makeUser} from '../../../__Test-Utils__/ContactData';
import {makeAToken} from "../../../__Test-Utils__/TokenData";
import {makeEventInfoForProps_NonRecurring} from "../../../__Test-Utils__/EventData";

Enzyme.configure({ adapter: new Adapter()});

jest.mock('axios');
jest.mock('../../../utils/WildApricotOAuthUtils');

// beforeEach(() => {
//     getAuthTokens.mockImplementationOnce(() => Promise.resolve(makeAToken()));
// });
//
describe('eventDisplay should appear as expected', () => {
   it('renders without props - no button', () => {
      const display = shallow(<EventDisplay props={{
         location: {
            state: {
               member: makeUser(131369, true),
               eventInfo: makeEventInfoForProps_NonRecurring()
            }
         }
      }}
      />)
      expect(display.exists()).toBe(true);
   });
   it('edit button should appear for admin user', () => {

   });

   it('edit button should appear for event organizer', () => {

   });

   it('edit button should NOT appear for non-admin non-organizer of event',() => {

   })
});
