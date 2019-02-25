import React, { useRef, Component } from "react";
import File from "./File.jsx";

var self;

class DragAndDrop extends React.Component {

  constructor(props) {
    super(props);
    self = this;
    this.dropRef = React.createRef();
    this.dragCounter = 0;
  }

  setUpDragEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDragIn = (event) => {
    self.setUpDragEvent(event);
    this.dragCounter++;
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      // this.setState({dragging: true});
      this.props.onHandleDragIn();
    }
  }

  handleDragOut = (event) => {
    self.setUpDragEvent(event);
    this.dragCounter--;
    if (this.dragCounter > 0) return
    this.props.onHandleDragOut();
  }

  handleDrag(event) {
    self.setUpDragEvent(event);
    console.log("handle drag");
  }

  handleDrop = (event) => {
    self.setUpDragEvent(event);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      console.log("HERE HANDLEDROP");
      this.props.onHandleDrop(event.dataTransfer.files);
      event.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  }
  
  componentDidMount() {
    const dragAndDropDiv = this.dropRef.current;
    dragAndDropDiv.addEventListener('dragenter', this.handleDragIn);
    dragAndDropDiv.addEventListener('dragleave', this.handleDragOut);
    dragAndDropDiv.addEventListener('dragover', this.handleDrag);
    dragAndDropDiv.addEventListener('drop', this.handleDrop);
  }

  componentWillUnmount() {
    const dragAndDropDiv = this.dropRef.current;
    dragAndDropDiv.removeEventListener('dragenter', this.handleDragIn);
    dragAndDropDiv.removeEventListener('dragleave', this.handleDragOut);
    dragAndDropDiv.removeEventListener('dragover', this.handleDrag);
    dragAndDropDiv.removeEventListener('drop', this.handleDrop);
  }

  // addHoverCSS = () => {
  //   console.log("add");
  //   $(".dragAndDropOverlay").addClass("onHoverTransition");
  // }

  // removeHoverCSS = () => {
  //   console.log("remove");
  //   $(".dragAndDropOverlay").removeClass("onHoverTransition");
  // }

  render() {
    if (this.props.files.length != 0) {
      var listOfFiles = this.props.files.map((item, index) => {
        return <File text={item.fileName} onDownloadClick={this.props.downloadFile} onRemoveClick={this.props.removeFile} key={index} />
      });
    }

    return (
      <div ref={this.dropRef} className="dragAndDrop">
        Drag & Drop Files
        {this.props.dragging ? <div className="dragAndDropOverlay"> Drop to upload! </div> : null }

        <section id="filesSection">
          {listOfFiles}
        </section>

      </div>
    )
  }
}

export default DragAndDrop;