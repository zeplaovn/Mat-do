# Image consistency audit

All listed images were edited using the built-in image generation tool. Scene images were exported as 1280 × 720 WebP, the portrait as 256 × 256 WebP, and inventory icons as 128 × 128 WebP with their generated alpha preserved. Source images are existing game assets.

The well memory was intentionally kept in daylight: its dialogue describes events before the night of the ceremony. The lantern has separate unlit and lit scene images; game state selects them when the narration reaches the lighting event.

## Scene and prop edits

### `background/BG05.webp`

References: `background/BG05.webp`.

> Use case: precise-object-edit. Asset: background of a Vietnamese folk horror game. Image 1 is the edit target. Remove every person from this shrine and path: the woman at the table, the woman at far left and both walkers at right. The shrine is unattended and quiet at night. Naturally reconstruct only the occluded ground and background. Preserve the original nighttime lighting, exact camera framing, banyan tree, small shrine and plaque, offering table with bowls and scroll, ground, railings and path in their original positions, because game interaction hotspots rely on them. No people, ghosts, new structures, text or watermark. Photorealistic.

### `background/variants/BG05-morning.webp`

References: `background/variants/BG05-morning.webp`.

> Use case: precise-object-edit. Asset: same game scene on an overcast morning. Image 1 is the edit target. Remove every person from the unattended shrine and path: the woman by the table, the person at left and both walkers on the right. Naturally reconstruct only the occluded ground and background. Preserve the exact original composition, camera angle, morning light, banyan roots, shrine and plaque, offering table with bowls and scroll, ground, railings and path positions: game hotspots depend on them. No people, ghosts, added structures, text or watermark. Photorealistic.

### `background/variants/BG45-night.webp`

References: `background/variants/BG45-night.webp`, `props/POV_Ong_Huu.webp`.

> Use case: compositing. Asset: night version of an in-game temple courtyard. Image 1 is the exact scene to edit; image 2 is identity reference for ông Hựu. Add the same elderly Vietnamese man from image 2, gray hair and dark brown traditional clothing, seated naturally behind the existing fortune-telling table at the RIGHT FOREGROUND of image 1, facing the viewer with head and torso visible above the table, believable life scale. Keep the plate of three coins, incense, table and stools visible. Preserve all architecture, frangipani tree, lighting, blue night sky, camera framing and positions of important objects, because game hotspots depend on them. Peaceful soft lantern light, no apparition, no extra people, no text or watermark. Photorealistic.

### `props/POV_Ba_Ban_Nuoc-night.webp`

References: `props/POV_Ba_Ban_Nuoc.webp`, `background/variants/BG01-night.webp`.

> Use case: lighting-weather. Asset: night dialogue close-up for a game. Image 1 is the edit target; image 2 is lighting and location reference. Show the SAME elderly tea seller, same face, clothing, black head wrap, pose and tea table as image 1. Change only the daytime light, sky and village background to match the quiet blue nighttime with warm lamps in image 2. Keep the banyan shrine, gate, tea service and framing recognizable in the same locations. The seller remains visible in soft warm light. Remove incidental daytime crowds. No extra people, monsters, text, interface or watermark. Photorealistic, calm.

### `props/POV_Ong_Huu-night.webp`

References: `props/POV_Ong_Huu.webp`, `background/variants/BG45-night.webp`.

> Use case: lighting-weather. Asset: night dialogue close-up for a game. Image 1 is the edit target; image 2 is the location and nighttime lighting reference. Preserve the SAME elderly man, face, dark brown clothes, pose, camera framing, table, teacup and plate with three coins from image 1. Change daylight and sky to the quiet blue night and warm lantern glow of image 2; keep the same temple and tree recognizable. His face and coins should remain readable for gameplay. No extra people, apparitions, text, interface or watermark. Photorealistic and peaceful.

### `props/Hoi_Uc_Can_Ham_1988.webp`

References: `props/Hoi_Uc_Can_Ham_1988.webp`.

> Use case: precise-object-edit. Asset: narrative flashback scene from inside a locked cellar. Image 1 is the exact target. The five adults are trapped INSIDE, while the lock is on the outside unseen. Remove the visible padlock, metal bolt and latch ONLY from the side of the wooden door facing the five people, and reconstruct ordinary plain aged door boards there. Keep exactly the same five adults in their poses, the same door, cellar, lighting, clothing, camera position and composition. No padlock, latch, crossbar or handle visible on the inside face of the door; no extra people, text, watermark or changes to the setting. Photorealistic.

### `portraits/08_Ba_Man_portrait.webp`

References: `props/POV_Ba_Man_Thuc.webp`, `portraits/09_Ong_Huu_portrait.webp`.

> Use case: identity-preserve. Asset: transparent dialogue portrait for the same game. Image 1 is the reference for the identity, facial features, apparent age and clothing of Bà Mận; image 2 is the reference for the front-facing head-and-shoulders framing and simple cutout portrait style. Create a portrait of the SAME elderly Vietnamese woman as image 1, grey hair under her black headscarf, weathered kindly face and plain dark brown rural clothing. Face slightly toward the viewer, shoulders and head in frame. Transparent background and clean alpha edge. No background, extra people, text, logo or watermark. Photorealistic.

### `items/17_An_Dong_128x128.webp`

References: `props/Closeup03_SquareSeal.webp`.

> Use case: identity-preserve. Asset: small transparent game inventory item icon. Image 1 is the reference for the exact artifact. Isolate the SAME antique bronze square seal: a square flat engraved stamping face with the simple row-of-vertical-strokes-crossed-by-one-horizontal-stroke motif and a short ornate rounded handle. Show the object alone at a three-quarter angle, centered with comfortable padding, fully within frame. Antique green-brown patina, realistic worn metal. Transparent background with clean edges. Do not make it circular. No people, text, watermarks, extra objects, glow or colored background.

### `props/Closeup02_Papers.webp`

References: `props/Closeup02_Papers.webp`, `props/Closeup03_SquareSeal.webp`.

> Use case: precise-object-edit. Asset: evidence illustration for a game. Image 1 is the exact scene to edit, image 2 is the seal face whose distinctive simple linear motif is the reference. On ONLY the right-hand paper, change the red square seal impression near the lower edge so its inner motif matches image 2: a square enclosing four upright parallel strokes crossed by one horizontal stroke. Keep the left old paper and its faded stamp unchanged. Preserve the positions and appearance of both documents, handwriting, tear, patch, lamp, fabric and table, same frame, light and camera. Do not add new text, objects, or people. A believable worn red ink impression, photorealistic.

### `background/BG46.webp`

References: `background/BG46.webp`, `props/POV_Mam_Le.webp`.

> Use case: compositing. Asset: wide game background of the offering table. Image 1 is the exact scene to edit, image 2 is the reference for the four-recess wooden tray. Add the SAME rectangular wooden tray with four circular recesses from image 2 on the central part of the table, small enough to fit alongside all the existing offerings and clearly visible, not hidden behind the food. Preserve the three offerings of rice, water and flowers and the three lamps exactly as they are, with TWO front lamps lit and ONE front right lamp unlit. Preserve the shrine, banyan, scroll, incense burner, camera angle, scene lighting and positions of important existing objects; hotspots depend on them. No people, writing or watermark. Photorealistic.

### Temple lighting and coin follow-ups

`background/variants/BG45-night.webp` was edited again to match the three coins in the dialogue close-up, then used as the basis for the daylight image `background/BG45.webp`.

> Use case: precise-object-edit. Image 1 is the exact nighttime game scene to edit; image 2 is a close-up reference of the same plate. The porcelain plate on the foreground table currently shows TWO old bronze coins. Add ONE matching coin so that the plate contains exactly THREE clearly separate bronze coins with square holes, arranged side by side, like image 2. Make the third coin physically sit inside the dish. Change only that tiny detail. Keep the same elderly man, temple, table, tree, blue night sky, lighting, perspective, objects and framing. No other changes, no text or extra people.

> Use case: lighting-weather. Image 1 is the exact edit target, image 2 is the reference for matching this courtyard's daytime light. Make Image 1 into a natural calm morning scene, changing only the blue night lighting and sky to soft daylight like image 2. Preserve all composition, the same elderly man sitting behind the table, the temple, the tree, and especially the THREE bronze coins on the porcelain plate in front of the man: all three coins must remain clearly visible and separate. Preserve exact camera angle, object positions and framing. Do not add, remove or cover any coin. No other people, text, or watermark. Photorealistic.

### `background/variants/BG46-lit.webp`

Reference: `background/BG46.webp`.

> Use case: precise-object-edit. Asset: alternate state of the same game scene after the unlit lamp catches fire. Image 1 is the exact target. Light ONLY the wick of the right-hand front oil lamp, giving it one small natural orange flame like the two already-lit front lamps and subtle local warm illumination. Keep every other pixel of the composition as close as possible: exactly three lamps across the front, rice, water, white flowers, the four-hole wooden tray, incense burner, scroll, red cloth, shrine, tree, framing and perspective must stay in the same positions because clickable hotspots rely on them. No people, text, extra objects or other changes. Photorealistic.

## Inventory icons

### `items/06_Thanh_Sat_128x128.webp`

> Use case: background-extraction. Asset: photorealistic inventory icon for a Vietnamese folk-horror game. Image 1 is the reference object. Recreate the same type of object cleanly, isolated and centered with generous transparent padding. The original has erroneous red, white, gray and black rectangular background remnants: remove all such artifacts completely. Preserve realistic worn materials and subdued colors. Transparent background with clean alpha, no background, floor, shadow rectangle, text, lettering, numbers, UI or watermark. A single old rusty iron crowbar with a hooked, bent end, fully visible.

### `items/07_Khan_Vai_128x128.webp`

> Use case: background-extraction. Asset: photorealistic inventory icon for a Vietnamese folk-horror game. Image 1 is the reference object. Recreate the same type of object cleanly, isolated and centered with generous transparent padding. The original has erroneous red, white, gray and black rectangular background remnants: remove all such artifacts completely. Preserve realistic worn materials and subdued colors. Transparent background with clean alpha, no background, floor, shadow rectangle, text, lettering, numbers, UI or watermark. A small folded, worn gray cloth scarf, frayed edges, no other object.

### `items/09_Tram_Go_128x128.webp`

> Use case: background-extraction. Asset: photorealistic inventory icon for a Vietnamese folk-horror game. Image 1 is the reference object. Recreate the same type of object cleanly, isolated and centered with generous transparent padding. The original has erroneous red, white, gray and black rectangular background remnants: remove all such artifacts completely. Preserve realistic worn materials and subdued colors. Transparent background with clean alpha, no background, floor, shadow rectangle, text, lettering, numbers, UI or watermark. A single broken aged wooden hairpin, pointed narrow shaft and a modest carved flower on one end.

### `items/10_Manh_Don_128x128.webp`

> Use case: background-extraction. Asset: photorealistic inventory icon for a Vietnamese folk-horror game. Image 1 is the reference object. Recreate the same type of object cleanly, isolated and centered with generous transparent padding. The original has erroneous red, white, gray and black rectangular background remnants: remove all such artifacts completely. Preserve realistic worn materials and subdued colors. Transparent background with clean alpha, no background, floor, shadow rectangle, text, lettering, numbers, UI or watermark. One irregular torn fragment of old cream-colored paper, its surface blank without seals or writing.

### `items/11_Dep_Vai_128x128.webp`

> Use case: background-extraction. Asset: photorealistic inventory icon for a Vietnamese folk-horror game. Image 1 is the reference object. Recreate the same type of object cleanly, isolated and centered with generous transparent padding. The original has erroneous red, white, gray and black rectangular background remnants: remove all such artifacts completely. Preserve realistic worn materials and subdued colors. Transparent background with clean alpha, no background, floor, shadow rectangle, text, lettering, numbers, UI or watermark. One pair of old worn cloth sandals placed side by side, both fully visible.

### `items/12_Chuong_Dong_128x128.webp`

> Use case: background-extraction. Asset: photorealistic inventory icon for a Vietnamese folk-horror game. Image 1 is the reference object. Recreate the same type of object cleanly, isolated and centered with generous transparent padding. The original has erroneous red, white, gray and black rectangular background remnants: remove all such artifacts completely. Preserve realistic worn materials and subdued colors. Transparent background with clean alpha, no background, floor, shadow rectangle, text, lettering, numbers, UI or watermark. A single small old bronze bell with a short red cord, fully visible.

### `items/14_Chia_Kho_128x128.webp`

> Use case: background-extraction. Asset: photorealistic inventory icon for a Vietnamese folk-horror game. Image 1 is the reference object. Recreate the same type of object cleanly, isolated and centered with generous transparent padding. The original has erroneous red, white, gray and black rectangular background remnants: remove all such artifacts completely. Preserve realistic worn materials and subdued colors. Transparent background with clean alpha, no background, floor, shadow rectangle, text, lettering, numbers, UI or watermark. A single small old bronze key, fully visible.

### `items/15_Nam_Nen_Nhang_128x128.webp`

> Use case: background-extraction. Asset: photorealistic inventory icon for a Vietnamese folk-horror game. Image 1 is the reference object. Recreate the same type of object cleanly, isolated and centered with generous transparent padding. The original has erroneous red, white, gray and black rectangular background remnants: remove all such artifacts completely. Preserve realistic worn materials and subdued colors. Transparent background with clean alpha, no background, floor, shadow rectangle, text, lettering, numbers, UI or watermark. Exactly FIVE separate straight unlit red incense sticks, arranged side by side; clearly show both ends of each of the five sticks. No bundle, smoke or flame.

### `items/16_Loi_Khai_128x128.webp`

> Use case: background-extraction. Asset: photorealistic inventory icon for a Vietnamese folk-horror game. Image 1 is the reference object. Recreate the same type of object cleanly, isolated and centered with generous transparent padding. The original has erroneous red, white, gray and black rectangular background remnants: remove all such artifacts completely. Preserve realistic worn materials and subdued colors. Transparent background with clean alpha, no background, floor, shadow rectangle, text, lettering, numbers, UI or watermark. A single folded creased sheet of aged paper, blank and without visible writing or stamp.

### `items/20_So_Gia_128x128.webp`

> Use case: background-extraction. Asset: photorealistic inventory icon for a Vietnamese folk-horror game. Image 1 is the reference object. Recreate the same type of object cleanly, isolated and centered with generous transparent padding. The original has erroneous red, white, gray and black rectangular background remnants: remove all such artifacts completely. Preserve realistic worn materials and subdued colors. Transparent background with clean alpha, no background, floor, shadow rectangle, text, lettering, numbers, UI or watermark. A partially unrolled old paper scroll with one clearly visible lighter patch of newer paper attached to it, tied with a brown cord; all surfaces blank.

### `items/21_So_Goc_128x128.webp`

> Use case: background-extraction. Asset: photorealistic inventory icon for a Vietnamese folk-horror game. Image 1 is the reference object. Recreate the same type of object cleanly, isolated and centered with generous transparent padding. The original has erroneous red, white, gray and black rectangular background remnants: remove all such artifacts completely. Preserve realistic worn materials and subdued colors. Transparent background with clean alpha, no background, floor, shadow rectangle, text, lettering, numbers, UI or watermark. One partially unrolled old paper scroll, no added patch, tied with a dark cord; the paper is blank and weathered.

### `items/22_Thu_Sim_128x128.webp`

> Use case: background-extraction. Asset: photorealistic inventory icon for a Vietnamese folk-horror game. Image 1 is the reference object. Recreate the same type of object cleanly, isolated and centered with generous transparent padding. The original has erroneous red, white, gray and black rectangular background remnants: remove all such artifacts completely. Preserve realistic worn materials and subdued colors. Transparent background with clean alpha, no background, floor, shadow rectangle, text, lettering, numbers, UI or watermark. A small old folded paper letter tied with a dark indigo fabric ribbon; paper surface blank.

### `items/23_Bup_Be_Vai_128x128.webp`

> Use case: background-extraction. Asset: photorealistic inventory icon for a Vietnamese folk-horror game. Image 1 is the reference object. Recreate the same type of object cleanly, isolated and centered with generous transparent padding. The original has erroneous red, white, gray and black rectangular background remnants: remove all such artifacts completely. Preserve realistic worn materials and subdued colors. Transparent background with clean alpha, no background, floor, shadow rectangle, text, lettering, numbers, UI or watermark. A small hand-sewn cloth doll with black yarn pigtails and a faded blue-gray floral dress; reproduce the reference doll's appearance, all limbs visible.

### `items/24_Xe_Go_128x128.webp`

> Use case: background-extraction. Asset: photorealistic inventory icon for a Vietnamese folk-horror game. Image 1 is the reference object. Recreate the same type of object cleanly, isolated and centered with generous transparent padding. The original has erroneous red, white, gray and black rectangular background remnants: remove all such artifacts completely. Preserve realistic worn materials and subdued colors. Transparent background with clean alpha, no background, floor, shadow rectangle, text, lettering, numbers, UI or watermark. A small old wooden toy cart with wooden wheels, the entire cart clearly visible.
