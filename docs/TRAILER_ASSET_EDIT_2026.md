# Trailer 2026 — asset edit & narrative rationale

This release replaces the previous slideshow-like 17 shots with a **28-beat, ~73-second story-led trailer**, using only files that already exist in the game. It is an **asset-based motion-graphics trailer**, not an exported MP4 or a genuine recording of gameplay. The interaction overlays are editorial recreations of features currently present in game.js.

## Promise to the player

**Observe → compare evidence → make a consequential choice.**

A photograph reveals something absent from the world. The person who brought the group to Đồng Chay has a personal reason. The house has evidence of a deliberately falsified account. Different years conceal different events. An object that looks like a solution might instead cause harm.

The ending withholds the answer: it invites the player to determine whether to break the seal or investigate further.

## Shot-to-asset map (and WHY)

| Asset | Narrative job |
|---|---|
| BG42 → props/Anh_Gieng_Hai_Bong.webp | Hook: a contradiction between an empty well and two figures in Chi's photograph. Never claim their identities are confirmed. |
| BG01 → props/POV_Ba_Ban_Nuoc.webp | A personal motive. Vy asks about bà Cúc; the vendor reacts with an actual line from reviewed.js. |
| BG06 → BG08 → BG09 | Physical journey into the mansion; invite viewers into a location they can explore. |
| trailer/gp1.webp | Actual gameplay screenshot showing an explorable location and inventory. |
| trailer/gp2.webp | Actual gameplay screenshot showing the stopped 03:17 clock and inspect interface. |
| BG16 → props/POV_Guong_Phong_Tre.webp | Reconstructed point-and-click / camera interface (not a screen recording). |
| BG32 → props/Closeup02_Papers.webp | Player moves from observing locations to testing conflicting written evidence. |
| props/Hoi_Uc_Sim_1986.webp → BG19 → props/Hoi_Uc_Can_Ham_1988.webp | Differentiate events in 1986 and 1988, without merging their causes or victims. |
| props/Hoi_Uc_So_Sach_1988.webp → props/Hoi_Uc_Phong_Tre_1988.webp | Put real human stakes behind the evidence. Do not reveal the relationship between Nhài and Quyên. |
| BG42 → BG29 | Consequences and memory, not jump scares. Do not narrate the publicly hidden number of workers. |
| BG40 → props/Closeup03_SquareSeal.webp → props/POV_Gieng_Tram.webp | A consequential decision. Exact game option strings: “Vẫn kéo ấn ra”, “Dừng lại và điều tra tiếp”. No click or ending shown. |
| BG09 + assets/logo.webp | Call to action: the viewer needs to PLAY to settle the question. |

## Excluded assets

- **gp3.webp** includes old Sim/Đạt labels, not current Quế/Tùng.
- **gp4.webp** has old Ánh label instead of Chi.
- **gp5.webp** includes old names and spoilers.
- Ending frames would give away endings rather than establish player agency.

## Production constraints

- Source-of-truth: docs/COT_TRUYEN_MAI_2026.md, game.js, assets/dialogue/reviewed.js, assets/research/books-data.js.
- Legacy docs are explicitly archived; do not mix Sim/Mơ storyline into Mai 2026.
- Soundtrack assets/sound/trailer.mp3. Trigger contextual diegetic cues from existing shutter, page-turn, door slam, knocking and water files.
- Sound cues trigger on natural playback only; seeking does not trigger cues.
- Music, pause, mute, skip, replay, keyboard seeking, lower-motion setting and mobile controls remain available.
- Film typography and cool grading are secondary to the clue → inference → choice sequence.
- To make a true gameplay-capture trailer in future, record actual footage from the game UI. Do not refer to these CSS/DOM interaction overlays as authentic screen recordings.

## Review questions

1. In 3 seconds, does the photograph establish a concrete unanswered mystery?
2. Does the player see how to examine an object rather than just read “KHÁM PHÁ”?
3. Does the document comparison show a choice to evaluate evidence, not a solved answer?
4. Are 1986 and 1988 distinct historical threads?
5. Does the final question require the viewer to play to answer it?
