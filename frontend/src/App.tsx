import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import DocumentationViewer from './pages/DocumentationViewer';
import CodeGenerator from './pages/CodeGenerator';

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ className: 'dark:bg-gray-800 dark:text-gray-100' }} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Layout />}>
          <Route path="docs" element={<DocumentationViewer />} />
          <Route path="docs/:docId" element={<DocumentationViewer />} />
          <Route path="codegen" element={<CodeGenerator />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
