-- Seed popular items for initial monitoring
insert into public.items (id, name, tier, enchantment, category, subcategory) values
  ('T4_METALBAR', 'Steel Bar', 4, 0, 'material', 'metal'),
  ('T4_LEATHER', 'Worked Leather', 4, 0, 'material', 'leather'),
  ('T4_CLOTH', 'Linen Cloth', 4, 0, 'material', 'cloth'),
  ('T4_PLANKS', 'Pine Planks', 4, 0, 'material', 'wood'),
  ('T5_METALBAR', 'Titanium Steel Bar', 5, 0, 'material', 'metal'),
  ('T5_LEATHER', 'Cured Leather', 5, 0, 'material', 'leather'),
  ('T5_CLOTH', 'Silk Cloth', 5, 0, 'material', 'cloth'),
  ('T5_PLANKS', 'Larch Planks', 5, 0, 'material', 'wood'),
  ('T6_METALBAR', 'Runite Steel Bar', 6, 0, 'material', 'metal'),
  ('T6_LEATHER', 'Hardened Leather', 6, 0, 'material', 'leather'),
  ('T6_CLOTH', 'Phoenix Cloth', 6, 0, 'material', 'cloth'),
  ('T6_PLANKS', 'Yew Planks', 6, 0, 'material', 'wood'),
  ('T7_METALBAR', 'Meteoric Steel Bar', 7, 0, 'material', 'metal'),
  ('T7_LEATHER', 'Reinforced Leather', 7, 0, 'material', 'leather'),
  ('T8_METALBAR', 'Adamantium Steel Bar', 8, 0, 'material', 'metal'),
  ('T8_LEATHER', 'Fortified Leather', 8, 0, 'material', 'leather'),
  ('T4_BAG', 'Adept Bag', 4, 0, 'accessory', 'bag'),
  ('T5_BAG', 'Expert Bag', 5, 0, 'accessory', 'bag'),
  ('T6_BAG', 'Master Bag', 6, 0, 'accessory', 'bag'),
  ('T3_MOUNT_HORSE', 'Journeyman Riding Horse', 3, 0, 'mount', 'horse'),
  ('T4_MOUNT_HORSE', 'Adept Riding Horse', 4, 0, 'mount', 'horse'),
  ('T5_MOUNT_HORSE', 'Expert Riding Horse', 5, 0, 'mount', 'horse'),
  ('T5_MOUNT_ARMOREDHORSE', 'Expert Armored Horse', 5, 0, 'mount', 'horse'),
  ('T4_POTION_HEAL', 'Adept Healing Potion', 4, 0, 'consumable', 'potion'),
  ('T5_POTION_HEAL', 'Expert Healing Potion', 5, 0, 'consumable', 'potion'),
  ('T4_MEAL_STEW', 'Adept Bean Salad', 4, 0, 'consumable', 'food'),
  ('T5_MEAL_STEW', 'Expert Bean Salad', 5, 0, 'consumable', 'food'),
  ('T4_ORE', 'Titanium Ore', 4, 0, 'resource', 'ore'),
  ('T5_ORE', 'Runite Ore', 5, 0, 'resource', 'ore'),
  ('T6_ORE', 'Meteorite Ore', 6, 0, 'resource', 'ore'),
  ('T4_HIDE', 'Thick Hide', 4, 0, 'resource', 'hide'),
  ('T5_HIDE', 'Robust Hide', 5, 0, 'resource', 'hide'),
  ('T4_FIBER', 'Cotton', 4, 0, 'resource', 'fiber'),
  ('T5_FIBER', 'Flax', 5, 0, 'resource', 'fiber'),
  ('T4_WOOD', 'Pine Log', 4, 0, 'resource', 'wood'),
  ('T5_WOOD', 'Cedar Log', 5, 0, 'resource', 'wood'),
  ('T4_ROCK', 'Sandstone', 4, 0, 'resource', 'rock'),
  ('T5_ROCK', 'Travertine', 5, 0, 'resource', 'rock')
on conflict (id) do update set
  name = excluded.name,
  tier = excluded.tier,
  category = excluded.category,
  subcategory = excluded.subcategory;

-- Seed initial settings
insert into public.settings (player_name, notification_threshold, preferred_cities)
values ('AlguemMeAjudaPF', 10, array['Bridgewatch','Fort Sterling','Lymhurst','Martlock','Thetford','Caerleon']::text[]);
