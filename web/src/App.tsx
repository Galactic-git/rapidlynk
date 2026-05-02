import { Navigate, Route, Routes } from 'react-router-dom';
import { SiteLayout } from './layouts/SiteLayout';
import { AboutPage } from './pages/AboutPage';
import { ContributePage } from './pages/ContributePage';
import { DownloadPage } from './pages/DownloadPage';
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';

function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/download" element={<DownloadPage />} />
        {/* <Route path="/docs" element={<DocsPage />} /> */}
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/about" element={<AboutPage />} />
        {/* <Route path="/blog" element={<BlogPage />} /> */}
        <Route path="/contribute" element={<ContributePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteLayout>
  );
}

export default App;
