import React, { Component } from "react";

// var self;

class File extends React.Component {

	constructor(props) {
		super(props);
	}

	downloadFile() {
		console.log("download");
    var fileName = this.props.text;
    this.props.onClick(fileName);
  }

  removeFile() {
  	console.log("remove");
    var fileName = this.props.text;
  	this.props.onClick(fileName);
  }

  render() {
    return (
      <div className="file">
        <button className="fileName" onClick={this.props.onDownloadClick.bind(this, this.props.text)}>{this.props.text}</button>
        <button className="remove" onClick={this.props.onRemoveClick.bind(this, this.props.text)}> x </button>
      </div>
    )
  }
}

export default File;