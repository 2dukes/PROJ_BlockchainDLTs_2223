import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageLayout from "./components/header/PageLayout";
import CampaignPage from './pages/CampaignPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import CreateRequestPage from "./pages/CreateRequestPage";
import ProfilePage from "./pages/ProfilePage";
import { useEffect, useContext } from "react";
import { connectWallet } from "./services/connectWallet";
import { Context } from "./services/context";

const App = () => {
  const { setConnectedWallet, setWalletConnectAttempt } = useContext(Context);

  useEffect(() => {
    const testConnection = async () => {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length) {
        await connectWallet();
        setConnectedWallet(true);
        console.log(`You're connected to: ${accounts[0]}`);
      }
      setWalletConnectAttempt(true);
    };

    testConnection();
  }, [setConnectedWallet, setWalletConnectAttempt]);

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
        <Route
          exact
          path="/request/new"
          key="/request/new"
          element={
            <PageLayout>
              <CreateRequestPage key="/campaign/new" />
            </PageLayout>
          }
        >
        </Route>
        <Route
          exact
          path="/profile"
          key="/profile"
          element={
            <PageLayout>
              <ProfilePage key="/profile" />
            </PageLayout>
          }
        >
        </Route>
      </Routes>
    </BrowserRouter>);
};

export default App;
