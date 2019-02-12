import React, { Component } from "react";
import ReactDOM from "react-dom";
import CopyPaste from "./CopyPaste.jsx";
import File from "./File.jsx";
import '../../../css/styles.css';

var isTimeOutSet = false;
var myTimerEvent;
var self;

var backendUrl = "http://127.0.0.1:5000"; //  "http://87e49e41.ngrok.io" // 

class App extends React.Component {

  constructor(props) {
    super(props);
    self = this;
    this.state = {
      error: null,
      jsonData: [],
      copyPasteArea: "",
      files: []
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
    location.replace(backendUrl + /files/ + fileName + "/download");
  }

  uploadFile() {
    // note: by not adding multipart for form the browser can calculate the boundary itself
    fetch(backendUrl + "/files/upload", {
      method: 'POST',
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

  removeFile(fileName) {
    fetch(backendUrl + "/files/" + fileName + "/remove", {
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

  render() {

    if (this.state.files.length != 0) {
      var listOfFiles = this.state.files.map((item, index) => {
        return <File text={item.fileName} onDownloadClick={this.downloadFile} onRemoveClick={this.removeFile} key={index} />
      });
    }

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

        <section id="filesSection">
          Files:
          {listOfFiles}
        </section>

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