import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import stubs from "./defaultStubs";
import moment from "moment";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import "./stylesheets/editor.css";

function Editor({
  problemId,
  setCodeOutput,
  setRuntime,
  setErrorOutput,
  setSubmitButtonClicked,
  height,
  width,
}) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "cpp";
    setLanguage(defaultLang);
  }, []);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language);
  };

  const renderTimeDetails = (startedAt, completedAt) => {
    const start = moment(startedAt);
    const end = moment(completedAt);
    const executionTime = end.diff(start, "seconds", true);
    return `${executionTime}`;
  };

  const handleSubmit = async () => {
    const payload = {
      language,
      code,
    };
    try {
      setCodeOutput("");
      setErrorOutput("");
      setSubmitButtonClicked(true);
      const {
        data: { jobId },
      } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/run`, payload);

      let intervalId;
      intervalId = setInterval(async () => {
        const { data: dataRes } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/status`,
          { params: { id: jobId } }
        );

        const { job, success, error } = dataRes;
        if (success) {
          const {
            status: jobStatus,
            output: jobOutput,
            startedAt,
            completedAt,
          } = job;
          console.log(jobStatus, jobOutput);
          if (jobStatus === "pending") return;
          else if (jobStatus === "error") {
            setErrorOutput(jobOutput);
          } else {
            setCodeOutput(jobOutput);
            setRuntime(renderTimeDetails(startedAt, completedAt));
          }
          clearInterval(intervalId);
        } else {
          console.log(error);
          setErrorOutput(error);
          clearInterval(intervalId);
        }
      }, 1000);
    } catch ({ response }) {
      console.log(response);
      if (response) {
        console.log(`Got Axios error : `);
        setErrorOutput("");
        setCodeOutput("");
      } else {
        console.log("Error connecting to server!");
        setCodeOutput("Error connecting to server!");
      }
    }
  };

  return (
    <div className="editor">
      <div className="select-lang-container">
        <label className="label-lang">Select a language : </label>
        <select
          className="custom-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
        <button className="btn-default" onClick={setDefaultLanguage}>
          Set Default
        </button>
      </div>

      <CodeMirror
        className="code-mirror-editor"
        value={code}
        height={height}
        width={width}
        extensions={[javascript({ jsx: true })]}
        onChange={(e) => {
          setCode(e);
        }}
        theme={vscodeDark}
      />
      <button className="btn-submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default Editor;
