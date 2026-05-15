import RecipeForm from '../components/Recipes/RecipeForm';

export default function SubmitPage() {
  return (
    <div className="submit-page">
      <h1>Submit Your Recipe</h1>
      <p>Share your culinary creation with the community. Your recipe will be reviewed before being published.</p>
      <RecipeForm />
    </div>
  );
}
