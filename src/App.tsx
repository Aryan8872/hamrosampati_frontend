import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthContextProvider } from "./context/AuthContext";
import BlogContextProvider from "./context/BlogContext";
import PropertyContextProvider from "./context/PropertyContext";
import SearchContextProvider from "./context/SearchContext";
import { TabProvider } from "./context/TabContext";
import TourContextProvider from "./context/TourRequestContext";
import i18ns from "./i18n/i18n";
import TheRouter from "./routes/TheRouter";


const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18ns}>
        <Router>
          <AuthContextProvider>
            <PropertyContextProvider>
              <SearchContextProvider>
                <TourContextProvider>
                  <BlogContextProvider>
                    <TabProvider>
                      <div className="min-h-screen flex flex-col">
                        <main className="bg-bodyBgColor">
                          <ToastContainer />
                          <TheRouter />
                        </main>
                      </div>
                    </TabProvider>
                  </BlogContextProvider >
                </TourContextProvider>
              </SearchContextProvider>
            </PropertyContextProvider>
          </AuthContextProvider>
        </Router>
      </I18nextProvider>
    </QueryClientProvider>
  );
};


export default App;
