import { Fragment } from "react";
import Button from '@mui/material/Button';
import { connectWallet } from "./scripts/connectWallet";

function App() {
  return (
    <Fragment>
      <Button variant="contained" onClick={connectWallet}>Connect Wallet</Button>
    </Fragment>
  );
}

export default App;
