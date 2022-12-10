import { BrowserRouter, Routes, Route } from "react-router-dom";
import CampaignPage from './pages/CampaignPage';
import NewCampaign from './pages/NewCampaign';
// import { connectWallet } from "./services/connectWal  let";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          key="/"
          element={
            <CampaignPage key="/" />
          }
        />
        <Route
          exact
          path="/campaign/new"
          key="/campaign/new"
          element={
            <NewCampaign key="/campaign/new" />
          }
        >
        </Route>
      </Routes>
    </BrowserRouter>);
}

export default App;
