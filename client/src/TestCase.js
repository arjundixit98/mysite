import React from "react";
import "./stylesheets/testcase.css";

const TestCase = ({
  problemData,
  codeOutput,
  runtime,
  errorOutput: errorString,
  submitButtonClicked,
}) => {
  const {
    testCaseInputString: input,
    testCaseExpectedOutputString: expectedOutput,
    testCasesCount,
  } = problemData;

  let errorOutput = "";
  if (errorString) {
    errorOutput = JSON.parse(errorString).stderr;
  }

  const isCorrect = (v1, v2, n) => {
    v1 = v1.split("\n");
    v2 = v2.split("\n");
    for (let index = 0; index < n; index++) {
      if (v1[index] !== v2[index]) return false;
    }
    return true;
  };

  let answer = "";
  if (codeOutput) {
    answer = isCorrect(expectedOutput, codeOutput, testCasesCount)
      ? "Correct Answer"
      : "Wrong Answer";
  }

  return (
    <div className="testcase">
      {answer ? (
        <div className="tr-status">
          <div className="ans-status">{answer}</div>
          <div className="runtime">Execution Time: {runtime}s</div>
        </div>
      ) : errorOutput ? (
        <div className="tr-status">
          <div>Compilation Error...</div>
        </div>
      ) : submitButtonClicked ? (
        <div className="tr-status">
          <div>Submission Queued...</div>
        </div>
      ) : (
        <div></div>
      )}

      <p>Sample Input</p>
      <div className="sample-input">{input}</div>
      <p className="exp">Expected Output</p>
      <div className="expected-output">{expectedOutput}</div>
      {codeOutput && (
        <>
          <p className="out">Your Output</p>
          <div className="outputt">{codeOutput}</div>
        </>
      )}

      {errorOutput && (
        <>
          <p className="error">Error</p>
          <div className="error-output">{errorOutput}</div>
        </>
      )}
    </div>
  );
};

export default TestCase;
