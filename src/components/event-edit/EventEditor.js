import React, {Component} from 'react';
// import SwitchableTextInput from "../SwitchableTextInput";
import CKEditor from "@ckeditor/ckeditor5-react";
// NOTE: Use the editor from source (not a build)!
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import SwitchableDatePicker from "../SwitchableDatePicker";
import {getAuthTokens} from "../../utils/WildApricotOAuthUtils";
import {getEventById} from "../../utils/WildApricotEvents";
import {getContact} from "../../utils/WildApricotContacts";
import EventDataLoader from "../event-data-loader/EventDataLoader";
// import Essentials from "@ckeditor/ckeditor5-essentials";
// import Bold from "@ckeditor/ckeditor5-basic-styles";
// import Italic from "@ckeditor/ckeditor5-basic-styles";
// import Paragraph from "@ckeditor/ckeditor5-paragraph";

// const editorConfiguration = {
//     // plugins: [Essentials, Bold, Italic, Paragraph],
//     // plugins: [Essentials],
//     // toolbar: ["bold", "italic"]
//     height: '500px',
//     width: '80%'
// };


export default class EventEditor extends Component {
    constructor(props) {
        super(props);
        console.log("INCOMING PROPS", props);

        this.state = {
            isEditing: true,
            // date: props.location.state.eventInfo.date,
            // description: "",
            eventInfo: props.location.state.eventInfo,
            member: props.location.state.member,
            fetch: true
        }
    }

    async componentDidMount() {
        await getAuthTokens((data) => this.setState({waToken: data}));
        console.log("EVENT DETAILS", this.props.location.state);
        this.setState({
            member: this.props.location.state.member,
            eventInfo: this.props.location.state.eventInfo
        })

        console.log("STATE",this.state);
        // recurring event
        if (this.state.eventInfo.event && this.state.fetch) {   // user clicked on an event
            if (this.state.eventInfo.event.extendedProps.parentId && this.state.fetch) {
                await getEventById(this.state.waToken, this.state.eventInfo.event.extendedProps.parentId, (data) => {
                    let e = Object.assign({}, data);
                    // this.setState({fetch: false});
                    console.log("props", this.props);

                    let sess = data.Sessions.filter(x => x.Id === Number(this.state.eventInfo.event.id));
                    console.log("foundSession", sess);
                    if (sess) {
                        e.sessionId = sess[0].Id;
                        e.Name = sess[0].Title;
                        e.StartDate = sess[0].StartDate;
                        e.EndDate = sess[0].EndDate;
                    }
                    console.log("theEvent", e);
                    this.setState({event: e, fetch:false});
                });
            } else {
                await getEventById(this.state.waToken, this.state.eventInfo.event.id, (data) => {
                    this.setState({event: data});
                });
            }
        } else if (this.state.eventInfo.date) {  // user clicked on a date to create event.
            this.setState({
                fetch: false,
                event: {
                    StartDate: new  Date(this.state.eventInfo.date),
                    Details: {
                        DescriptionHtml: ""
                    }
                }
//                date: new Date(this.state.eventInfo.date), fetch: false
            })
        } else {
            this.setState({
                fetch: false,
                event: {
                    Details: {
                        DescriptionHtml: ""
                    }
                }
            });
        }
        console.log('===>state', this.state);

        if (this.state.event && this.state.event.Details && this.state.event.Details.Organizer) {
            await getContact(this.state.waToken, this.state.event.Details.Organizer.Id, (data) => {
                this.setState({organizer: data});
                console.log("=====ORG", data, this.state.organizer);
            });
            console.log("contact", this.state.organizer);
        }
        console.log("state", this.state);
    }

    render() {
        if (this.state.fetch) {
            return <EventDataLoader name={this.props.location.state.name}/>;
        } else {
            return (
                <div className="App">
                    {/*<SwitchableDatePicker label="Date: " editFlag={this.state.isEditing} selected={this.state.event.StartDate} handleChange={this.handleStartChange} />*/}
                    <h2>Description</h2>
                    <CKEditor
                        editor={ ClassicEditor }
                        data={this.state.event.Details.DescriptionHtml}
                        onInit={ editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log( 'Editor is ready to use!', editor );
                        } }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            console.log( { event, editor, data } );
                        } }
                        onBlur={ ( event, editor ) => {
                            console.log( 'Blur.', editor );
                        } }
                        onFocus={ ( event, editor ) => {
                            console.log( 'Focus.', editor );
                        } }
                    />
                </div>
            )
        }

    }

    handleStartChange = async (dt) => {
        await this.setState({date: {...this.state.date, date: dt}});
    }

}

