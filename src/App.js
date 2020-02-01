import React, { useState, useEffect } from 'react';
import './App.css';
import TrezorConnect from "trezor-connect";
import transactionTypes from "./transactionTypes";

// TrezorConnect.manifest({
//   email: 'chris@crunchycloud.io',
//   appUrl: 'http://localhost:8080'
// })

TrezorConnect.init({
  // origin: 'https://localhost:8088',
  // iframeSrc: `${ DEFAULT_DOMAIN }iframe.html`,
  // popup: true,
  // popupSrc: `${ DEFAULT_DOMAIN }popup.html`,
  // webusbSrc: `${ DEFAULT_DOMAIN }webusb.html`,
  connectSrc: "http://localhost:8088/",
  lazyLoad: true,
  debug: true,
  manifest: {
    email: 'chris@crunchycloud.io',
    appUrl: 'http://localhost:3000'
  }
})

function App() {
  // use a transfer transaction by default
  const [txIndex, setTxIndex] = useState(0);
  const [text, setText] = useState(JSON.stringify(transactionTypes[txIndex].body, null, 2));
  const [path, setPath] = useState("m/44'/43'/0'/0'/0'");


  useEffect(() => {
    setText(JSON.stringify(transactionTypes[txIndex].body, null, 2))

  }, [txIndex])

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <select
            style={{ display: "inline-block", marginRight: "5px" }}
            onChange={event => setTxIndex(event.target.value)}
          >
            {transactionTypes.map(({label}, index) => (
  <option key={index} value={index}>{label}</option>
            ))}
          </select>
          <input
          value={path}
          onChange={event => setPath(event.target.value)}
          style={{
            width: "200px",
            display: "inline-block",
            marginRight: "5px"
          }}
        />
          <button
            style={{ display: "inline-block" }}
            onClick={async () => {
              const body = JSON.parse(text)
              let result;
              console.log("txIndex", txIndex)
              if(txIndex === "2") {

                result = await TrezorConnect.nem2EncryptMessage({
                  path,
                  payload: body.payload,
                  recipientPublicKey: body.recipientPublicKey
                });

              } else if (txIndex === "3") {
                result = await TrezorConnect.nem2DecryptMessage({
                  path,
                  payload: body.payload,
                  senderPublicKey: body.senderPublicKey
                });


              } else {
                result = await TrezorConnect.nem2SignTransaction({
                  path,
                  transaction: body,
                  generationHash: "9F1979BEBA29C47E59B40393ABB516801A353CFC0C18BC241FEDE41939C907E7"
                });
              }

              console.log("RESULT", result);
            }}
          >
            sign tx
          </button>
        </div>
        <textarea
          value={text}
          onChange={event => setText(event.target.value)}
          style={{
            marginTop: "5px",
            height: "500px",
            width: "700px"
          }}
        />
      </header>
    </div>
  );
}

export default App;


// "a80000000000000091c0b3b58eeae9be128b21b8006b70193c7a92343755503dad65c304f9d162b7eacb5698440ce31e29235334f56a5e39b34bcbdafe5664999cf3cda356e8dd0b252d2e9f95c4671eeb0c67c6666890567e35976b32666263cd390fc188ccf31700000000019855416400000000000000090a1e5e1a000000ffff010000000000596feab15d98bfd75f1743e9dc8a36474a3d0c06ae78ed134c231336c38a6297"