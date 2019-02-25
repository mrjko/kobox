import React, { Component } from "react";
import ReactDOM from "react-dom";
import CopyPaste from "./CopyPaste.jsx";
import DragAndDrop from "./DragAndDrop.jsx";
import '../../../css/styles.css';

var isTimeOutSet = false;
var myTimerEvent;
var self;

var backendUrl = "http://2b4fc446.ngrok.io"; //"http://127.0.0.1:5000";

class App extends React.Component {

  constructor(props) {
    super(props);
    self = this;
    this.state = {
      error: null,
      jsonData: [],
      copyPasteArea: "",
      files: [],
      dragging: false,
    };    
  }

  componentDidMount() {
    console.log("componentDidMount in App.jsx");
    fetch(backendUrl + "/copyPaste")
    .then((res) => res.json())
    .then((data) => {
      this.setState({ 
        copyPasteArea: data.text
      })
    });

    fetch(backendUrl + "/files")
    .then((res) => res.json())
    .then((data) => {
      this.setState({ 
        files: data
      })
    });
  }

  handleClick(message) {
    $("#copyPasteTarget").val(message);
  }

  copyToClipBoard() {
    fetch(backendUrl + "/copyPaste")
    .then((res) => res.json())
    .then((data) => {
      self.setState({ 
        copyPasteArea: data.text
      });
    });
    $("#copyPasteTarget").select();
    document.execCommand("copy"); 
  }

  downloadFile(fileName) {
    location.replace(backendUrl + /files/ + fileName);
  }

  uploadFile() {
    // note: by not adding multipart for form the browser can calculate the boundary itself
    fetch(backendUrl + "/files/upload", {
      method: 'PUT',
      body: new FormData(document.querySelector('#uploadForm'))
    })
    .then(() => {
      fetch(backendUrl + "/files")
      .then((res) => res.json())
      .then((data) => {
        self.setState({ 
          files: data
        })
      });
    });
  }

  uploadFileDrag(file) {
    let formData = new FormData();
    formData.append('uploadFile', file);

    fetch(backendUrl + "/files/upload", {
      method: 'PUT',
      mode: 'cors',
      body: formData
    })
    .then(() => {
      fetch(backendUrl + "/files")
      .then((res) => res.json())
      .then((data) => {
        self.setState({ 
          files: data
        })
      });
    });
  }

  removeFile(fileName) {
    fetch(backendUrl + "/files/" + fileName, {
      method: 'DELETE'
    })
    .then(() => {
      fetch(backendUrl + "/files")
      .then((res) => res.json())
      .then((data) => {
        self.setState({ 
          files: data
        })
      })
    });
  }

  updateCopyPasteText() {
    var self = this;
    console.log("updating copy paste text");
    if (isTimeOutSet) {
      $("#copyPasteBtn").attr("disabled", true);
      console.log("cancelled existing because modified");
      clearTimeout(myTimerEvent)
      myTimerEvent = setTimeout(function() {
        fetch(backendUrl + "/copyPaste", {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify({text: $("#copyPasteTarget").val()})
        });
        console.log("done updating");
        $("#copyPasteBtn").attr("disabled", false);
        isTimeOutSet = false;
      }, 2000);
    } else {
      isTimeOutSet = true;
      myTimerEvent = setTimeout(function() {
       fetch(backendUrl + "/copyPaste", {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify({text: $("#copyPasteTarget").val()})
        });
        console.log("done updating");
        isTimeOutSet = false;
      }, 2000);
    }
  }

  onHandleDragIn() {
    console.log("onhandledragin");
    self.setState({dragging: true});
  }

  onHandleDragOut() {
    console.log("onhandledragout");
    self.setState({dragging: false});
  }

  onHandleDrag() {
    console.log("onhandledrag");

  }

  onHandleDrop(files) {
    console.log("onhandledrop");
    self.setState({dragging: false});
    console.log("files", files);
    Array.from(files).forEach(file => { 
      self.uploadFileDrag(file);
    });
  }

  render() {

    var copyPasteString = this.state.copyPasteArea;
    $("#copyPasteTarget").val(copyPasteString);

    return (
      <section>
        <section id="copyPasteSection">
        Copy Paste Texts: 
        {/* <table id="copyPasteTable">
          <tbody>
            {copyPasteItems}
          </tbody>
        </table> */}
        <textarea id="copyPasteTarget" onChange={this.updateCopyPasteText}></textarea>
        <button id="copyPasteBtn" onClick={this.copyToClipBoard}>Fetch & Copy!</button>
        </section>

        <DragAndDrop dragging={this.state.dragging}
            onHandleDragIn={this.onHandleDragIn} onHandleDragOut={this.onHandleDragOut}
            onHandleDrag={this.onHandleDrag}  onHandleDrop={this.onHandleDrop}
            files={this.state.files} downloadFile={this.downloadFile}
            removeFile={this.removeFile}
        >
        </DragAndDrop>

        <form id="uploadForm" action="http://localhost:5000/files/upload" target="_blank" method="post" encType="multipart/form-data">
            <input type="file" name="uploadFile" multiple/>
            <input type="button" onClick={this.uploadFile} value="Upload File" name="submit"/>
        </form>

      </section>
    )
  }
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : false;
export default App;