import React from "react";
import "./stylesheets/codeoutputview.css";

const CodeOutputView = ({
  codeOutput,
  runtime,
  errorOutput: errorString,
  submitButtonClicked,
}) => {
  let errorOutput = "";
  if (errorString) {
    errorOutput = JSON.parse(errorString).stderr;
  }

  return (
    <div className="results">
      {codeOutput ? (
        <div className="exec-time">
          <div>Execution Time: {runtime}s</div>
        </div>
      ) : errorOutput ? (
        <div className="exec-time">
          <div>Compilation Error...</div>
        </div>
      ) : submitButtonClicked ? (
        <div className="exec-time">
          <div>Submission Queued...</div>
        </div>
      ) : (
        <div></div>
      )}

      {codeOutput && (
        <>
          <p className="out1">Your Output</p>
          <div className="output1">{codeOutput}</div>
        </>
      )}

      {errorOutput && (
        <>
          <p className="error1">Error</p>
          <div className="output1">{errorOutput}</div>
        </>
      )}
    </div>
  );
};

export default CodeOutputView;
