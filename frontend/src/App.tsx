import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import SuperheroList from "./components/superhero.list";
import SuperheroDetails from "./components/superhero.details";
import SuperheroForm from "./components/superhero.form";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto border-t-grey-500">
          <Routes>
            <Route path="/" element={<SuperheroList />} />
            <Route path="/superhero/:id" element={<SuperheroDetails />} />
            <Route path="/create" element={<SuperheroForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
