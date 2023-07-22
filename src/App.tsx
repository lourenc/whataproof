import { Route } from "wouter";

import { ItemPage } from "./pages/ItemPage";
import { HomePage } from "./pages/HomePage";

export function App() {
  return (
    <>
      <Route path="/"><HomePage/></Route>
      <Route path="/item/:id">
        {(params) => <ItemPage id={params.id} />}
      </Route>
    </>
  );
}
