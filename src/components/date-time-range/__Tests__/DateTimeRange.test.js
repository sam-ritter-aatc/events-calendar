import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import {act, scryRenderedDOMComponentsWithTag} from "react-dom/test-utils";
//import {shallow } from '../../../enzyme';

import DateTimeRange from "../DateTimeRange";

    // startDateHandler(date) {
    //     console.log("CreatorState-start", this.state);
    //     this.setState({event: {...this.state.event, StartDate: date}});
    // }
    //
    // endDateHandler(date) {
    //     console.log("CreatorState-end", this.state);
    //     this.setState({event: {...this.state.event, EndDate: date}});
    // }
describe('DateTimeRange tests', () => {

    let container = null;
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove;
        container = null;
    });

    it("renders date component - null data", async () => {
        act(() => {
            render(<DateTimeRange />, container);
        });
    });

    it("DateTimeRange is correct with null dates in constructor", () => {
        let props = {
            dateLabel: "Event Date: ",
            startLabel: "Start Time: ",
            endLabel: "End Time: ",
            startDate: null,
            endDate: null
        }
        let dtr = new DateTimeRange(props);
        expect(dtr.state.startDate).toEqual(null);
        expect(dtr.state.endDate).toEqual(null);
        expect(dtr.state.maxDate).toEqual(null);
        expect(dtr.state.minDate).toEqual(null);
    });

    // it("DateTimeRange is correct with a select dates in constructor", () => {
    //     let date = new Date();
    //     let props = {
    //         dateLabel: "Event Date: ",
    //         startLabel: "Start Time: ",
    //         endLabel: "End Time: ",
    //         startDate: new  Date(new Date(date).setHours(8,0,0)),
    //         endDate: new  Date(new Date(date).setHours(20,0,0))
    //     }
    //     let dtr = new DateTimeRange(props);
    //     expect(dtr.state.startDate).toEqual(null);
    //     expect(dtr.state.endDate).toEqual(null);
    //     expect(dtr.state.maxDate).toEqual(null);
    //     expect(dtr.state.minDate).toEqual(null);
    // });
//
//     it("renders dateTimeRange e create", () => {
//         let startDate = null;
//         let endDate = null;
//         const wrapper = shallow(
//             <DateTimeRange dateLabel="Event Date: "
//                            startLabel="Start Time: "
//                            endLabel="End Time: "
//                            startDate={startDate}
//                            endDate={endDate}
//                            // onChangeStartDate={this.startDateHandler}
//                            // onChangeEndDate={this.endDateHandler}
//             />
//         );
//         expect(wrapper.contains(<label>Event Date: </label>)).toBeTruthy();
//         // expect(wrapper.contains(<input type="text" placeholder="Click to select a date" class value>)).toBeTruthy();
// //        expect(wrapper.find('.dateTimeRangeSelector-date').get(0).props.children).toEqual('Click to select');
//         // expect(wrapper.find('.dateTimeRangeSelector-start'))
//         // expect(wrapper.find('.dateTimeRangeSelector-end'))
//     });
})
