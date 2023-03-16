import Highlighter from "react-highlight-words";
import React from 'react'

export default function LeftTextbox(props: { note: string, phrases: string [] }) {
  
  return (
    <div className="left-textbox">
      <div className="left-title">Your Medical Note</div>
      <div className="left-text">
        <Highlighter
          highlightClassName="highlight-text"
          searchWords={props.phrases}
          autoEscape={true}
          textToHighlight={props.note}
        />
      </div>
    </div>
  );
}
