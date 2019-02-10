import React, { useRef, Component } from "react";

class CopyPaste extends React.Component {
  
  copyToClipBoard() {
    console.log("copy the clicked text to clipboard:", this.props.text);
    var message = this.props.text;
    this.props.onClick(message);
  }

  render() {
    return (
      <tr>
        <td className="copyPasteText" onClick={this.copyToClipBoard.bind(this)}>{this.props.text}</td>
      </tr>
    )
  }
}

export default CopyPaste;