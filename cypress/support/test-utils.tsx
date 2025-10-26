import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// export { AllProviders };
export const FakeParamsRouter = ({
  children,
  params,
}: {
  children: React.ReactElement;
  params?: { [key: string]: string };
}) => {
  const paramsString = params ? `/:${Object.keys(params).join("/:")}` : "/";
  const valuesString = params ? "/" + Object.values(params).join("/") : "/";

  return (
    <MemoryRouter initialEntries={[valuesString]}>
      <Routes>
        <Route path={paramsString} element={children} />
      </Routes>
    </MemoryRouter>
  );
};
