export default [{
  label: "Transfer",
  body: {
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
  }
}, {
  label: "Multisig (Add public key)",
  body: {
    "type": 16725,
    "network": 152,
    "version": 38913,
    "maxFee": "100",
    "deadline": "113248176649",
    "signature": "",
    "minApprovalDelta": 1,
    "minRemovalDelta": 1,
    "publicKeyAdditions": [
      "596FEAB15D98BFD75F1743E9DC8A36474A3D0C06AE78ED134C231336C38A6297"
    ],
    "publicKeyDeletions": []
  }
}, {
  label: "Encrypt Message",
  body: {
    recipientPublicKey: "596FEAB15D98BFD75F1743E9DC8A36474A3D0C06AE78ED134C231336C38A6297",
    payload: "A test message"
  }
}, {
  label: "Decrypt Message",
  body: {
    senderPublicKey: "596FEAB15D98BFD75F1743E9DC8A36474A3D0C06AE78ED134C231336C38A6297",
    payload: "12aa902949c24c9814e7de8663a7c67666e5e1c38d3d44978841311e477753cbfa4b2177116bcff83c2949f86bf36f05d872ccbc283c6bb648a80149c367819a"
  }
}]