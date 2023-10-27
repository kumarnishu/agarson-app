import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { QueryClientProvider, QueryClient } from "react-query";

import './index.css'
import { UserProvider } from "./contexts/userContext";
import { BrowserRouter } from "react-router-dom";
import { ChoiceProvider } from "./contexts/dialogContext";
import { MenuProvider } from "./contexts/menuContext";
import { LoadingProvider } from './contexts/loaderContext.tsx';
import { HelpChoiceProvider } from './contexts/HelpChoiceContext.tsx';


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: false,
      staleTime: 200
    }
  }
});
ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <UserProvider>
        <LoadingProvider>
          <ChoiceProvider>
            <HelpChoiceProvider>
              <MenuProvider>
                <App />
              </MenuProvider>
            </HelpChoiceProvider>
          </ChoiceProvider>
        </LoadingProvider>
      </UserProvider>
    </BrowserRouter>
  </QueryClientProvider>
)

