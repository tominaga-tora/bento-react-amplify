// import { useEffect, useState } from "react";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
import StylishBentoOrderService from "./components/StylishBentoOrderService";

// const client = generateClient<Schema>();

function App() {
  return (
    <main>
      <StylishBentoOrderService></StylishBentoOrderService>
    </main>
  );
}

export default App;
