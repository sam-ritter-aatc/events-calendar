import React, {Component} from 'react';
// import {getAuthTokens} from "../../utils/WildAppricotOAuthUtils";
// import {getEventById} from "../../utils/WildApricotEvents";
// import SwitchableTextInput from "../SwitchableTextInput";
import CKEditor from "@ckeditor/ckeditor5-react";
// NOTE: Use the editor from source (not a build)!
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SwitchableDatePicker from "../SwitchableDatePicker";
// import Essentials from "@ckeditor/ckeditor5-essentials";
// import Bold from "@ckeditor/ckeditor5-basic-styles";
// import Italic from "@ckeditor/ckeditor5-basic-styles";
// import Paragraph from "@ckeditor/ckeditor5-paragraph";

// const editorConfiguration = {
//     // plugins: [Essentials, Bold, Italic, Paragraph],
//     plugins: [Essentials],
//     toolbar: ["bold", "italic"]
// };


export default class EventEditor extends Component {
    constructor(props) {
        super(props);
        console.log("INCOMING PROPS", props);

        this.state = {
            isEditing: true,
            date: props.location.state.eventInfo.date,
            description: ""
        }
    }

    // componentDidMount() {
    //     console.log("INCOMING DATE", this.props);
    //     this.setState({date: this.props.location.state.date});
    //
    //     console.log("STATE", this.state);
    // }

    render() {

        return (
            <div className="App">
                <SwitchableDatePicker label="Date: " editFlag={this.state.isEditing} selected={this.state.date} handleChange={this.handleStartChange} start={this.state.date} end={this.state.date}/>
                <h2>Description</h2>
                <CKEditor
                    editor={ ClassicEditor }
                    data="<p>Hello, csharp corner!</p><br/><br/> <b>This is demo for ckeditor 5 with React</br>"
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

    handleStartChange = async (dt) => {
        await this.setState({date: {...this.state.date, date: dt}});
    }

}

