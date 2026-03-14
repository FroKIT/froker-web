-- ============================================================
-- PACKAGES
-- ============================================================
insert into public.packages (name, description, meals_per_day, duration_days, price_inr, features, is_popular) values
(
  'Starter',
  'Perfect to try Froker. One meal a day, fully personalised.',
  1, 30, 2999,
  '{"1 meal/day", "AI meal curation", "Swap anytime", "Macro tracking"}',
  false
),
(
  'Balance',
  'Our most popular plan. Lunch + dinner curated for your goals.',
  2, 30, 4999,
  '{"2 meals/day", "AI meal curation", "Unlimited swaps", "Macro tracking", "AI bot access", "Priority support"}',
  true
),
(
  'Full Day',
  'Complete nutrition, all day. Breakfast, lunch and dinner.',
  3, 30, 6999,
  '{"3 meals/day", "AI meal curation", "Unlimited swaps", "Macro tracking", "AI bot access", "Dedicated nutritionist", "Priority delivery"}',
  false
),
(
  'Weekly Trial',
  'Try us for a week before committing.',
  2, 7, 1499,
  '{"2 meals/day", "AI meal curation", "2 swaps/day", "Macro tracking"}',
  false
);

-- ============================================================
-- MEALS — Breakfast
-- ============================================================
insert into public.meals (name, description, meal_type, cuisine, tags, allergens, ingredients, calories, protein_g, carbs_g, fat_g, fiber_g, is_vegetarian, is_vegan, is_gluten_free) values
(
  'Masala Oats Bowl',
  'Rolled oats cooked with turmeric, mustard seeds, tomato, and vegetables. Light, warm, and filling.',
  'breakfast', 'Indian',
  '{"high-fiber", "low-fat", "quick"}',
  '{"Gluten"}',
  '{"rolled oats", "tomato", "onion", "green peas", "turmeric", "mustard seeds", "curry leaves", "coriander"}',
  280, 9, 45, 6, 5, true, true, false
),
(
  'Paneer Bhurji Wrap',
  'Scrambled cottage cheese with peppers and spices wrapped in a whole wheat roti.',
  'breakfast', 'Indian',
  '{"high-protein", "vegetarian"}',
  '{"Dairy", "Gluten"}',
  '{"paneer", "whole wheat roti", "bell peppers", "onion", "tomato", "cumin", "coriander"}',
  380, 22, 38, 14, 3, true, false, false
),
(
  'Egg White Omelette',
  'Fluffy egg white omelette with spinach, mushrooms, and low-fat cheese.',
  'breakfast', 'Continental',
  '{"high-protein", "low-carb", "keto-friendly"}',
  '{"Eggs", "Dairy"}',
  '{"egg whites", "spinach", "mushrooms", "low-fat cheese", "olive oil", "herbs"}',
  210, 28, 4, 8, 2, true, false, true
),
(
  'Moong Dal Chilla',
  'Savoury green moong pancakes with mint chutney. Protein-rich traditional breakfast.',
  'breakfast', 'Indian',
  '{"high-protein", "gluten-free", "diabetic-friendly"}',
  '{}',
  '{"moong dal", "ginger", "green chilli", "cumin", "coriander", "mint chutney"}',
  240, 14, 32, 4, 6, true, true, true
),
(
  'Greek Yogurt Parfait',
  'Thick Greek yogurt layered with fresh mango, granola, and a drizzle of honey.',
  'breakfast', 'Continental',
  '{"probiotic", "quick", "refreshing"}',
  '{"Dairy", "Gluten"}',
  '{"greek yogurt", "mango", "granola", "honey", "chia seeds"}',
  320, 18, 42, 8, 3, true, false, false
);

-- ============================================================
-- MEALS — Lunch
-- ============================================================
insert into public.meals (name, description, meal_type, cuisine, tags, allergens, ingredients, calories, protein_g, carbs_g, fat_g, fiber_g, is_vegetarian, is_vegan, is_gluten_free) values
(
  'Grilled Chicken Bowl',
  'Herb-marinated grilled chicken breast with brown rice, roasted broccoli, and a light lemon dressing.',
  'lunch', 'Continental',
  '{"high-protein", "meal-prep-friendly", "balanced"}',
  '{}',
  '{"chicken breast", "brown rice", "broccoli", "lemon", "garlic", "olive oil", "herbs"}',
  520, 42, 48, 12, 6, false, false, true
),
(
  'Dal Makhani with Millet Roti',
  'Slow-cooked black lentils in a light tomato-cream base, served with finger millet rotis.',
  'lunch', 'Indian',
  '{"high-fiber", "vegetarian", "comfort food"}',
  '{"Dairy"}',
  '{"black urad dal", "kidney beans", "tomato", "cream", "butter", "finger millet flour", "spices"}',
  480, 18, 62, 14, 10, true, false, false
),
(
  'Palak Tofu',
  'Iron-rich spinach curry with firm tofu. Vegan and packed with nutrients.',
  'lunch', 'Indian',
  '{"vegan", "iron-rich", "high-protein"}',
  '{"Soy"}',
  '{"firm tofu", "spinach", "onion", "tomato", "ginger", "garlic", "spices"}',
  360, 20, 22, 18, 8, true, true, true
),
(
  'Chicken Biryani (Light)',
  'Aromatic basmati rice cooked with tender chicken, saffron, and whole spices. Light oil, big flavour.',
  'lunch', 'Indian',
  '{"aromatic", "satisfying", "weekend special"}',
  '{}',
  '{"basmati rice", "chicken", "saffron", "whole spices", "onion", "yogurt", "mint", "coriander"}',
  560, 35, 65, 14, 3, false, false, true
),
(
  'Quinoa Tabbouleh Salad',
  'Protein-rich quinoa with fresh parsley, cucumber, tomato, lemon juice, and olive oil.',
  'lunch', 'Mediterranean',
  '{"gluten-free", "vegan", "refreshing"}',
  '{}',
  '{"quinoa", "parsley", "cucumber", "tomato", "lemon", "olive oil", "mint"}',
  340, 12, 44, 11, 6, true, true, true
);

-- ============================================================
-- MEALS — Dinner
-- ============================================================
insert into public.meals (name, description, meal_type, cuisine, tags, allergens, ingredients, calories, protein_g, carbs_g, fat_g, fiber_g, is_vegetarian, is_vegan, is_gluten_free) values
(
  'Baked Salmon with Veggies',
  'Oven-baked salmon fillet with roasted asparagus and sweet potato. Omega-3 rich.',
  'dinner', 'Continental',
  '{"omega-3", "keto-friendly", "anti-inflammatory"}',
  '{"Fish"}',
  '{"salmon fillet", "asparagus", "sweet potato", "lemon", "dill", "olive oil", "garlic"}',
  480, 38, 28, 20, 5, false, false, true
),
(
  'Mixed Veg Khichdi',
  'Comforting rice and lentil porridge with seasonal vegetables. Easy on the stomach.',
  'dinner', 'Indian',
  '{"easy-digest", "light", "comfort food", "fever-friendly"}',
  '{}',
  '{"rice", "moong dal", "carrot", "peas", "beans", "turmeric", "cumin", "ghee"}',
  380, 14, 58, 8, 7, true, false, true
),
(
  'Grilled Paneer Tikka',
  'Chargrilled cottage cheese cubes marinated in yogurt and spices with bell pepper and onion.',
  'dinner', 'Indian',
  '{"high-protein", "vegetarian", "grilled"}',
  '{"Dairy"}',
  '{"paneer", "yogurt", "bell peppers", "onion", "tikka spices", "lemon", "chaat masala"}',
  440, 28, 18, 26, 4, true, false, true
),
(
  'Lemon Herb Chicken with Soup',
  'Roasted chicken thigh with a side of clear vegetable soup. Light and satisfying dinner.',
  'dinner', 'Continental',
  '{"high-protein", "light", "balanced"}',
  '{}',
  '{"chicken thigh", "lemon", "rosemary", "garlic", "mixed vegetables", "vegetable stock"}',
  420, 36, 18, 18, 5, false, false, true
),
(
  'Rajma Chawal',
  'Classic kidney bean curry with steamed rice. High fibre, deeply satisfying.',
  'dinner', 'Indian',
  '{"high-fiber", "vegan", "classic"}',
  '{}',
  '{"kidney beans", "rice", "onion", "tomato", "ginger", "garlic", "rajma masala", "coriander"}',
  500, 20, 82, 8, 14, true, true, true
);
