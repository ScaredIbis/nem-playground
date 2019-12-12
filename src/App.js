import React, { useState } from 'react';
import './App.css';
import TrezorConnect from "trezor-connect";

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
  const [text, setText] = useState(`{
    "type": 16724,
    "network": 152,
    "version": 38913,
    "maxFee": "20000",
    "deadline": "113248176649",
    "signature": "",
    "recipientAddress": {
      "address": "TAO6QEUC3APBTMDAETMG6IZJI7YOXWHLGC5T4HA4",
      "networkType": 152
    },
    "mosaics": [
      {
        "amount": "1000000000",
        "id": "308F144790CD7BC4"
      }
    ],
    "message": {
      "type": 0,
      "payload": "Test Transfer"
    }
  }`);
  return (
    <div className="App">
      <header className="App-header">
        <textarea
          value={text}
          onChange={event => setText(event.target.value)}
          style={{
            height: "700px",
            width: "600px"
          }}
        />
        <button
          onClick={async () => {
            const tx = JSON.parse(text)
            const signTxResult = await TrezorConnect.nem2SignTransaction({
              path: `m/44'/43'/0'`,
              transaction: tx,
              generationHash: "9F1979BEBA29C47E59B40393ABB516801A353CFC0C18BC241FEDE41939C907E7"
            });

            console.log("RESULT", signTxResult);
          }}
        >
          sign tx
        </button>
      </header>
    </div>
  );
}

export default App;
