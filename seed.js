import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const recipes = [
  {
    title: 'Garlic Butter Chicken',
    description: 'A quick and flavorful one-pan chicken dish with a rich garlic butter sauce.',
    instructions: '1. Season chicken breasts with salt and pepper.\n2. Heat butter in a skillet over medium heat.\n3. Add chicken and cook 6 min per side until golden.\n4. Add minced garlic and cook 1 min until fragrant.\n5. Pour in chicken broth and lemon juice, simmer 5 min.\n6. Garnish with parsley and serve.',
    ingredients: [
      { name: 'chicken breast', amount: '2 pieces' },
      { name: 'butter', amount: '3 tbsp' },
      { name: 'garlic', amount: '4 cloves' },
      { name: 'lemon juice', amount: '2 tbsp' },
      { name: 'chicken broth', amount: '1/2 cup' },
      { name: 'parsley', amount: 'for garnish' },
    ],
    imageUrl: 'https://placehold.co/800x500/F5E6D3/333?text=Garlic+Butter+Chicken',
    submittedBy: 'Admin',
    rating: 4.5,
    ratingCount: 12,
    status: 'admin',
  },
  {
    title: 'Spicy Thai Basil Stir-Fry',
    description: 'A bold and aromatic Thai street food classic made in minutes.',
    instructions: '1. Heat oil in a wok over high heat.\n2. Stir-fry sliced chicken until browned.\n3. Add Thai chilies, garlic, and bell peppers.\n4. Toss in soy sauce, fish sauce, and a pinch of sugar.\n5. Add fresh Thai basil leaves and stir until wilted.\n6. Serve over steamed jasmine rice.',
    ingredients: [
      { name: 'chicken thigh', amount: '300g' },
      { name: 'Thai basil', amount: '1 cup' },
      { name: 'garlic', amount: '5 cloves' },
      { name: 'Thai chilies', amount: '4' },
      { name: 'bell pepper', amount: '1' },
      { name: 'soy sauce', amount: '2 tbsp' },
      { name: 'fish sauce', amount: '1 tbsp' },
      { name: 'jasmine rice', amount: '2 cups' },
    ],
    imageUrl: 'https://placehold.co/800x500/E8D5C4/333?text=Thai+Basil+Stir-Fry',
    submittedBy: 'Admin',
    rating: 4.8,
    ratingCount: 24,
    status: 'admin',
  },
  {
    title: 'Creamy Mushroom Risotto',
    description: 'An indulgent Italian risotto with earthy mushrooms and parmesan.',
    instructions: '1. Sauté sliced mushrooms in butter until golden, set aside.\n2. In the same pot, cook diced onion until soft.\n3. Add arborio rice and toast 2 min.\n4. Pour in white wine, stir until absorbed.\n5. Add warm broth one ladle at a time, stirring continuously.\n6. After ~18 min when rice is creamy, fold in mushrooms and parmesan.\n7. Season with salt, pepper, and fresh thyme.',
    ingredients: [
      { name: 'arborio rice', amount: '1.5 cups' },
      { name: 'mushrooms', amount: '250g' },
      { name: 'parmesan', amount: '1/2 cup' },
      { name: 'butter', amount: '3 tbsp' },
      { name: 'onion', amount: '1' },
      { name: 'white wine', amount: '1/2 cup' },
      { name: 'vegetable broth', amount: '4 cups' },
      { name: 'thyme', amount: 'to taste' },
    ],
    imageUrl: 'https://placehold.co/800x500/FFF0E0/333?text=Mushroom+Risotto',
    submittedBy: 'Admin',
    rating: 4.3,
    ratingCount: 8,
    status: 'admin',
  },
  {
    title: 'Mango Sticky Rice',
    description: 'A classic Thai dessert with sweet coconut sticky rice and fresh mango.',
    instructions: '1. Soak sticky rice in water overnight.\n2. Steam rice for 20-25 min until tender.\n3. Heat coconut milk with sugar and salt.\n4. Pour warm coconut milk over the cooked rice, mix well.\n5. Let sit 15 min to absorb.\n6. Serve with sliced fresh mango and drizzle extra coconut cream.',
    ingredients: [
      { name: 'sticky rice', amount: '2 cups' },
      { name: 'coconut milk', amount: '1 can' },
      { name: 'sugar', amount: '1/2 cup' },
      { name: 'salt', amount: '1/4 tsp' },
      { name: 'mango', amount: '2 ripe' },
    ],
    imageUrl: 'https://placehold.co/800x500/FFF8DC/333?text=Mango+Sticky+Rice',
    submittedBy: 'Chef Anong',
    rating: 4.9,
    ratingCount: 35,
    status: 'admin',
  },
  {
    title: 'Crispy Baked Cauliflower',
    description: 'A crunchy, spicy baked cauliflower with a sriracha glaze.',
    instructions: '1. Cut cauliflower into florets.\n2. Mix breadcrumbs, parmesan, and spices in a bowl.\n3. Dip florets in beaten egg, then coat in breadcrumb mix.\n4. Arrange on a baking sheet and spray with oil.\n5. Bake at 425°F for 25 min, flipping halfway.\n6. Drizzle with sriracha-mayo glaze and serve.',
    ingredients: [
      { name: 'cauliflower', amount: '1 head' },
      { name: 'breadcrumbs', amount: '1 cup' },
      { name: 'parmesan', amount: '1/4 cup' },
      { name: 'egg', amount: '2' },
      { name: 'sriracha', amount: '2 tbsp' },
      { name: 'mayonnaise', amount: '3 tbsp' },
    ],
    imageUrl: 'https://placehold.co/800x500/F5F0E1/333?text=Crispy+Cauliflower',
    submittedBy: 'Admin',
    rating: 4.2,
    ratingCount: 15,
    status: 'admin',
  },
  {
    title: 'Lemon Herb Grilled Salmon',
    description: 'Light and fresh grilled salmon with a bright lemon-herb marinade.',
    instructions: '1. Whisk olive oil, lemon juice, garlic, dill, and salt.\n2. Marinate salmon fillets for 20 min.\n3. Preheat grill to medium-high.\n4. Grill salmon skin-side down for 5 min.\n5. Flip and cook 3-4 min more.\n6. Serve with lemon wedges and roasted asparagus.',
    ingredients: [
      { name: 'salmon fillet', amount: '4 pieces' },
      { name: 'lemon', amount: '2' },
      { name: 'olive oil', amount: '3 tbsp' },
      { name: 'garlic', amount: '3 cloves' },
      { name: 'dill', amount: '2 tbsp' },
      { name: 'asparagus', amount: '1 bunch' },
    ],
    imageUrl: 'https://placehold.co/800x500/E8F5E9/333?text=Grilled+Salmon',
    submittedBy: 'Admin',
    rating: 4.6,
    ratingCount: 19,
    status: 'admin',
  },
];

async function seed() {
  const batch = db.batch();
  const col = db.collection('recipes');

  for (const recipe of recipes) {
    const docRef = col.doc();
    batch.set(docRef, {
      ...recipe,
      createdAt: admin.firestore.Timestamp.now(),
    });
  }

  await batch.commit();
  console.log(`Seeded ${recipes.length} recipes successfully.`);
}

seed().catch(console.error);
