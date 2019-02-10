import React, { Component } from "react";

// var self;

class File extends React.Component {

	constructor(props) {
		super(props);
	}

	downloadFile() {
    console.log("download this file: ", this.props.text);
    var fileName = this.props.text;
    this.props.onClick(fileName);
  }

  render() {
    return (
      <div>
        <button className="fileName" onClick={this.downloadFile.bind(this)}>{this.props.text}</button>
      </div>
    )
  }
}

export default File;