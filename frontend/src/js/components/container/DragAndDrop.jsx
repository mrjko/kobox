import React, { useRef, Component } from "react";

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
    console.log("handle drag in ");
    this.dragCounter++;
    console.log("dragCounter: ", this.dragCounter);
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      // this.setState({dragging: true});
      this.props.onHandleDragIn();
    }
  }

  handleDragOut = (event) => {
    self.setUpDragEvent(event);
    console.log("handle drag out");
    this.dragCounter--;
    if (this.dragCounter > 0) return
    this.props.onHandleDragOut();
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

  addHoverCSS = () => {
    console.log("add");
    $(".dragAndDrop").addClass("onHoverTransition");
  }

  removeHoverCSS = () => {
    console.log("remove");
    $(".dragAndDrop").removeClass("onHoverTransition");
  }

// refactor files list under here
  render() {
    console.log(self);
    return (
      <div ref={this.dropRef} className="dragAndDrop">
        {this.props.dragging ? self.addHoverCSS() : self.removeHoverCSS() }
      </div>
    )
  }
}

export default DragAndDrop;