import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageLayout from "./components/header/PageLayout";
import CampaignPage from './pages/CampaignPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
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
            <PageLayout>
              <CampaignPage key="/" />
            </PageLayout>
          }
        />
        <Route
          exact
          path="/campaign/new"
          key="/campaign/new"
          element={
            <PageLayout>
              <CreateCampaignPage key="/campaign/new" />
            </PageLayout>
          }
        >
        </Route>
      </Routes>
    </BrowserRouter>);
}

export default App;
