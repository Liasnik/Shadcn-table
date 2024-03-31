import { Toaster } from "./components/ui/toaster";
import { DataTableDemo } from "./components/DataTable";

function App() {
  return (
    <>
      <div className="container mx-auto py-10">
        <DataTableDemo />
      </div>
      <Toaster />
    </>
  );
}

export default App;
