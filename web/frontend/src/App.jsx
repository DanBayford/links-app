import React, { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import { queryClient } from "./services/cache";
import { useConfig } from "./hooks";
import {
  NavBar,
  LinksEditor,
  ProfileEditor,
  PhonePreview,
  Loader,
  Error,
} from "./components";

const VIEWS = {
  LINKS_EDITOR: "LINKS_EDITOR",
  PROFILE_EDITOR: "PROFILE_EDITOR",
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppViews />
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer
        position="bottom-left"
        theme="dark"
        autoClose={3000}
        closeOnClick
      />
    </QueryClientProvider>
  );
};

const AppViews = () => {
  const { configLoading, configError } = useConfig();

  const [currentView, setCurrentView] = useState(VIEWS.LINKS_EDITOR);

  if (configLoading) {
    return <Loader loadingMessage={"Loading Links app"} />;
  } else if (configError) {
    return <Error errorMessage={"Error loading application"} />;
  }

  return (
    <>
      <NavBar
        currentView={currentView}
        VIEWS={VIEWS}
        setCurrentView={setCurrentView}
      />
      <section className="relative hidden lg:block col-start-2 col-end-7 bg-white rounded-2xl p-4 mb-4">
        <PhonePreview />
      </section>
      <section className="col-start-2 lg:col-start-7 col-end-10 lg:col-end-14 bg-white rounded-2xl p-4 pt-8 mb-4">
        {currentView === VIEWS.LINKS_EDITOR ? (
          <LinksEditor />
        ) : (
          <ProfileEditor />
        )}
      </section>
    </>
  );
};

export default App;
