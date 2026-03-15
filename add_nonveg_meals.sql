-- ============================================================
-- Non-Vegetarian Indian Meals — INSERT
-- Generated: 2026-03-15
-- Images sourced from Pexels API
-- ============================================================

INSERT INTO public.meals (name, description, meal_type, cuisine, tags, allergens, ingredients, calories, protein_g, carbs_g, fat_g, fiber_g, is_vegetarian, is_vegan, is_gluten_free, image_url) VALUES

-- ─── BREAKFAST ───────────────────────────────────────────────

(
  'Egg Masala Omelette',
  'Fluffy eggs loaded with onions, green chillies, tomatoes, and aromatic Indian spices. A protein-rich morning classic.',
  'breakfast', 'Indian',
  '{"high-protein", "quick", "spicy", "classic"}',
  '{"Eggs"}',
  '{"eggs", "onion", "tomato", "green chilli", "coriander", "turmeric", "cumin", "oil"}',
  280, 20, 8, 18, 2,
  false, false, true,
  'https://images.pexels.com/photos/12865880/pexels-photo-12865880.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Boiled Eggs with Toast',
  'Two perfectly soft-boiled eggs served alongside whole-grain toast. Simple, wholesome, and satisfying.',
  'breakfast', 'Indian',
  '{"high-protein", "light", "quick", "healthy"}',
  '{"Eggs", "Gluten"}',
  '{"eggs", "whole-grain bread", "salt", "pepper", "butter"}',
  260, 18, 22, 10, 3,
  false, false, false,
  'https://images.pexels.com/photos/2402506/pexels-photo-2402506.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Chicken Keema Paratha',
  'Flaky whole-wheat flatbread stuffed with spiced minced chicken, onions, and green chillies. Pan-cooked with a touch of ghee.',
  'breakfast', 'Indian',
  '{"high-protein", "filling", "street food", "classic"}',
  '{"Gluten"}',
  '{"whole wheat flour", "minced chicken", "onion", "green chilli", "ginger", "garlic", "garam masala", "ghee", "cumin"}',
  420, 32, 38, 16, 4,
  false, false, false,
  'https://images.pexels.com/photos/33428723/pexels-photo-33428723.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Chicken Poha',
  'Light, flattened rice cooked with shredded chicken, mustard seeds, curry leaves, turmeric, and a squeeze of lemon.',
  'breakfast', 'Indian',
  '{"high-protein", "light", "gluten-free", "comfort food"}',
  '{}',
  '{"flattened rice", "chicken breast", "onion", "mustard seeds", "curry leaves", "turmeric", "green chilli", "lemon", "oil"}',
  340, 28, 35, 9, 3,
  false, false, true,
  'https://images.pexels.com/photos/20408460/pexels-photo-20408460.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

-- ─── LUNCH ───────────────────────────────────────────────────

(
  'Butter Chicken with Roti',
  'Tender chicken in a rich, mildly spiced tomato-cream sauce. Served with 2 whole wheat rotis.',
  'lunch', 'Indian',
  '{"high-protein", "classic", "comfort food", "popular"}',
  '{"Dairy", "Gluten"}',
  '{"chicken breast", "tomato", "cream", "butter", "whole wheat roti", "spices", "ginger", "garlic"}',
  580, 40, 45, 22, 4,
  false, false, false,
  'https://images.pexels.com/photos/1117862/pexels-photo-1117862.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Mutton Rogan Josh',
  'Slow-cooked tender mutton in a deeply aromatic Kashmiri gravy of whole spices, yogurt, and dried red chillies. Served with rice.',
  'lunch', 'Indian',
  '{"high-protein", "slow-cooked", "Kashmiri", "classic"}',
  '{"Dairy"}',
  '{"mutton", "yogurt", "kashmiri red chilli", "cardamom", "cloves", "cinnamon", "bay leaf", "onion", "garlic", "ginger", "ghee"}',
  520, 38, 18, 30, 3,
  false, false, true,
  'https://images.pexels.com/photos/9609868/pexels-photo-9609868.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Prawn Curry with Rice',
  'Juicy prawns simmered in a coconut-tomato gravy with coastal Indian spices. Served with steamed basmati rice.',
  'lunch', 'Indian',
  '{"high-protein", "seafood", "coastal", "gluten-free"}',
  '{"Shellfish"}',
  '{"prawns", "coconut milk", "tomato", "onion", "mustard seeds", "curry leaves", "turmeric", "red chilli", "basmati rice", "oil"}',
  460, 32, 48, 14, 4,
  false, false, true,
  'https://images.pexels.com/photos/9609861/pexels-photo-9609861.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Chicken Tikka Masala',
  'Chargrilled chicken tikka pieces folded into a velvety, mildly spiced masala sauce. A beloved restaurant favourite.',
  'lunch', 'Indian',
  '{"high-protein", "popular", "restaurant-style", "classic"}',
  '{"Dairy"}',
  '{"chicken breast", "yogurt", "tomato puree", "cream", "onion", "ginger", "garlic", "garam masala", "kashmiri chilli", "butter"}',
  550, 42, 22, 24, 3,
  false, false, true,
  'https://images.pexels.com/photos/10508207/pexels-photo-10508207.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Fish Curry with Rice',
  'Tender fish fillets cooked in a tangy, turmeric-laced tomato and onion gravy. Paired with steamed basmati rice.',
  'lunch', 'Indian',
  '{"high-protein", "seafood", "gluten-free", "comfort food"}',
  '{}',
  '{"fish fillet", "tomato", "onion", "turmeric", "coriander powder", "cumin", "mustard seeds", "curry leaves", "basmati rice", "oil"}',
  420, 36, 44, 12, 4,
  false, false, true,
  'https://images.pexels.com/photos/18510422/pexels-photo-18510422.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Mutton Keema with Roti',
  'Spiced minced mutton cooked with peas, onions, tomatoes, and warming spices. Served with 2 whole wheat rotis.',
  'lunch', 'Indian',
  '{"high-protein", "classic", "comfort food", "street food"}',
  '{"Gluten"}',
  '{"minced mutton", "green peas", "onion", "tomato", "ginger", "garlic", "garam masala", "cumin", "whole wheat roti", "oil"}',
  540, 37, 40, 22, 5,
  false, false, false,
  'https://images.pexels.com/photos/8533028/pexels-photo-8533028.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Tandoori Chicken Salad',
  'Smoky, marinated tandoori chicken strips served over a fresh salad of cucumber, tomato, red onion, and mint chutney dressing.',
  'lunch', 'Indian',
  '{"high-protein", "light", "low-carb", "healthy", "gluten-free"}',
  '{"Dairy"}',
  '{"chicken breast", "yogurt", "tandoori masala", "cucumber", "tomato", "red onion", "lettuce", "mint chutney", "lemon"}',
  380, 40, 14, 16, 5,
  false, false, true,
  'https://images.pexels.com/photos/25440684/pexels-photo-25440684.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Prawn Biryani',
  'Fragrant basmati rice layered with succulent prawns, caramelised onions, saffron, and whole aromatic spices.',
  'lunch', 'Indian',
  '{"high-protein", "seafood", "festive", "popular"}',
  '{"Shellfish", "Dairy"}',
  '{"prawns", "basmati rice", "onion", "yogurt", "saffron", "ghee", "whole spices", "mint", "coriander", "ginger", "garlic"}',
  520, 34, 58, 16, 3,
  false, false, true,
  'https://images.pexels.com/photos/35287413/pexels-photo-35287413.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Chicken Wrap',
  'Grilled spiced chicken strips, crisp lettuce, tomato, onion, and mint mayo wrapped in a soft flour tortilla.',
  'lunch', 'Indian',
  '{"high-protein", "quick", "street food", "on-the-go"}',
  '{"Gluten", "Dairy"}',
  '{"chicken breast", "flour tortilla", "lettuce", "tomato", "onion", "mint mayo", "chaat masala", "lemon", "oil"}',
  450, 38, 36, 14, 3,
  false, false, false,
  'https://images.pexels.com/photos/2015191/pexels-photo-2015191.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

-- ─── DINNER ──────────────────────────────────────────────────

(
  'Mutton Curry with Rice',
  'Bone-in mutton slow-cooked in a robust onion-tomato masala until fall-off-the-bone tender. Served with steamed basmati rice.',
  'dinner', 'Indian',
  '{"high-protein", "slow-cooked", "comfort food", "gluten-free"}',
  '{}',
  '{"mutton", "onion", "tomato", "ginger", "garlic", "garam masala", "turmeric", "coriander powder", "basmati rice", "oil"}',
  560, 38, 46, 24, 4,
  false, false, true,
  'https://images.pexels.com/photos/35287423/pexels-photo-35287423.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Grilled Fish with Salad',
  'Herb-marinated fish fillet grilled to perfection, served alongside a fresh cucumber, tomato, and rocket salad with lemon dressing.',
  'dinner', 'Indian',
  '{"high-protein", "light", "healthy", "low-carb", "gluten-free"}',
  '{}',
  '{"fish fillet", "lemon", "garlic", "cumin", "turmeric", "red chilli", "cucumber", "tomato", "rocket", "olive oil"}',
  360, 38, 12, 16, 4,
  false, false, true,
  'https://images.pexels.com/photos/5739585/pexels-photo-5739585.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Chicken Stew with Appam',
  'Tender chicken and vegetables slow-cooked in a delicate coconut milk broth with black pepper and whole spices. Served with 2 soft appams.',
  'dinner', 'Indian',
  '{"high-protein", "Kerala", "comfort food", "mild"}',
  '{"Dairy", "Gluten"}',
  '{"chicken", "coconut milk", "potato", "carrot", "onion", "black pepper", "cinnamon", "cloves", "appam", "oil"}',
  510, 36, 46, 20, 5,
  false, false, false,
  'https://images.pexels.com/photos/29400764/pexels-photo-29400764.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Prawn Masala with Roti',
  'Succulent prawns tossed in a bold, dry masala of onions, tomatoes, coconut, and coastal spices. Served with 2 whole wheat rotis.',
  'dinner', 'Indian',
  '{"high-protein", "seafood", "spicy", "coastal"}',
  '{"Shellfish", "Gluten"}',
  '{"prawns", "onion", "tomato", "coconut", "red chilli", "turmeric", "mustard seeds", "curry leaves", "whole wheat roti", "oil"}',
  440, 32, 42, 16, 5,
  false, false, false,
  'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Fish Tikka',
  'Chunks of firm fish marinated in yogurt and spices, skewered and cooked in a tandoor until lightly charred. Served with mint chutney and sliced onions.',
  'dinner', 'Indian',
  '{"high-protein", "tandoor", "low-carb", "gluten-free"}',
  '{"Dairy"}',
  '{"fish fillet", "yogurt", "ginger", "garlic", "turmeric", "kashmiri chilli", "garam masala", "lemon", "oil", "mint chutney"}',
  380, 40, 10, 18, 2,
  false, false, true,
  'https://images.pexels.com/photos/2580464/pexels-photo-2580464.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Mutton Seekh Kebab',
  'Minced mutton mixed with fresh herbs and spices, shaped on skewers and grilled over charcoal. Served with mint chutney and onion rings.',
  'dinner', 'Indian',
  '{"high-protein", "grilled", "low-carb", "appetiser", "gluten-free"}',
  '{}',
  '{"minced mutton", "onion", "ginger", "garlic", "green chilli", "coriander", "garam masala", "cumin", "black pepper", "oil"}',
  420, 36, 8, 26, 2,
  false, false, true,
  'https://images.pexels.com/photos/29173089/pexels-photo-29173089.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),

(
  'Chicken Afghani',
  'Creamy, mildly spiced chicken marinated in cream cheese, cashew paste, and aromatic spices, then grilled to a golden finish.',
  'dinner', 'Indian',
  '{"high-protein", "creamy", "mild", "restaurant-style"}',
  '{"Dairy", "Tree Nuts"}',
  '{"chicken", "cream cheese", "cashew paste", "cream", "ginger", "garlic", "white pepper", "cardamom", "lemon", "oil"}',
  520, 42, 12, 32, 2,
  false, false, true,
  'https://images.pexels.com/photos/12999584/pexels-photo-12999584.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
);

-- ============================================================
-- Fix existing egg dishes — eggs are not vegetarian
-- ============================================================

UPDATE public.meals
SET is_vegetarian = false
WHERE name IN (
  'Egg White Omelette',
  'Egg Bhurji with Multigrain Roti',
  'Egg Curry with Rice'
);
