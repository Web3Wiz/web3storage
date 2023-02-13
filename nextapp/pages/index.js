import React, { useState } from "react";
import { Web3Storage } from "web3.storage";

export default function Home() {
  const [files, setFiles] = useState(null);
  const [fileHash, setFileHash] = useState(null);

  function getAccessToken() {
    //For this to work, you need to set the
    // WEB3STORAGE_TOKEN environment variable before you run your code.
    return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
  }

  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }

  const getFiles = () => {
    const fileInput = document.querySelector('input[type="file"]');
    setFiles(fileInput.files);
  };

  async function storeFiles() {
    var client;
    try {
      client = makeStorageClient();
      const cid = await client.put(files);
      console.log("stored files with cid:", cid);
      setFileHash(cid);
    } catch (err) {
      if (!client.token)
        window.alert(
          "Invalid Token. Please configure a valid token first and try again"
        );
      else if (!files) window.alert("First select file(s) to upload");
      else window.alert(err);
    }
  }

  async function displayAllFiles() {
    try {
      let totalBytes = 0;
      let filesList = "<table width='80%' cellspacing='5' cellpadding='5'>";
      const client = makeStorageClient();
      for await (const upload of client.list()) {
        filesList += "<tr><td>";
        filesList += `<a href=https://dweb.link/ipfs/${upload.cid} target="_blank"  rel="noreferrer">📄  ${upload.cid}</a>`;
        filesList += `</td><td> ${upload.name}`;
        filesList += "</td></tr>";
        totalBytes += upload.dagSize || 0;
      }
      filesList += `<tr><td colspan"2">⁂ ${totalBytes.toLocaleString()} bytes stored!</td></tr>`;
      filesList += "</table>";
      document.getElementById("filesList").innerHTML = filesList;
    } catch (err) {
      window.alert(err);
    }
  }

  return (
    <div className="main">
      <div>
        <h1>🔗 Web3.Storage (IPFS) </h1>
        <br />
        <br />
      </div>
      <input type="file" onChange={getFiles} />
      <button onClick={storeFiles}>Upload to IPFS</button> <br />
      {fileHash && (
        <div>
          <br />
          <h3>
            🔗 Web3.Storage Hosting Link <br />
          </h3>
          <a
            style={{ textDecoration: "underline" }}
            href={`https://dweb.link/ipfs/${fileHash}`}
            target="_blank"
            rel="noreferrer"
          >{`https://dweb.link/ipfs/${fileHash}`}</a>
          <br />
          <br />
        </div>
      )}
      <button onClick={displayAllFiles} style={{ marginTop: "40px" }}>
        Display the list of all unique uploads on this account
      </button>
      <div id="filesList"></div>
    </div>
  );
}
