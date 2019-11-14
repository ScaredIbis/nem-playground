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
  manifest: {
    email: 'chris@crunchycloud.io',
    appUrl: 'http://localhost:3000'
  }
})

function App() {
  // use a transfer transaction by default
  const [text, setText] = useState(`{
    "type": 16724,
    "networkType": 144,
    "version": 36865,
    "maxFee": "20000",
    "deadline": "113248176649",
    "signature": "",
    "recipientAddress": {
      "address": "SAIKV5OOWCQ3EHIBMJH7HR2GGKPXUG2VT4OE3FU7",
      "networkType": 144
    },
    "mosaics": [
      {
        "amount": "1000000000",
        "id": "308F144790CD7BC4"
      }
    ],
    "message": {
      "type": 0,
      "payload": "This is a message"
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
              transaction: tx
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
