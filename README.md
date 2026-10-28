# Arrow Flow

**See. Decide. Move.**

A lightweight visual cue tool for self-designed movement drills. Random arrows, colors, and numbers give you a prompt; you decide how to respond. Use it alongside badminton or tennis practice, with cones or floor markers, with a partner, or for stationary reaction games.

[Open Arrow Flow](https://yihuixiong.github.io/arrow-flow/) · [How to play](https://yihuixiong.github.io/arrow-flow/#guide) · [About & science](https://yihuixiong.github.io/arrow-flow/#about)

English and 简体中文 are available in **Settings → Appearance → Language**. The choice and your training settings are saved in this browser.

## Start in a minute

1. Put the device where you can see it, outside the movement path. Choose a base position and agree on a cue-to-action rule.
2. Choose **Arrows** or **Numbers**. For your first trial, ignore color and use only direction or number. Try the **Easy** preset, 10 rounds, and one set.
3. Read the cue, complete the agreed movement, and return to base. Increase the wait time if recovery takes longer. Add one extra rule only after the basic task is clear.

This is a practical starting example, not a research-validated training dose. Choose actions and distances you can control.

## Ways to play

| Drill | What the cue means | Example |
| --- | --- | --- |
| Direction response | Arrow selects a direction from the player's perspective. | Right arrow → move right, shadow a familiar stroke or touch a marker, then recover. Begin with two or four directions. |
| Numbered targets | Number selects a labeled cone or floor spot. | Label targets 1–5 and set the range to 1–5. A 3 → target 3 → agreed action → base. |
| Destination + action | Arrow/number chooses where; color chooses what. | Green 3 → touch target 3. Blue 3 → shadow a stroke at target 3. Start with two distinct colors. |
| Color destinations | Color selects a colored target; number selects a pre-agreed action. | Blue → blue cone; 1 → touch, 2 → shadow. Keep the same mapping throughout the set. |
| Number repeat | Compare the number with the immediately preceding displayed number. | 2 → target 2; 4 → target 4; 4 → stay at base and shadow; 1 → target 1. Ignore background color. |
| Arrow-color repeat | In random-color **arrow mode**, compare arrow colors. | Same color as last cue → stationary action; otherwise follow the arrow. Use at least two distinct colors. |
| Hold / no-go | A designated number or color means do not leave base. | Yellow, or number 5 → hold ready position; reassess the next cue normally. |
| Partner / opposite rule | A partner calls cues, or the agreed movement is opposite the arrow. | One person calls, the other moves; swap next set. Or right arrow → left, up arrow → backward. |

Rules are applied by the people playing. The app does **not** judge whether you followed a rule, detect your movements, or score success. The repeat examples are manual rules, not selectable built-in game modes.

For repeat drills, the first cue of each set uses the normal rule. Compare successive displayed cues, not blank intervals. A third consecutive match triggers the exception again. The repeat exception takes priority over the normal movement rule; reset memory between sets.

### Randomness matters

- Numbers are sampled independently from the inclusive integer range, default **1–5**. Repeated numbers are possible but never guaranteed in a short set.
- Number-mode backgrounds avoid the immediately previous palette entry when more than one color is present. With distinct palette colors, a background-color repeat rule will therefore **not** trigger. Use number repeats or random arrow-color repeats instead. Duplicate-looking swatches should be avoided when defining rules.
- Random arrow colors are sampled independently, so repeats are possible. Two-direction arrows may repeat. Four- and eight-direction arrows exclude the previous direction.
- Colors and destinations do not have built-in meanings. Match the palette and range to your targets. When color is hard to distinguish, use number-only rules.

## Settings and controls

- **Arrows:** two, four, or eight directions; fixed, custom, or random colors.
- **Numbers:** configurable integer range (0–999) and an editable background palette.
- **Timing:** cue duration plus a blank wait before the next cue. Fixed and random wait modes each have Easy, Standard, and Fast presets. Random timing changes onset uncertainty; it is not inherently better for learning.
- **Sets:** round presets and custom values, set count, and optional rest. Rest uses a black screen and countdown ring; the final three seconds prepare the next set.
- **Sound:** optional cue sounds and volume. Sound marks a new cue; it does not encode direction, number, or a particular action. Enable it through a user tap when required by the browser.
- **Fullscreen:** manual corner icon. Support depends on the browser; an unsupported browser receives a short explanation. On iPhone, opening from the Home Screen is an alternative to ordinary browser chrome.
- **Pause / stop:** on-screen controls; Space pauses/resumes and Escape ends a session outside dialogs. When supported, Escape first leaves native fullscreen.

Rounds count **displayed cues**, not completed movements. The bottom progress bar shows the current set. Arrow Flow does not record reaction times, accuracy, movement quality, or brain activity. A partner can manually tally missed cues, wrong choices, or loss of balance while keeping conditions consistent.

## Why these drills, and what the research actually says

The design links a visual cue to response selection and movement. Repeat or hold rules add a requirement to remember a preceding cue or withhold the default response. These are descriptions of the task, not evidence of improvements in general attention, working memory, inhibition, or sporting performance.

Racket-sport anticipation also requires information this app does not provide: opponent body/racket motion, ball or shuttle flight, and rally context. For that goal, combine symbol drills with partner feeds, live practice, or sport-specific video work.

Selected findings:

- **Balser et al., 2014:** tennis/volleyball expertise was associated with sport-specific neural activity during serve anticipation. An association is not evidence that a generic cue app changes those networks. [Study](https://doi.org/10.3389/fnhum.2014.00568)
- **Liu et al., 2017:** real badminton training was accompanied by anticipation-efficiency and ERP changes. This did not test Arrow Flow. [Study](https://doi.org/10.1016/j.neulet.2017.08.038)
- **Broadbent et al., 2017:** training with rally-sequence tennis footage benefited overall field decision time relative to isolated-shot practice; effects depended on the outcome and context. [Study](https://doi.org/10.1371/journal.pone.0174311)
- **Wang et al., 2025:** improvements in several badminton anticipation tasks did not extend to significant training effects on the match-video task. [Study](https://doi.org/10.1038/s41598-025-93475-7)
- **Müller et al., 2024:** a meta-analysis found transfer benefits for sport-specific temporal-occlusion training. **Fransen, 2024**, a commentary, cautioned against broad claims for generic training tools. These address different forms of practice. [Meta-analysis](https://doi.org/10.1007/s40279-024-02073-6) · [Commentary](https://doi.org/10.1007/s40279-024-02060-x)

Arrow Flow has not undergone a controlled efficacy study. No claim is made that faster responses here improve match anticipation, results, or a neurological condition. See [RESEARCH.md](RESEARCH.md) for the evidence-to-design rationale and study limitations.

## 简体中文快速说明

先约定提示对应的动作，再开始。箭头可以表示移动方向；数字可以表示编号桩或标志桶；颜色可以表示动作类型，也可以反过来表示彩色目标。

例如：绿色 3 = 到 3 号触碰标记；蓝色 3 = 到 3 号做一次熟悉的无球挥拍。先只看箭头或数字，再逐步加入颜色。

重复玩法：数字连续重复时，改为原地动作；或者在随机彩色箭头模式中，箭头颜色重复时改为原地动作。**数字模式背景色目前避免连续重复**，因此不能用背景色重复作为触发条件。每组第一条正常执行，换组后重新记忆。规则由人执行，应用不会自动判断对错。

玩法说明和关于研究均可在主页打开，也支持中英文切换。它是辅助提示工具；读对手动作、预判来球仍需具体项目的练习。

## Development

No framework, installation, or build step is needed to serve the app.

| File | Responsibility |
| --- | --- |
| `index.html` | Training UI and information-page shells |
| `styles.css` | Layout, themes, typography, animation, and field notes |
| `app.js` | Session timing, cues, settings, audio, and fullscreen |
| `i18n.js` | Core Chinese/English interface translations |
| `info.js` | Bilingual How to play / About content and hash navigation |
| `theme.js` | Saved theme before first paint |
| `version-assets.mjs` | Content hashes for CSS/JS URLs |
| `build-offline.mjs` | Self-contained offline HTML generator |

GitHub Pages serves the files from the repository root. The Sites checkout keeps public files in `dist/` and tooling at its root. Both scripts detect the layout automatically.

For a local preview, run `python3 -m http.server 8000` from the folder containing `index.html`, then open `http://localhost:8000`.

Before publishing source changes:

```sh
node --check app.js
node --check i18n.js
node --check info.js
node version-assets.mjs
node build-offline.mjs
```

In the Sites checkout, prepend `dist/` to the three syntax-check paths. Commit the source changes and versioned `index.html`; GitHub Pages deploys from `main`.

`node build-offline.mjs [output-path]` produces `Arrow-Flow-Offline.html` by default. It embeds the styles, scripts, icons, font, audio, and both information pages. External research articles still require internet access. Edit the source files rather than the generated offline HTML.

Settings stay in this browser's `localStorage` (`arrow-flow`); there is no account or training-results database. The bundled Figtree font carries its SIL Open Font License in `styles.css`.

## Landing page

Open [the landing page](https://yihuixiong.github.io/arrow-flow/landing.html) for an introduction, an interactive arrow/number preview, a complete on-page field guide, and illustrated About/research sections. Guide and About navigation stays on the landing page; only explicit training buttons enter the app. The existing app remains at the root URL.

The landing page is buildless and separate from the training runtime: `landing.html`, `landing.css`, `landing.js`, and `walkthrough.js`. It supports English and Chinese and shares the app’s saved language preference. The preview is illustrative and advances on request; it does not start a training session or play sound. Run `node version-assets.mjs` after changing either app or landing-page assets.

All landing-page iconography uses inline SVG to avoid iOS emoji substitution. The mobile header includes a book icon linking to the drill guide. The sample cue has a localized direction or number/color description, also announced to screen readers after interaction.

The field guide includes three deterministic walkthroughs (direction, number plus color, and number repeats), an animated example floor plan, individual cue selection, manual advance, opt-in playback, and a fixed/random interval illustration. These are teaching examples, not additional training modes or movement tracking. Playback pauses when the example leaves view or the page becomes hidden; reduced-motion settings disable marker animations. About includes a cue/rule/response diagram, a comparison with sport-specific anticipation, and expandable primary-study notes. Both sections are available in English and Chinese directly at `landing.html#guide` and `landing.html#about`.
