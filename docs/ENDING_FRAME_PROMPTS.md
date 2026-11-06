# Prompt tạo frame phim kết thúc (bản gợi cảm xúc)

Bộ này mở rộng từ 3 lên **6 frame mỗi ending (24 ảnh)** để người chơi có thời gian cảm. Mỗi ending đi theo một đường cong cảm xúc, không chỉ "đổi cảnh":

`mở (lặng) → chi tiết (đồ vật nhớ) → con người (quay lưng) → bước ngoặt → hệ quả → dư âm (đọng lại)`

Gợi ý nhịp phát trong game: 7–9 giây mỗi frame, frame cuối giữ 11–12 giây. Đặt tên file `bad_01.webp … bad_06.webp` (tương tự cho `normal_`, `good_`, `true_`) rồi thêm vào `FRAMES` trong `ending-cinematic.js`.

## 1. Quy tắc chung (dán vào đầu MỌI prompt)

**Tiền tố phong cách (STYLE):**

> Use case: illustration-story. ONE original standalone full-bleed 16:9 widescreen landscape film still, 1672x941, for a Vietnamese folk horror point-and-click game's ending cinematic. Photorealistic cinematic matte painting, rural northern Vietnam, aged brick and lime plaster, tropical forest, banyan roots, jasmine, rain and low mist. Natural motivated lighting, shallow depth of field, fine film grain, restrained muted palette, 35mm anamorphic feel. Grounded, quiet, emotionally honest; no graphic violence, no gore, no monsters in plain sight. No panels, no frames, no collage, no UI, no typography, no legible text or numerals, no watermark. Keep the lower fifth calm and darker for separately overlaid Vietnamese subtitles. Faces, if any, are distant, backlit or turned away.

**Khối nhân vật (CAST), dán thêm khi frame có người — giữ nguyên chữ để ảnh nhất quán:**

> Mai: Vietnamese girl of about eighteen, long black hair tied low, faded brown ao ba ba, plain cloth scarf, slim. Lành: Mai's mother, early forties, dark headscarf, worn indigo blouse, gentle posture. Phúc: Mai's younger brother, about seven, short hair, oversized cream shirt. Nhài: Vietnamese girl about seven in 1988, two small braids, pale blouse, jasmine in hair. Quyên: Nhài's birth mother, thirties, 1980s peasant clothes. Hưng: elderly man, thin, dark old suit, hunched, always seen from behind or far away.

**Mẹo giữ nhất quán giữa các frame:**
- Tạo cả 6 frame của một ending **trong cùng một phiên**, và nhắc lại "same location, same architecture, same color grade as the previous frame" ở frame 2 trở đi.
- Cố định bảng màu từng ending (ghi ở mục riêng) và dán lại dòng `PALETTE`.
- Chỉ cho **một điểm sáng** mỗi frame (một đèn, một khe nắng, một bông hoa) để mắt người chơi biết nhìn đâu.
- Nếu mặt người hiện rõ, tạo lại với "face fully turned away or in deep shadow".
- Xuất WebP chất lượng 90, giữ 1672×941. Nên thêm nạp trước ảnh ở frame kế tiếp.

---

## 2. BAD — "Ấn vỡ" (cảm xúc: hoảng loạn → bất lực → lạc lối)

`PALETTE:` indigo-black, cold teal, sickly desaturated green, single faint red glow.
Âm thanh gợi ý: `ambient_house.mp3`, thêm tiếng nước trầm, không nhạc.

| # | Nhịp cảm xúc | Chuyển động CSS gợi ý |
|---|---|---|
| 1 | Sự tĩnh lặng trước khi vỡ | zoom chậm vào |
| 2 | Cái giá của sự vội vàng | pan ngang |
| 3 | Tiếng gõ phía sau cánh cửa | zoom vào khe cửa |
| 4 | Có người đang chạy | rung nhẹ |
| 5 | Không ai nghe thấy | zoom ra |
| 6 | Lạc lối | đứng yên, mờ dần |

**bad_01 — Sợi dây căng**
> STYLE + Rainy night in the abandoned courtyard of a Vietnamese villa. A mossy circular brick well, cracked concrete cap slid aside, wooden crossbeam, taut frayed rope pulled tight into the dark water. A bronze seal half-wrenched from a stone slot, the iron hook still caught on it. Ripples spread the wrong way, toward the viewer. Low angle, 28mm, rain streaks in the single cold lamp light. PALETTE. Dread of a mistake already made, completely still, no one visible.
> Phụ đề gợi ý: *Họ chỉ muốn kéo nhanh thôi. Chiếc ấn đã nhúc nhích.*

**bad_02 — Đồ vật rơi lại**
> STYLE + Same courtyard seconds later. In the wet mud beside the well: a dropped flashlight still lit, pointing at the wall; a torn jasmine sprig; one cloth shoe. A thin line of black water crawling across the bricks toward the lens. Extreme close low angle, shallow focus, the rain blurred into silver threads. PALETTE. Evidence of a sudden break, no people.
> *Ánh đèn rơi xuống đất. Không ai kịp nhặt.*

**bad_03 — Sau cánh cửa**
> STYLE + The locked basement door of the villa, heavy dark wood, iron and wood outer latch, damp coal soot, scratch marks on the lower inner edge. A thin watery blue-gray light seeps under the door, pooling on the stone floor. Dust floats in the beam. Straight-on symmetrical frame, silence, claustrophobic. No people, no hands. PALETTE.
> *Sau cánh cửa, những tiếng gõ vẫn chưa có người trả lời.*

**bad_04 — Chạy**
> STYLE + Narrow brick corridor of the abandoned villa, deep night. At the far end, a young woman's small backlit silhouette (CAST Mai, faceless) running away from the camera, one hand reaching to the wall, scarf trailing. Long lens compression, flickering amber light dying behind her, floor reflecting her. PALETTE. Motion-blurred, breathless, fear without a visible threat.
> *Cô chạy, nhưng hành lang cứ dài ra mãi.*

**bad_05 — Bóng không tên**
> STYLE + Moonlit well courtyard viewed from the villa's broken window frame in the foreground. Far across the yard five pale, indistinct, hazy figures stand shoulder to shoulder at the edge of the well, heads bowed, features lost in fog. Not threatening: pitiful, waiting to be named. Static, wide, very desaturated, faint red haze at the water line. PALETTE.
> *Họ đứng đó, chờ ai đó gọi đúng tên.*

**bad_06 — Con đường biến mất** (giữ lâu hơn)
> STYLE + A narrow wet footpath vanishing into impossibly dense pale fog in a night forest. Banyan roots frame both sides like ribs. At extreme distance one small turned-away young woman's silhouette (CAST Mai) is almost swallowed by the mist, one arm slightly raised as if calling. Faint red light inside the fog, no exit visible. Very wide, still, the lower third fading to black. PALETTE. Unresolved, lonely.
> *Con đường biến mất trong sương. Không ai được gọi đúng tên.*

---

## 3. NORMAL — "Ra khỏi rừng" (cảm xúc: nhẹ nhõm lẫn day dứt)

`PALETTE:` blue-gray dawn, moss green, a thin line of pale peach at the horizon.
Âm thanh: `nature_forest.mp3`.

| # | Nhịp cảm xúc | Chuyển động |
|---|---|---|
| 1 | Quyết định | zoom ra |
| 2 | Bước đầu tiên đi xa | pan theo con đường |
| 3 | Chia nhóm | đứng yên |
| 4 | Thở được | zoom vào nhẹ |
| 5 | Ngoái nhìn lại | pan chậm sang trái |
| 6 | Câu hỏi chưa có lời đáp | đứng yên, mờ dần |

**normal_01 — Cổng mở**
> STYLE + Very early dawn. The old iron gate of the abandoned villa pushed ajar in damp forest; the house only a vague dark shape behind thick leaves. A muddy path leads out into pale mist. Wide eye-level 35mm, cool blue-gray with a tiny peach glow far off. PALETTE. A sense of leaving, no people.
> *Cả nhóm chọn rời khỏi biệt thự Vân Hòa.*

**normal_02 — Năm đôi chân**
> STYLE + Low camera on the muddy lane: five pairs of travel-worn shoes and trouser legs walking away from the camera, wet leaves sticking to the ground, a backpack strap swinging. Faces out of frame. Soft focus background of the gate shrinking behind them. PALETTE. Tired, quiet solidarity.
> *Không ai nói gì. Họ chỉ bước.*

**normal_03 — Cầu gỗ**
> STYLE + A crooked wooden footbridge over a calm stream in a Vietnamese forest, bamboo and banana leaves, thin ground fog, the sky turning peach. Five small distant silhouettes (CAST: backs only) crossing in single file toward the village. Wide, symmetrical. PALETTE.
> *Con đường qua rừng đưa họ trở về làng.*

**normal_04 — Hơi thở đầu tiên**
> STYLE + Village outskirts at first light: a quiet earthen lane, a rice field, a rooster silhouette on a wall, smoke rising from one kitchen chimney. A warm yellow window light, the first sign of ordinary life. Medium wide, soft golden edge light. PALETTE with slightly warmer tones. Relief.
> *Làng vẫn dậy sớm như chưa có chuyện gì.*

**normal_05 — Ngoái lại**
> STYLE + From the far end of the lane, over the shoulder of a still, dark foreground figure's silhouette (backs only), the villa on the hill barely visible through trees and mist, a single glimmer in one upper window. Long lens, shallow depth, desaturated. PALETTE. Guilt and unanswered questions.
> *Phía sau hàng cây, ánh sáng nhỏ ấy vẫn chưa tắt.*

**normal_06 — Câu hỏi còn lại**
> STYLE + Empty muddy lane, wet leaves, a single abandoned jasmine sprig on the ground in the foreground, the villa a faint shape at the far end under thin morning mist. No people. Stillness, the lower third fading to dark. PALETTE.
> *Phía sau hàng cây, những câu hỏi vẫn chưa có lời đáp.*

---

## 4. GOOD — "Đưa những cái tên về" (cảm xúc: xót xa, được an ủi một nửa)

`PALETTE:` warm amber dawn, honey wood, soft jasmine white, with cool gray shadows.
Âm thanh: `music_box.mp3`, nhỏ.

| # | Nhịp cảm xúc | Chuyển động |
|---|---|---|
| 1 | Mang hồ sơ đến | zoom vào |
| 2 | Bàn tay run | đứng yên |
| 3 | Một cái tên được gọi | pan lên |
| 4 | Nhài về bên mẹ | zoom chậm |
| 5 | Nén hương | đứng yên |
| 6 | Giếng vẫn bịt | zoom ra, mờ dần |

**good_01 — Hồ sơ trên bàn**
> STYLE + A humble Vietnamese wooden table near a family ancestral altar, early dawn light through a lattice window. Worn old papers, a closed cloth journal, a faded family photograph with indistinct faces, a single jasmine sprig, brass incense bowl. Warm side light across the evidence. Close cinematic still life, 50mm, no readable writing. PALETTE. Respectful, solemn.
> *Những hồ sơ được đưa về cho gia đình người đã khuất.*

**good_02 — Bàn tay**
> STYLE + Extreme close-up of an old woman's weathered hands (no face) trembling slightly as they touch the edge of a faded photograph, light from a doorway across her knuckles, a cup of cooling tea nearby. Shallow depth of field, creamy amber background. PALETTE. Grief finally allowed.
> *Bao nhiêu năm, bà mới được cầm lại gương mặt ấy.*

**good_03 — Cái tên được gọi**
> STYLE + The modest house's front yard at dawn, an elderly woman and two neighbors (backs only, distant) standing before a small hastily arranged altar table with a bowl of rice, three sticks of incense, a picture of a smiling young woman, jasmine petals scattered. Mist behind. Wide, calm. PALETTE. The relief of being named.
> *Một cái tên được gọi, sau gần bốn mươi năm.*

**good_04 — Nhài bên mẹ**
> STYLE + In a traditional Vietnamese house at dawn, the soft backlit silhouettes of a young mother (CAST Quyên) and a little girl of about seven (CAST Nhài) embracing in an open doorway, faces turned away, old white cloth hanging softly nearby, first golden light in the yard. Intimate, melancholy yet hopeful. No halos, no ornament. PALETTE.
> *Nhài được ở bên mẹ.*

**good_05 — Nén hương**
> STYLE + A brass incense bowl with three burning sticks, smoke rising in a thin vertical line through a shaft of dawn light, jasmine petals on the altar cloth, a child's tiny cloth shoe beside it. Macro, very shallow depth. PALETTE. Quiet gratitude.
> *Khói hương lên. Có thể họ đã nghe thấy.*

**good_06 — Giếng vẫn bịt** (giữ lâu)
> STYLE + The abandoned villa courtyard at the start of morning: a round mossy brick well, the cracked concrete cover still in place, fresh white jasmine laid on it, old crossbeam and rope. Warm light touches the flowers but the forest behind remains shadowy. No broken seal, no figures. Wide, slow, poignant. PALETTE. A story half-closed.
> *Dưới giếng, chiếc ấn vẫn còn đó. Một câu chuyện vẫn chưa khép lại.*

---

## 5. TRUE — "Trả lại tên" (cảm xúc: giải thoát, nghẹn ngào, được đoàn tụ)

`PALETTE:` soft sunrise gold, moss green, pale mist white, a hint of rose in the sky.
Âm thanh: `music_box.mp3`, tăng nhẹ ở frame 5–6, kết bằng im lặng 1 giây.

| # | Nhịp cảm xúc | Chuyển động |
|---|---|---|
| 1 | Di vật được đặt xuống | zoom vào |
| 2 | Từng cái tên | pan chậm |
| 3 | Sự thật được nói ra | đứng yên |
| 4 | Ấn được tháo | zoom ra |
| 5 | Nước trong trở lại | pan xuống mặt nước |
| 6 | Đoàn tụ | đứng yên, kéo xa |

**true_01 — Di vật trên nền đá**
> STYLE + An ancient moss-covered stone clearing deep in a Vietnamese tropical forest at dawn, aged banyan roots, thin mist. On a flat stone: a broken wooden comb, a small worn embroidered cloth scarf, a torn piece of white cloth, a few jasmine blossoms. Soft dawn light through leaves. Wide low composition, 28mm. PALETTE. A quiet offering, no occult symbols, no blood.
> *Lược gãy. Khăn cũ. Mảnh áo. Những thứ cuối cùng của một gia đình.*

**true_02 — Gọi tên**
> STYLE + Same clearing, medium shot over a low stone: three burning incense sticks, an old rice bowl, mist threads curling up. In the blurred background, the small backs of the group (Khôi, Vũ, Hà, Chi, Vy) kneeling in a loose arc, heads bowed. Warm light shaft. PALETTE. Reverence.
> *Lành. Phúc. Mai. Những cái tên được gọi lại giữa rừng.*

**true_03 — Sự thật được nói ra**
> STYLE + The villa's old veranda at first light: an elderly man seen from behind (CAST Nguyên, white hair, dark jacket) standing alone before the group, one hand pressed to a pillar, head bowed, a worn notebook set on the stone step in front of him. The group blurred, silent, backs only. Cool light, long shadows. PALETTE. Confession and shame.
> *Ông Nguyên nói ra những điều đã giấu suốt bao năm.*

**true_04 — Ấn được tháo**
> STYLE + The courtyard well at late dawn: a small weathered bronze seal lying on dry stone beside the well, an iron hook set neatly nearby, a thin crack in the stone slot, a pale gold light slipping in. No explosions, no magic effects. Medium shot, calm, melancholy release. PALETTE.
> *Khi sự thật được nhìn nhận, chiếc ấn mới được tháo ra.*

**true_05 — Nước trong**
> STYLE + The surface of the well water seen from above, now perfectly still and clear, reflecting a clean pale sunrise sky and the tops of banyan leaves, a few white jasmine flowers drifting slowly. A tiny ring ripple, softly fading. Very shallow, quiet. PALETTE. Release, forgiveness.
> *Mặt nước đã lặng. Như chưa từng có gì ở dưới đó.*

**true_06 — Gia đình** (giữ lâu nhất, 11–12 giây)
> STYLE + Deep misty forest at soft sunrise; three backlit human silhouettes seen from behind at a respectful distance at the threshold of a simple old rural home: an adult mother (CAST Lành), her eighteen-year-old daughter (CAST Mai) and a young boy (CAST Phúc), standing close, the boy's hand in his sister's. Warm dawn rays against moss green and soft fog; no table, no bowl, no rice, no faces, no halos, no blood, no other people. Peaceful, understated final frame, lower third fading dark.
> *Mai được trở về bên mẹ và em. Không ai buộc cô phải quên.*

---

## 6. Kiểm tra trước khi đưa ảnh vào game

1. Dải đáy (khoảng 20% chiều cao) đủ tối để đọc phụ đề trắng.
2. Không có chữ, số, logo hoặc khuôn mặt rõ nét.
3. Mỗi frame có đúng một điểm sáng chính.
4. Bảng màu cùng ending khớp nhau khi xếp 6 ảnh cạnh nhau.
5. Cảm xúc đúng đường cong: BAD tụt dần, NORMAL nhẹ dần, GOOD ấm dần rồi chùng lại ở frame cuối, TRUE dâng đến frame cuối rồi lặng.
