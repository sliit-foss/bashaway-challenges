import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@sliit-foss/bashaway-ui/components";
import { Home, NotFound } from "./pages";

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;