import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageLayout from "./components/header/PageLayout";
import CampaignPage from './pages/CampaignPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import CreateRequestPage from "./pages/CreateRequestPage";
import ProfilePage from "./pages/ProfilePage";

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
}

export default App;
