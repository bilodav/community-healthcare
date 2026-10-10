import { Routes, Route } from "react-router";
import "./App.css";
import Header from "./components/common/Header";
import Landing from "./pages/Landing";
import Footer from "./components/common/Footer";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <a class="skip-link" href="#main">
        Skip to main content
      </a>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/meal-planner" element={<MealPlannerPage />} />
        <Route path="/favorites" element={<FavoritesPage />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
