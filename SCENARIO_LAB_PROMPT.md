# PROMPT SUPER ADVANCE UNTUK SCENARIO LAB MODULE MAJORMIND

## KONTEKS SCENARIO LAB SYSTEM
Anda adalah AI Expert dalam merancang scenario simulation module untuk Decision Support System (DSS) pendidikan tinggi berbasis algoritma Multi-Criteria Decision Making (MCDM). Scenario Lab MajorMind harus menjadi sandbox interaktif yang memungkinkan user untuk melakukan what-if analysis, sensitivity testing, dan eksplorasi alternatif keputusan dengan visualisasi real-time dari dampak perubahan terhadap rekomendasi AHP-TOPSIS.

## FILOSOFI DESAIN SCENARIO LAB

### Prinsip Utama: "Explore, Simulate, Decide with Confidence"
Scenario Lab bukan sekadar calculator, tetapi interactive decision theater yang memungkinkan user untuk:
1. Memahami sensitivitas rekomendasi terhadap perubahan input
2. Mengeksplorasi trade-offs antar kriteria
3. Mensimulasikan kondisi masa depan (scholarship, relocation, dll)
4. Membandingkan multiple scenarios secara paralel
5. Memvalidasi robustness dari keputusan mereka

### Hierarki Scenario Lab
1. **Quick Simulation**: Single-variable what-if (5 menit)
2. **Multi-Variable Scenario**: Complex scenario building (15 menit)
3. **Comparative Analysis**: Side-by-side scenario comparison (10 menit)
4. **Monte Carlo Simulation**: Probabilistic outcome analysis (Advanced)
5. **Time-Series Projection**: Future state modeling (Advanced)

## ARSITEKTUR SCENARIO LAB: 8 MODUL UTAMA

---

## MODUL 1: SCENARIO BUILDER INTERFACE
**Objective**: Intuitive scenario creation dengan drag-and-drop

### Section 1.1: Baseline Scenario Display

**Current State Overview**
```
┌─────────────────────────────────────────────────────┐
│  📊 BASELINE SCENARIO (Your Current Assessment)     │
│                                                     │
│  Criteria Weights:                                  │
│  • Peluang Karir:     35.2% ████████████           │
│  • Akreditasi:        24.8% ████████               │
│  • Biaya Kuliah:      18.5% ██████                 │
│  • Reputasi Alumni:   12.3% ████                   │
│  • Jarak Kampus:       9.2% ███                    │
│                                                     │
│  Top Recommendation:                                │
│  🥇 Teknik Informatika (Ci: 0.649)                 │
│  🥈 Sistem Informasi (Ci: 0.605)                   │
│  🥉 DKV (Ci: 0.521)                                │
│                                                     │
│  [Create New Scenario] [Load Saved Scenario]       │
└─────────────────────────────────────────────────────┘
```

### Section 1.2: Scenario Template Library

**Pre-Built Scenarios**
```
┌─────────────────────────────────────────────────────┐
│  📚 SCENARIO TEMPLATES                              │
│                                                     │
│  💰 "I Got Full Scholarship"                        │
│     • Biaya Kuliah weight: 18.5% → 5%              │
│     • Budget constraint: Removed                    │
│     • Impact: Opens premium universities            │
│     [Preview] [Apply]                               │
│                                                     │
│  🌍 "Willing to Relocate Anywhere"                  │
│     • Jarak Kampus weight: 9.2% → 2%               │
│     • Location filter: All Indonesia                │
│     • Impact: +150 university options               │
│     [Preview] [Apply]                               │
│                                                     │
│  🎯 "Career is Everything"                          │
│     • Peluang Karir weight: 35.2% → 50%            │
│     • Other weights: Proportionally reduced         │
│     • Impact: Prioritize high-ROI majors            │
│     [Preview] [Apply]                               │
│                                                     │
│  💼 "Entrepreneurship Path"                         │
│     • Add new criterion: Startup Ecosystem (15%)    │
│     • Peluang Karir: Traditional → Startup focus    │
│     • Impact: Favor business/tech hubs              │
│     [Preview] [Apply]                               │
│                                                     │
│  🏥 "Family Emergency (Need to Stay Close)"         │
│     • Jarak Kampus weight: 9.2% → 30%              │
│     • Max distance: 20km                            │
│     • Impact: Local universities only               │
│     [Preview] [Apply]                               │
│                                                     │
│  [Create Custom Scenario]                           │
└─────────────────────────────────────────────────────┘
```

### Section 1.3: Custom Scenario Builder

**Interactive Control Panel**
```
┌─────────────────────────────────────────────────────┐
│  🎛️ CUSTOM SCENARIO BUILDER                         │
│                                                     │
│  Scenario Name: [My Custom Scenario_________]      │
│  Description: [Optional notes_______________]      │
│                                                     │
│  ═══════════════════════════════════════════════   │
│  ADJUST CRITERIA WEIGHTS                            │
│  ═══════════════════════════════════════════════   │
│                                                     │
│  Peluang Karir                                      │
│  [━━━━━━━|━━━━━━━━━━] 35.2% → 40%                 │
│  Change: +4.8% ↑                                    │
│                                                     │
│  Akreditasi                                         │
│  [━━━━━|━━━━━━━━━━━━] 24.8% → 20%                 │
│  Change: -4.8% ↓                                    │
│                                                     │
│  Biaya Kuliah                                       │
│  [━━━━|━━━━━━━━━━━━━] 18.5% → 15%                 │
│  Change: -3.5% ↓                                    │
│                                                     │
│  Reputasi Alumni                                    │
│  [━━━|━━━━━━━━━━━━━━] 12.3% → 15%                 │
│  Change: +2.7% ↑                                    │
│                                                     │
│  Jarak Kampus                                       │
│  [━━|━━━━━━━━━━━━━━━] 9.2% → 10%                  │
│  Change: +0.8% ↑                                    │
│                                                     │
│  Total: 100% ✓                                      │
│                                                     │
│  [Auto-Balance Weights] [Reset to Baseline]        │
│                                                     │
│  ═══════════════════════════════════════════════   │
│  MODIFY CONSTRAINTS                                 │
│  ═══════════════════════════════════════════════   │
│                                                     │
│  Budget per Semester:                               │
│  ○ < Rp 5 juta                                      │
│  ● Rp 5-10 juta (Current)                           │
│  ○ Rp 10-20 juta                                    │
│  ○ > Rp 20 juta                                     │
│  ○ No limit (Scholarship)                           │
│                                                     │
│  Maximum Distance:                                  │
│  [━━━━━━━|━━━━━━━━━━] 50km → 100km                │
│                                                     │
│  Minimum Akreditasi:                                │
│  ○ B (Acceptable)                                   │
│  ● A (Current)                                      │
│  ○ Unggul (Premium only)                            │
│                                                     │
│  [Run Simulation] [Save Scenario]                  │
└─────────────────────────────────────────────────────┘
```


---

## MODUL 2: REAL-TIME IMPACT VISUALIZATION
**Objective**: Instant feedback pada perubahan scenario

### Section 2.1: Live Recommendation Update

**Dynamic Ranking Display**
```
┌─────────────────────────────────────────────────────┐
│  🔄 LIVE IMPACT ANALYSIS                            │
│                                                     │
│  ┌─────────────────┬─────────────────┐             │
│  │   BASELINE      │   NEW SCENARIO  │             │
│  ├─────────────────┼─────────────────┤             │
│  │ 🥇 Tek. Inform. │ 🥇 Tek. Inform. │ (No change) │
│  │    Ci: 0.649    │    Ci: 0.672    │ +3.5% ↑    │
│  │                 │                 │             │
│  │ 🥈 Sis. Inform. │ 🥈 Sis. Inform. │ (No change) │
│  │    Ci: 0.605    │    Ci: 0.618    │ +2.1% ↑    │
│  │                 │                 │             │
│  │ 🥉 DKV          │ 🥉 Ekonomi      │ ⚠ CHANGED! │
│  │    Ci: 0.521    │    Ci: 0.545    │             │
│  │                 │                 │             │
│  │ 4. Ekonomi      │ 4. DKV          │ ⬇ Dropped  │
│  │    Ci: 0.498    │    Ci: 0.512    │             │
│  └─────────────────┴─────────────────┘             │
│                                                     │
│  KEY CHANGES:                                       │
│  • Ekonomi moved up to #3 (+1 rank)                │
│  • DKV dropped to #4 (-1 rank)                     │
│  • Overall Ci scores increased (better fit!)       │
│                                                     │
│  [View Detailed Comparison] [Accept Changes]       │
└─────────────────────────────────────────────────────┘
```

### Section 2.2: Sensitivity Heatmap

**Visual Impact Matrix**
```
┌─────────────────────────────────────────────────────┐
│  🌡️ SENSITIVITY HEATMAP                             │
│                                                     │
│  How much does each criterion affect your top 3?   │
│                                                     │
│                Tek.Inform  Sis.Inform    DKV        │
│  Peluang Karir    🔥🔥🔥      🔥🔥🔥      🔥         │
│  Akreditasi       🔥🔥        🔥🔥        🔥🔥       │
│  Biaya            🔥          🔥🔥        🔥🔥🔥     │
│  Reputasi         🔥🔥        🔥          🔥         │
│  Jarak            🔥          🔥🔥        🔥🔥🔥     │
│                                                     │
│  Legend:                                            │
│  🔥🔥🔥 = High sensitivity (±10%+ impact)           │
│  🔥🔥   = Medium sensitivity (±5-10% impact)        │
│  🔥     = Low sensitivity (±0-5% impact)            │
│                                                     │
│  INSIGHT:                                           │
│  Tek. Informatika is MOST sensitive to Peluang     │
│  Karir changes. If career prospects drop, this     │
│  recommendation becomes less stable.                │
│                                                     │
│  DKV is MOST sensitive to Biaya & Jarak. If you    │
│  get scholarship or relocate, DKV ranking jumps!    │
└─────────────────────────────────────────────────────┘
```

### Section 2.3: Tornado Diagram

**Criteria Impact Ranking**
```
┌─────────────────────────────────────────────────────┐
│  🌪️ TORNADO DIAGRAM: Impact on Top Recommendation  │
│                                                     │
│  If each criterion changes by ±20%, impact on Ci:  │
│                                                     │
│  Peluang Karir                                      │
│  ████████████████████████████ ±0.085               │
│                                                     │
│  Akreditasi                                         │
│  ████████████████████ ±0.062                       │
│                                                     │
│  Biaya Kuliah                                       │
│  ████████████ ±0.038                               │
│                                                     │
│  Reputasi Alumni                                    │
│  ████████ ±0.025                                   │
│                                                     │
│  Jarak Kampus                                       │
│  █████ ±0.015                                      │
│                                                     │
│  INTERPRETATION:                                    │
│  Your recommendation is MOST affected by Peluang   │
│  Karir. A 20% change in career weight causes       │
│  ±0.085 change in Ci (13% of total score).         │
│                                                     │
│  Jarak Kampus has minimal impact. You can adjust   │
│  this freely without major ranking changes.         │
│                                                     │
│  [Export Chart] [Run Detailed Analysis]            │
└─────────────────────────────────────────────────────┘
```

### Section 2.4: Waterfall Chart

**Contribution Breakdown**
```
┌─────────────────────────────────────────────────────┐
│  📊 WATERFALL: How Scenario Changes Affect Ci       │
│                                                     │
│  Baseline Ci: 0.649                                 │
│  ├─ Peluang Karir (+5%) → +0.018                   │
│  ├─ Akreditasi (-5%)    → -0.012                   │
│  ├─ Biaya (-3%)         → +0.008 (cost criterion)  │
│  ├─ Reputasi (+3%)      → +0.006                   │
│  └─ Jarak (+1%)         → +0.003                   │
│                                                     │
│  New Ci: 0.672 (+3.5%)                              │
│                                                     │
│  Visual:                                            │
│  0.65 ┤                                             │
│  0.66 ┤  ┌──┐                                       │
│  0.67 ┤  │  │  ┌──┐                                 │
│  0.68 ┤  │  │  │  │                                 │
│       └──┴──┴──┴──┴──                               │
│       Base +K -A +B +R +J = New                     │
│                                                     │
│  Net Effect: POSITIVE (+0.023)                      │
│  Your changes IMPROVED the recommendation fit!      │
└─────────────────────────────────────────────────────┘
```

---

## MODUL 3: COMPARATIVE SCENARIO ANALYSIS
**Objective**: Side-by-side comparison of multiple scenarios

### Section 3.1: Multi-Scenario Dashboard

**Parallel Comparison View**
```
┌─────────────────────────────────────────────────────┐
│  🔬 SCENARIO COMPARISON LAB                         │
│                                                     │
│  Select up to 4 scenarios to compare:              │
│                                                     │
│  ☑ Baseline (Current Assessment)                    │
│  ☑ Scholarship Scenario                             │
│  ☑ Career-Focused Scenario                          │
│  ☐ Relocation Scenario                              │
│  ☐ Budget-Conscious Scenario                        │
│                                                     │
│  [+ Add New Scenario]                               │
│                                                     │
│  ═══════════════════════════════════════════════   │
│  COMPARISON MATRIX                                  │
│  ═══════════════════════════════════════════════   │
│                                                     │
│  ┌──────────┬──────────┬──────────┬──────────┐    │
│  │ Metric   │ Baseline │ Scholar. │ Career   │    │
│  ├──────────┼──────────┼──────────┼──────────┤    │
│  │ Top Rec. │ Tek.Info │ Tek.Info │ Tek.Info │    │
│  │ Ci Score │ 0.649    │ 0.672    │ 0.685    │    │
│  │ Rank #2  │ Sis.Info │ Sis.Info │ Sis.Info │    │
│  │ Rank #3  │ DKV      │ Ekonomi  │ Data Sci │    │
│  │ Avg Cost │ 8.5M     │ 12M      │ 9M       │    │
│  │ Avg Dist │ 15km     │ 45km     │ 20km     │    │
│  │ Options  │ 25       │ 48       │ 32       │    │
│  └──────────┴──────────┴──────────┴──────────┘    │
│                                                     │
│  INSIGHTS:                                          │
│  • All scenarios agree on Tek. Informatika #1      │
│    → HIGH CONFIDENCE recommendation                 │
│  • Scholarship opens 23 more options (+92%)        │
│  • Career-focused has highest Ci (best fit)        │
│                                                     │
│  [Export Comparison] [Merge Scenarios]             │
└─────────────────────────────────────────────────────┘
```

### Section 3.2: Venn Diagram Analysis

**Overlap Visualization**
```
┌─────────────────────────────────────────────────────┐
│  🎯 SCENARIO OVERLAP ANALYSIS                       │
│                                                     │
│  Which majors appear in top 5 across scenarios?    │
│                                                     │
│         ┌─────────────────┐                         │
│         │   Baseline      │                         │
│         │  (5 majors)     │                         │
│         │   ┌─────────────┼─────────┐               │
│         │   │  Scholarship│         │               │
│         │   │  (8 majors) │         │               │
│         └───┼─────────────┘         │               │
│             │      ┌────────────────┼───┐           │
│             │      │   Career       │   │           │
│             │      │   (6 majors)   │   │           │
│             └──────┼────────────────┘   │           │
│                    └──────────────────────┘         │
│                                                     │
│  CORE RECOMMENDATIONS (All 3 scenarios):            │
│  • Teknik Informatika                               │
│  • Sistem Informasi                                 │
│                                                     │
│  CONDITIONAL RECOMMENDATIONS:                       │
│  • DKV (Baseline + Scholarship only)                │
│  • Data Science (Career + Scholarship only)         │
│  • Ekonomi (Scholarship only)                       │
│                                                     │
│  INTERPRETATION:                                    │
│  Tek. Informatika & Sistem Informasi are ROBUST    │
│  choices - they rank high regardless of scenario.   │
│  This indicates strong fundamental fit!             │
└─────────────────────────────────────────────────────┘
```

### Section 3.3: Decision Matrix

**Pros/Cons Comparison**
```
┌─────────────────────────────────────────────────────┐
│  ⚖️ DECISION MATRIX                                 │
│                                                     │
│  Scenario: Scholarship vs Career-Focused            │
│                                                     │
│  ┌─────────────────────┬─────────────────────────┐ │
│  │ SCHOLARSHIP         │ CAREER-FOCUSED          │ │
│  ├─────────────────────┼─────────────────────────┤ │
│  │ PROS:               │ PROS:                   │ │
│  │ ✓ 48 options        │ ✓ Highest Ci (0.685)   │ │
│  │ ✓ Premium univs     │ ✓ Best career ROI      │ │
│  │ ✓ No budget limit   │ ✓ Focused priorities   │ │
│  │ ✓ Flexibility       │ ✓ Clear path           │ │
│  │                     │                         │ │
│  │ CONS:               │ CONS:                   │ │
│  │ ✗ Uncertain (need   │ ✗ Fewer options (32)   │ │
│  │   to win scholar.)  │ ✗ High pressure        │ │
│  │ ✗ Farther distance  │ ✗ Less flexibility     │ │
│  │ ✗ More competition  │                         │ │
│  └─────────────────────┴─────────────────────────┘ │
│                                                     │
│  RECOMMENDATION:                                    │
│  Start with Career-Focused (guaranteed path).      │
│  Apply for scholarships in parallel.                │
│  If scholarship secured → Switch to Scholarship     │
│  scenario for broader options.                      │
│                                                     │
│  [Generate Action Plan] [Save Decision]            │
└─────────────────────────────────────────────────────┘
```

---

## MODUL 4: MONTE CARLO SIMULATION (ADVANCED)
**Objective**: Probabilistic outcome analysis

### Section 4.1: Uncertainty Modeling

**Input Uncertainty Definition**
```
┌─────────────────────────────────────────────────────┐
│  🎲 MONTE CARLO SIMULATION SETUP                    │
│                                                     │
│  Model uncertainty in your inputs:                  │
│                                                     │
│  Scholarship Probability:                           │
│  [━━━━━━━|━━━━━━━━━━] 40% (Realistic estimate)    │
│  Distribution: Beta(4, 6)                           │
│                                                     │
│  Career Market Volatility:                          │
│  [━━━━━|━━━━━━━━━━━━] ±15% (Moderate)             │
│  Distribution: Normal(μ=0, σ=0.15)                 │
│                                                     │
│  Akreditasi Stability:                              │
│  [━━━━━━━━━━|━━━━━━] 95% (Very stable)            │
│  Distribution: Uniform(0.9, 1.0)                   │
│                                                     │
│  Budget Flexibility:                                │
│  [━━━━━━━━|━━━━━━━━] ±20% (Can adjust)            │
│  Distribution: Triangular(min=-20%, mode=0, max=+20%)│
│                                                     │
│  Number of Simulations: [10,000 ▼]                 │
│  Random Seed: [42______] (for reproducibility)     │
│                                                     │
│  [Run Simulation] [Advanced Settings]              │
└─────────────────────────────────────────────────────┘
```

### Section 4.2: Simulation Results

**Probabilistic Outcomes**
```
┌─────────────────────────────────────────────────────┐
│  📈 MONTE CARLO RESULTS (10,000 iterations)         │
│                                                     │
│  Top Recommendation Stability:                      │
│                                                     │
│  Teknik Informatika:  ████████████████ 78.5%       │
│  Sistem Informasi:    ████████ 15.2%               │
│  Data Science:        ██ 4.8%                      │
│  DKV:                 █ 1.5%                       │
│                                                     │
│  INTERPRETATION:                                    │
│  In 78.5% of scenarios, Teknik Informatika         │
│  remains your #1 recommendation. This is VERY       │
│  ROBUST!                                            │
│                                                     │
│  Ci Score Distribution:                             │
│  ┌─────────────────────────────────────┐           │
│  │     ╱╲                               │           │
│  │    ╱  ╲                              │           │
│  │   ╱    ╲                             │           │
│  │  ╱      ╲___                         │           │
│  │ ╱           ╲___                     │           │
│  └─────────────────────────────────────┘           │
│  0.55  0.60  0.65  0.70  0.75  0.80               │
│                                                     │
│  Mean Ci: 0.658 (±0.042 std dev)                   │
│  95% Confidence Interval: [0.576, 0.740]           │
│                                                     │
│  Risk Assessment:                                   │
│  • 5% chance Ci drops below 0.576 (still good)     │
│  • 95% chance Ci stays above 0.576                 │
│  • Best case: Ci = 0.740 (excellent fit!)          │
│                                                     │
│  [View Detailed Distribution] [Export Data]        │
└─────────────────────────────────────────────────────┘
```

### Section 4.3: Scenario Probability Tree

**Decision Tree Visualization**
```
┌─────────────────────────────────────────────────────┐
│  🌳 PROBABILITY TREE                                │
│                                                     │
│                    START                            │
│                      │                              │
│          ┌───────────┴───────────┐                  │
│          │                       │                  │
│    Scholarship (40%)      No Scholarship (60%)      │
│          │                       │                  │
│    ┌─────┴─────┐           ┌─────┴─────┐           │
│    │           │           │           │           │
│  Good Job   Bad Job     Good Job   Bad Job         │
│  Market     Market      Market     Market          │
│  (70%)      (30%)       (70%)      (30%)           │
│    │           │           │           │           │
│  Ci=0.72    Ci=0.65     Ci=0.68    Ci=0.61         │
│  Prob=28%   Prob=12%    Prob=42%   Prob=18%        │
│                                                     │
│  EXPECTED VALUE:                                    │
│  E[Ci] = 0.72×0.28 + 0.65×0.12 + 0.68×0.42 +       │
│          0.61×0.18 = 0.668                          │
│                                                     │
│  BEST PATH (28% probability):                       │
│  Scholarship + Good Job Market → Ci = 0.72          │
│                                                     │
│  WORST PATH (18% probability):                      │
│  No Scholarship + Bad Job Market → Ci = 0.61        │
│  (Still acceptable!)                                │
└─────────────────────────────────────────────────────┘
```

---

## MODUL 5: TIME-SERIES PROJECTION (ADVANCED)
**Objective**: Model future state changes

### Section 5.1: Temporal Scenario Builder

**Multi-Year Projection**
```
┌─────────────────────────────────────────────────────┐
│  ⏰ TIME-SERIES PROJECTION                          │
│                                                     │
│  Model how your priorities might change over time:  │
│                                                     │
│  YEAR 1 (Freshman):                                 │
│  • Biaya Kuliah: HIGH priority (30%)               │
│  • Peluang Karir: MEDIUM priority (25%)            │
│  • Jarak: HIGH priority (20%)                      │
│                                                     │
│  YEAR 2-3 (Sophomore-Junior):                      │
│  • Biaya: MEDIUM priority (20%)                    │
│  • Peluang Karir: HIGH priority (35%)              │
│  • Jarak: MEDIUM priority (15%)                    │
│                                                     │
│  YEAR 4 (Senior):                                   │
│  • Biaya: LOW priority (10%)                       │
│  • Peluang Karir: VERY HIGH priority (45%)         │
│  • Jarak: LOW priority (10%)                       │
│                                                     │
│  POST-GRADUATION:                                   │
│  • Peluang Karir: DOMINANT priority (60%)          │
│  • Reputasi Alumni: HIGH priority (25%)            │
│  • Others: Minimal priority (15%)                  │
│                                                     │
│  [Run Projection] [Customize Timeline]             │
└─────────────────────────────────────────────────────┘
```

### Section 5.2: Dynamic Recommendation Evolution

**Temporal Stability Analysis**
```
┌─────────────────────────────────────────────────────┐
│  📅 RECOMMENDATION EVOLUTION OVER TIME              │
│                                                     │
│  Year 1    Year 2    Year 3    Year 4    Post-Grad │
│  ──────────────────────────────────────────────────│
│  🥇 Tek.I  🥇 Tek.I  🥇 Tek.I  🥇 Tek.I  🥇 Tek.I  │
│  🥈 Sis.I  🥈 Sis.I  🥈 Data S  🥈 Data S 🥈 Data S│
│  🥉 DKV    🥉 Data S 🥉 Sis.I  🥉 Sis.I  🥉 Sis.I │
│                                                     │
│  Ci Score Trajectory:                               │
│  0.70 ┤                                    ╱        │
│  0.68 ┤                          ╱────────╱         │
│  0.66 ┤                ╱────────╱                   │
│  0.64 ┤      ╱────────╱                             │
│  0.62 ┤─────╱                                       │
│       └─────┴─────┴─────┴─────┴─────               │
│       Y1    Y2    Y3    Y4    PG                   │
│                                                     │
│  INSIGHTS:                                          │
│  • Tek. Informatika remains #1 throughout          │
│    → VERY STABLE long-term choice                  │
│  • Data Science emerges as strong #2 by Year 3     │
│    → Consider double major or minor?               │
│  • Ci improves over time (+0.08 total)             │
│    → Your priorities align better with major       │
│                                                     │
│  [View Detailed Timeline] [Export Projection]      │
└─────────────────────────────────────────────────────┘
```

