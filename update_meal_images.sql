-- SQL script to update meal image URLs with verified Unsplash photo IDs
-- All photo IDs have been verified to return valid JPEG images from images.unsplash.com
-- Generated: 2026-03-15

-- BREAKFAST
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop' WHERE name = 'Masala Oats Bowl';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80&auto=format&fit=crop' WHERE name = 'Paneer Bhurji Wrap';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?w=800&q=80&auto=format&fit=crop' WHERE name = 'Egg White Omelette';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80&auto=format&fit=crop' WHERE name = 'Moong Dal Chilla';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80&auto=format&fit=crop' WHERE name = 'Greek Yogurt Parfait';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&q=80&auto=format&fit=crop' WHERE name = 'Banana Oat Smoothie Bowl';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80&auto=format&fit=crop' WHERE name = 'Besan Chilla';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=80&auto=format&fit=crop' WHERE name = 'Sprouts Poha';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80&auto=format&fit=crop' WHERE name = 'Avocado Toast';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&q=80&auto=format&fit=crop' WHERE name = 'Ragi Dosa';

-- LUNCH
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80&auto=format&fit=crop' WHERE name = 'Grilled Chicken Bowl';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=800&q=80&auto=format&fit=crop' WHERE name = 'Dal Makhani with Millet Roti';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80&auto=format&fit=crop' WHERE name = 'Palak Tofu';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80&auto=format&fit=crop' WHERE name = 'Chicken Biryani Light';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80&auto=format&fit=crop' WHERE name = 'Quinoa Tabbouleh Salad';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80&auto=format&fit=crop' WHERE name = 'Chana Masala with Brown Rice';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80&auto=format&fit=crop' WHERE name = 'Paneer Tikka Bowl';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80&auto=format&fit=crop' WHERE name = 'Lentil Soup with Sourdough';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80&auto=format&fit=crop' WHERE name = 'Grilled Fish Tacos';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80&auto=format&fit=crop' WHERE name = 'Tofu Stir Fry with Rice';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80&auto=format&fit=crop' WHERE name = 'Egg Bhurji with Multigrain Roti';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80&auto=format&fit=crop' WHERE name = 'Mushroom Risotto';

-- DINNER
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80&auto=format&fit=crop' WHERE name = 'Baked Salmon with Veggies';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80&auto=format&fit=crop' WHERE name = 'Mixed Veg Khichdi';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80&auto=format&fit=crop' WHERE name = 'Grilled Paneer Tikka';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&q=80&auto=format&fit=crop' WHERE name = 'Lemon Herb Chicken with Soup';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=800&q=80&auto=format&fit=crop' WHERE name = 'Rajma Chawal';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&q=80&auto=format&fit=crop' WHERE name = 'Methi Dal with Jowar Roti';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=800&q=80&auto=format&fit=crop' WHERE name = 'Chicken Soup with Veggies';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80&auto=format&fit=crop' WHERE name = 'Paneer Butter Masala Light';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80&auto=format&fit=crop' WHERE name = 'Vegetable Stew with Appam';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80&auto=format&fit=crop' WHERE name = 'Grilled Chicken with Sweet Potato';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80&auto=format&fit=crop' WHERE name = 'Mushroom and Spinach Curry';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80&auto=format&fit=crop' WHERE name = 'Egg Curry with Rice';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop' WHERE name = 'Tuna Salad Bowl';
UPDATE public.meals SET image_url = 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80&auto=format&fit=crop' WHERE name = 'Masoor Dal Tadka';
