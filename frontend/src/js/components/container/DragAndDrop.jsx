import React, { useRef, Component } from "react";

var self;

class DragAndDrop extends React.Component {

  constructor(props) {
    super(props);
    self = this;
    this.dropRef = React.createRef();
    this.dragCounter = 0;
  }

  componentDidMount() {
  }

  setUpDragEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDragIn = (event) => {
    self.setUpDragEvent(event);
    console.log("handle drag in ");
    this.dragCounter++;
    console.log("dragCounter: ", this.dragCounter);
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      this.setState({dragging: true});
    }
  }

  handleDragOut = (event) => {
    self.setUpDragEvent(event);
    console.log("handle drag out");
    this.dragCounter--;
    console.log("dragCounter: ", this.dragCounter);
    this.setState({dragging: false});
  }

  handleDrag(event) {
    self.setUpDragEvent(event);
    console.log("handle drag");
  }

  handleDrop(event) {
    self.setUpDragEvent(event);
    console.log("handle drag drop");
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

  render() {
    return (
      <div ref={this.dropRef} className="dragAndDrop">
        <h1> drag and drop area </h1>
      </div>
    )
  }
}

export default DragAndDrop;