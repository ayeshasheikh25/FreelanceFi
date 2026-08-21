import { useState } from "react";
import Wallet from "./ethers/Wallet";
import LandingPage from "./components/LandingPage";
import { Route, Routes } from "react-router-dom";
import RoleSection from "./components/RoleSection";
import DashBoard from "./components/DashBoard";
import CreateTask from "./components/client/CreateTask";
import ClientTasks from "./components/client/ClientTasks";
import BrowseTask from "./components/freelancer/BrowseTask";
import ViewTask from "./components/freelancer/ViewTask";
import ActiveTasks from "./components/freelancer/ActiveTasks";
import PendingApplication from "./components/freelancer/PendingApplication";
import ViewProposals from "./components/client/ViewProposals";
import CurrentHires from "./components/client/CurrentHires";
import SubmittedTask from "./components/client/SubmittedTask";
import Rating from "./components/Rating";
import ViewProfile from "./components/client/ViewProfile";
import FreelancerHistory from "./components/client/FreelancerHistory";
import CompletedTasks from "./components/freelancer/CompletedTasks";
import ClientHistory from "./components/freelancer/ClientHistory";

function App() {
  return (
    <>
    
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50">
        <Wallet>
      
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/role-section" element={<RoleSection />} />
              <Route path="/create-task" element={<CreateTask />} />
              <Route path="/my-task" element={<ClientTasks />} />
              <Route path="/browse-task" element={<BrowseTask />} />
              <Route path="/view-task/:id" element={<ViewTask />} />
              <Route path='/active-tasks' element={<ActiveTasks />} />
              <Route path='/pending-applications' element={<PendingApplication />} />
              <Route path= '/view-propsals' element={<ViewProposals />} />
              <Route path="/current-hires-freelancers" element={<CurrentHires />} />
              <Route path="/submitted-tasks" element={<SubmittedTask />} />
              <Route path="/view-profile/:address" element={<ViewProfile />} />
              <Route path='/freelancer-history' element={<FreelancerHistory />} />
              <Route path="/completed-tasks" element={<CompletedTasks />} />
              <Route path='/client-history' element={<ClientHistory />} />
            </Routes>

        </Wallet>
      </div>
    </>
  );
}

export default App;
