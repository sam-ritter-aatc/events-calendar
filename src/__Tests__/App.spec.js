// import React from 'react';
// import ReactDOM from 'react-dom';
// import { mount } from 'enzyme';
// import { MemoryRouter } from 'react-router';
// import App from './App';
//
// jest.mock('firebase/app');

//
// describe('app rendering/navigating', () => {
//     test('invalid path should redirect to 404', () => {
//         const wrapper = mount(
//             <MemoryRouter initialEntries={[ '/random' ]}>
//                 <App/>
//             </MemoryRouter>
//         );
//         expect(wrapper.find(LandingPage)).toHaveLength(0);
//         expect(wrapper.find(NotFoundPage)).toHaveLength(1);
//     });
// });