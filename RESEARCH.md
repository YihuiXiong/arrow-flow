# Research notes: perception, decisions, and movement

Reviewed 28 October 2026. This note separates research findings from design inferences. Arrow Flow itself has not been evaluated in these studies.

## Evidence considered

| Source / design | Finding relevant to this project | Boundary on interpretation |
| --- | --- | --- |
| [Balser et al. (2014)](https://doi.org/10.3389/fnhum.2014.00568), fMRI; 15 tennis and 16 volleyball experts | Anticipating serves in the practiced sport involved expertise-related parietal, supplementary motor, and cerebellar activity. | Cross-sectional, sport-specific observation task. Brain activation differences do not establish a causal training effect or validate symbol drills. |
| [Liu et al. (2017)](https://doi.org/10.1016/j.neulet.2017.08.038), 40 adult novices; training/control groups | Twelve weeks of badminton practice accompanied better inverse-efficiency scores and N2/P3 changes during a badminton anticipation task. | Real badminton practice, not a cue-display intervention. ERP amplitude is task-dependent; “more activation” is not a general quality score. |
| [Broadbent et al. (2017)](https://doi.org/10.1371/journal.pone.0174311), tennis video intervention | Rally-sequence footage benefited overall field decision time relative to non-sequential footage. Retention depended on test structure. | Intermediate players, specific footage and transfer tests; not evidence that arbitrary random symbols improve tennis performance. |
| [Wang et al. (2025)](https://doi.org/10.1038/s41598-025-93475-7), 42 physical-education students with 1–2 years of badminton experience | Six sessions over two weeks produced task-dependent anticipation gains, with a later retention test. The match-video task showed no significant training effects. | Small groups and multiple outcomes. The paper's “novices” had prior experience, and its match-video test was not live competition. Its audio-visual feedback is unlike an app beep. |
| [Müller et al. (2024)](https://doi.org/10.1007/s40279-024-02073-6), meta-analysis of 12 temporal-occlusion interventions | Sport-specific video training showed benefits on representative laboratory/field transfer tests. | Limited studies and inconclusive publication-bias analyses. This synthesis evaluates opponent-action cues, not number/color games. |
| [Fransen (2024)](https://doi.org/10.1007/s40279-024-02060-x), current-opinion commentary | Explains why claims of far transfer from generic perceptual/cognitive tools warrant scrutiny. | A commentary, not a new intervention or meta-analysis. It should not be presented as proof that all perceptual training is ineffective. |

## Neuroscience interpretation

The studies support investigating learned perception–action relationships and sport-specific prediction. They do not establish a single “reaction center” that generic flashing symbols improve. Observing an opponent, predicting an outcome, choosing a response, and executing a movement are related but distinct demands.

For this app, “attention,” “working memory,” and “inhibition” describe what a particular rule asks the player to do. A repeat rule asks the player to hold the last cue in mind; a hold rule asks them to withhold a response. General cognitive improvement, neural change, and sporting transfer would each require their own controlled evaluation.

## Design inferences

These are practical choices, not findings directly tested in the cited protocols:

1. Make cue mappings explicit before each set. Use direction/number for location and color for action, rather than ambiguous instructions.
2. Start with one relevant cue. Add one exception or a second cue dimension only after the mapping is understood.
3. Include real movement and recovery time when movement is the goal. Symbol processing alone does not reproduce racket/ball interception.
4. Use repeat rules only where repeats can occur. Number-mode numbers and random arrow colors support them; distinct number backgrounds deliberately avoid immediate repeats.
5. Explain sound as an onset cue. Do not equate generic beeps with informative racket-contact audio or audiovisual feedback.
6. Keep random waits optional. Unpredictability changes the task; harder and more random are not automatically more sport-representative.
7. Preserve simple access to partner, live, and video-based practice for opponent anticipation. The app provides neither opponent kinematics nor rally context.

## Evaluating use without inventing metrics

The current app counts cues and sets, not correct responses. A partner can record missed cues and wrong targets under the same rules, distances, and timing. Such observations describe this drill; they do not establish reaction-time gains or transfer.

A future efficacy study would need a suitable active comparison, reliable pre/post measures, retention, and an independent sport-specific transfer task. Brain-measurement outcomes would be a separate question. No study-derived dose or efficacy percentage is assigned to Arrow Flow.
