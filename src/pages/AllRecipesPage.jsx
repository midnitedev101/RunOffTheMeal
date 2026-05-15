import { useState, useEffect } from 'react';
import { getAllRecipes } from '../services/recipeService';
import RecipeList from '../components/Recipes/RecipeList';

export default function AllRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRecipes()
      .then(setRecipes)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading recipes...</p>;

  return <RecipeList recipes={recipes} title="All Recipes" />;
}
