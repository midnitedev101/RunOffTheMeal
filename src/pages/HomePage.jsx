import { useState, useEffect } from 'react';
import { getDailyRecipe, getAllRecipes } from '../services/recipeService';
import RecipeCard from '../components/Recipes/RecipeCard';
import RecipeList from '../components/Recipes/RecipeList';

export default function HomePage() {
  const [daily, setDaily] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDailyRecipe(), getAllRecipes()])
      .then(([dailyData, all]) => {
        setDaily(dailyData);
        setRecent(all.slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Run Off The Meal</h1>
        <p>One experimental recipe a day. Cook along, rate, and share your own creations.</p>
      </section>

      {daily && (
        <section className="daily-section">
          <h2>Today&apos;s Recipe</h2>
          <RecipeCard recipe={daily} />
        </section>
      )}

      <RecipeList recipes={recent} title="Recent Recipes" />
    </div>
  );
}
