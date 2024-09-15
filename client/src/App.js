import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import stubs from "./defaultStubs";
import moment from "moment";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

function App() {
  const [code, setCode] = useState("");
  const [codeOutput, setCodeOutput] = useState("");
  const [errorOutput, setErrorOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [status, setStatus] = useState();
  const [jobId, setJobID] = useState();
  const [jobDetails, setJobDetails] = useState(null);

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

  const renderTimeDetails = () => {
    let result = "";

    if (!jobDetails) return "";

    let { submittedAt, startedAt, completedAt } = jobDetails;

    submittedAt = moment(submittedAt).toString();
    result += `Submitted At : ${submittedAt}`;

    if (!startedAt || !completedAt) return result;

    const start = moment(startedAt);
    const end = moment(completedAt);
    const executionTime = end.diff(start, "seconds", true);
    result += `Execution Time : ${executionTime}s`;
    return result;
  };

  const handleSubmit = async () => {
    const payload = {
      language,
      code,
    };
    try {
      setCodeOutput("");
      setErrorOutput("");
      setStatus("");
      setJobID("");
      setJobDetails(null);

      const {
        data: { jobId },
      } = await axios.post("http://localhost:8000/run", payload);
      console.log(payload);
      setJobID(jobId);

      let intervalId;
      intervalId = setInterval(async () => {
        const { data: dataRes } = await axios.get(
          "http://localhost:8000/status",
          { params: { id: jobId } }
        );

        const { job, success, error } = dataRes;
        console.log(dataRes);
        if (success) {
          const { status: jobStatus, output: jobOutput } = job;
          setStatus(jobStatus);
          setJobDetails(job);
          //console.log(jobStatus, jobOutput);
          if (jobStatus === "pending") return;
          else if (jobStatus === "error") {
            setErrorOutput(jobOutput);
          } else {
            setCodeOutput(jobOutput);
          }
          clearInterval(intervalId);
        } else {
          setStatus("Error: Please retry!");
          console.log(error);
          setErrorOutput(error);
          clearInterval(intervalId);
        }
      }, 1000);
    } catch ({ response }) {
      console.log(response);
      if (response) {
        console.log(`Got Axios error `);
        setErrorOutput("error");
        setCodeOutput("");
      } else {
        console.log("Error connecting to server!");
        setCodeOutput("Error connecting to server!");
      }
    }
  };

  return (
    <div className="App">
      <h1>Online Code Compiler</h1>

      <div>
        <label>Select a language : </label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
      </div>
      <br />
      <div>
        <button onClick={setDefaultLanguage}>Set Default</button>
      </div>
      <br />
      <CodeMirror
        value={code}
        height="350px"
        width="1200px"
        extensions={[javascript({ jsx: true })]}
        onChange={(e) => {
          setCode(e);
        }}
        theme={vscodeDark}
      />

      <br />
      <button onClick={handleSubmit}>Submit</button>
      <p>{status}</p>
      <p>{jobId && `JobID : ${jobId}`}</p>
      <p>{renderTimeDetails()}</p>

      {codeOutput.length > 0 ? <h1>Code Output : </h1> : <></>}
      <p>{codeOutput}</p>

      {errorOutput.length > 0 ? <h1>Error Output : </h1> : <></>}
      <p>{errorOutput}</p>
    </div>
  );
}

export default App;
