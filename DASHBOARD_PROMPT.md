# PROMPT SUPER ADVANCE UNTUK DASHBOARD MAJORMIND

## KONTEKS SISTEM DASHBOARD
Anda adalah AI Expert dalam merancang dashboard untuk Decision Support System (DSS) pendidikan tinggi berbasis algoritma Multi-Criteria Decision Making (MCDM). Dashboard MajorMind harus menjadi command center yang menampilkan visualisasi real-time dari 6 fase komputasi AHP-TOPSIS, memberikan insight mendalam tentang proses pengambilan keputusan, dan memfasilitasi eksplorasi data yang intuitif namun powerful.

## FILOSOFI DESAIN DASHBOARD

### Prinsip Utama: "Transparency Through Visualization"
Dashboard bukan hanya menampilkan hasil akhir, tetapi mengekspos seluruh journey algoritmik dari input psikologis hingga rekomendasi final. Setiap fase komputasi harus dapat diinspeksi, dipahami, dan divalidasi oleh user.

### Hierarki Informasi
1. **At-a-Glance**: Rekomendasi top 3 dengan confidence score
2. **Deep Dive**: Breakdown matematis per fase
3. **Exploration**: Comparative analysis & what-if scenarios
4. **Historical**: Tracking perubahan preferensi over time

## ARSITEKTUR DASHBOARD: 7 MODUL UTAMA

---

## MODUL 1: COMMAND CENTER (Hero Dashboard)
**Objective**: Single source of truth untuk status assessment & rekomendasi

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│  HEADER: User Profile | Progress Ring | Quick Actions   │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌──────────────────────────────┐ │
│  │  RECOMMENDATION │  │   ALGORITHMIC CONFIDENCE     │ │
│  │     CARDS       │  │        METER                 │ │
│  │   (Top 3)       │  │                              │ │
│  │                 │  │  CR Score: 0.08 ✓            │ │
│  │  1. Teknik      │  │  Normalization: Complete     │ │
│  │     Informatika │  │  Data Quality: 94%           │ │
│  │     Ci: 0.87    │  │  Confidence: VERY HIGH       │ │
│  │                 │  │                              │ │
│  │  2. Sistem      │  │  [Detailed Breakdown →]      │ │
│  │     Informasi   │  │                              │ │
│  │     Ci: 0.82    │  │                              │ │
│  │                 │  │                              │ │
│  │  3. DKV         │  │                              │ │
│  │     Ci: 0.79    │  │                              │ │
│  └─────────────────┘  └──────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  PHASE NAVIGATOR: [01] [02] [03] [04] [05] [06]        │
│  Click to deep dive into each computational phase       │
└─────────────────────────────────────────────────────────┘
```

### Komponen Detail

**1. Progress Ring (Circular Progress)**
- Visual: Donut chart dengan 6 segmen (1 per fase)
- Color coding:
  - Green: Fase completed & validated
  - Yellow: Fase in progress
  - Red: Fase failed validation (CR > 0.1)
  - Gray: Fase not started
- Center text: "Assessment 100% Complete" atau "Phase 3: Validating..."
- Hover: Tooltip dengan detail fase

**2. Recommendation Cards (Top 3)**
- Card design: Glassmorphism dengan gradient border
- Content per card:
  - Rank badge (1st, 2nd, 3rd)
  - Jurusan name + icon
  - Universitas (top 3 options)
  - Closeness Coefficient (Ci) dengan progress bar
  - Quick stats: Akreditasi, Biaya range, Peluang Karir
  - CTA: "Explore Details" → Navigate ke detail page
- Interaction: Hover untuk preview, click untuk full analysis

**3. Algorithmic Confidence Meter**
- Visual: Multi-metric dashboard
- Metrics displayed:
  - **CR Score**: 0.08 (dengan threshold line di 0.1)
  - **Normalization Status**: Complete/Incomplete
  - **Data Quality Score**: 94% (berdasarkan completeness BAN-PT & Tracer Study data)
  - **Overall Confidence**: Very High / High / Medium / Low
- Color-coded indicators (traffic light system)
- Expandable section untuk detailed breakdown


**4. Phase Navigator**
- Visual: Horizontal stepper dengan 6 nodes
- Each node:
  - Phase number (01-06)
  - Phase name (abbreviated)
  - Status icon (✓, ⚠, ✗, ○)
  - Progress percentage
- Click behavior: Navigate ke deep dive section untuk fase tersebut
- Active state: Highlighted dengan glow effect

---

## MODUL 2: FASE 01 DEEP DIVE - BEHAVIORAL PROFILING DASHBOARD
**Objective**: Visualisasi komprehensif profil psikologis & gap analysis

### Section 2.1: Psychometric Profile Overview

**Radar Chart: Tri-Domain Assessment**
```
Visual: 3-axis radar chart dengan overlay
- Axis 1: Minat Intrinsik (0-100 scale)
- Axis 2: Kemampuan Logika Dasar (0-100 scale)
- Axis 3: Preferensi Lingkungan Belajar (0-100 scale)

Overlay layers:
- Blue fill: User's current profile
- Red outline: Average profile untuk jurusan rekomendasi #1
- Green outline: Average profile untuk jurusan rekomendasi #2
- Yellow outline: Average profile untuk jurusan rekomendasi #3

Interaction:
- Hover pada axis: Tooltip dengan breakdown sub-metrics
- Click axis: Expand ke detailed assessment results
```

**Minat Intrinsik Breakdown**
- Visual: Horizontal bar chart (top 10 subjects)
- Data:
  - Subject name (e.g., "Pemrograman", "Desain Grafis", "Analisis Data")
  - Interest score (0-100)
  - Alignment dengan jurusan rekomendasi (color-coded dots)
- Filter: By category (STEM, Humaniora, Seni, Bisnis)

**Kemampuan Logika Dasar - Cognitive Map**
- Visual: Heatmap matrix
- Dimensions:
  - Penalaran Terstruktur
  - Pemrosesan Spasial
  - Analisis Kuantitatif
  - Problem Solving
  - Abstract Thinking
- Color scale: Red (weak) → Yellow (moderate) → Green (strong)
- Benchmark line: Minimum requirement untuk STEM vs Non-STEM

**Preferensi Lingkungan Belajar - Spectrum Slider**
- Visual: Dual-ended slider dengan markers
- Spectrums:
  - Kolaboratif ←→ Otonom
  - Teori Abstrak ←→ Aplikasi Praktis
  - Struktur Rigid ←→ Fleksibel
  - Kompetitif ←→ Kooperatif
- User position: Blue marker
- Ideal position untuk top 3 jurusan: Colored markers dengan labels

### Section 2.2: Gap Analysis Matrix

**Visual: Delta Heatmap**
```
Table structure:
┌──────────────┬─────────┬─────────┬─────────┬─────────┐
│ Kriteria     │ Current │ Req #1  │ Req #2  │ Req #3  │
├──────────────┼─────────┼─────────┼─────────┼─────────┤
│ Minat        │   85    │ 80 (✓)  │ 75 (✓)  │ 70 (✓)  │
│ Logika       │   72    │ 75 (⚠)  │ 70 (✓)  │ 65 (✓)  │
│ Lingkungan   │   90    │ 85 (✓)  │ 80 (✓)  │ 88 (✓)  │
└──────────────┴─────────┴─────────┴─────────┴─────────┘

Color coding:
- Green: Gap ≤ 5 (excellent fit)
- Yellow: Gap 6-10 (good fit, minor adjustment needed)
- Orange: Gap 11-15 (moderate fit, significant adjustment)
- Red: Gap > 15 (poor fit, major mismatch)
```

**Gap Closure Recommendations**
- Visual: Action cards dengan priority tags
- Content:
  - Gap identified: "Kemampuan Logika 3 poin di bawah requirement"
  - Impact: "May affect performance in advanced math courses"
  - Mitigation: "Recommended: Take pre-calculus bridge course"
  - Resources: Links ke online courses, tutoring, study groups

### Section 2.3: Filtering Impact Visualization

**Funnel Chart: Alternatif Reduction**
```
Visual: Animated funnel dengan stages
Stage 1: Total jurusan di database (500+)
  ↓ Filter: Minat Intrinsik alignment
Stage 2: Jurusan dengan minat match (150)
  ↓ Filter: Kemampuan Logika threshold
Stage 3: Jurusan dengan cognitive fit (75)
  ↓ Filter: Preferensi Lingkungan compatibility
Stage 4: Final subset untuk AHP evaluation (25)

Interaction:
- Click stage: Show list of filtered jurusan
- Hover: Tooltip dengan filtering criteria
```

---

## MODUL 3: FASE 02 DEEP DIVE - AHP PAIRWISE COMPARISON DASHBOARD
**Objective**: Transparansi total dalam ekstraksi bobot kriteria

### Section 3.1: Pairwise Comparison Matrix Visualization

**Interactive Matrix Heatmap**
```
Visual: n×n matrix dengan color-coded cells
Example (5 kriteria):
┌────────┬────┬────┬────┬────┬────┐
│        │ C1 │ C2 │ C3 │ C4 │ C5 │
├────────┼────┼────┼────┼────┼────┤
│ C1     │ 1  │ 3  │ 5  │ 2  │ 4  │
│ C2     │1/3 │ 1  │ 2  │1/2 │ 3  │
│ C3     │1/5 │1/2 │ 1  │1/3 │ 2  │
│ C4     │1/2 │ 2  │ 3  │ 1  │ 5  │
│ C5     │1/4 │1/3 │1/2 │1/5 │ 1  │
└────────┴────┴────┴────┴────┴────┘

Color scale:
- Dark green: 7-9 (extreme preference)
- Light green: 5-6 (strong preference)
- Yellow: 3-4 (moderate preference)
- White: 1 (equal)
- Light red: 1/3-1/4 (moderate inverse)
- Dark red: 1/7-1/9 (extreme inverse)

Interaction:
- Hover cell: Show comparison statement
  "Peluang Karir is 3x more important than Biaya Kuliah"
- Click cell: Edit comparison (if re-assessment mode)
- Diagonal: Always 1 (grayed out)
```

**Saaty Scale Reference Panel**
```
Visual: Vertical scale dengan examples
┌─────────────────────────────────────┐
│ 9 │ Extreme    │ "Life vs Death"    │
│ 7 │ Very Strong│ "Essential vs Nice"│
│ 5 │ Strong     │ "Important vs OK"  │
│ 3 │ Moderate   │ "Prefer vs Accept" │
│ 1 │ Equal      │ "Same importance"  │
└─────────────────────────────────────┘
Always visible as sidebar reference
```

### Section 3.2: Eigenvector Extraction Visualization

**Step-by-Step Computation Animation**
```
Step 1: Normalization
- Show original matrix
- Animate column-wise division
- Display normalized matrix

Step 2: Row Averaging
- Highlight each row
- Calculate mean
- Display eigenvector

Step 3: Weight Extraction
- Convert to percentages
- Display final weights dengan progress bars
```

**Final Criteria Weights Dashboard**
```
Visual: Horizontal bar chart + pie chart combo

Bar Chart:
┌─────────────────────────────────────────┐
│ Peluang Karir      ████████████ 35.2%   │
│ Akreditasi         ████████ 24.8%       │
│ Biaya Kuliah       ██████ 18.5%         │
│ Jarak Kampus       ████ 12.3%           │
│ Reputasi Alumni    ███ 9.2%             │
└─────────────────────────────────────────┘

Pie Chart: Same data, different view
- Hover: Show exact percentage + weight value
- Click: Highlight related comparisons in matrix
```

### Section 3.3: Sensitivity Analysis

**What-If Simulator**
```
Interactive sliders untuk adjust weights manually
- User can drag slider untuk each criterion
- Real-time recalculation of recommendations
- Visual diff: "Original Rank" vs "Adjusted Rank"
- Warning: "This is simulation only. To change official weights, re-do AHP assessment."

Example:
Peluang Karir: [====|====] 35% → 45% (+10%)
Result: Rank #2 (Sistem Informasi) moves to Rank #1
```

---

## MODUL 4: FASE 03 DEEP DIVE - CONSISTENCY RATIO VALIDATION DASHBOARD
**Objective**: Audit matematis transparansi penuh

### Section 4.1: CR Calculation Breakdown

**Visual: Step-by-Step Formula Display**
```
┌─────────────────────────────────────────────────────┐
│ STEP 1: Calculate λmax (Principal Eigenvalue)      │
│                                                     │
│ λmax = 5.124                                        │
│ (Computed via matrix multiplication A × w)         │
│                                                     │
│ [Show matrix multiplication animation]             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ STEP 2: Calculate Consistency Index (CI)           │
│                                                     │
│ CI = (λmax - n) / (n - 1)                          │
│ CI = (5.124 - 5) / (5 - 1)                        │
│ CI = 0.124 / 4                                     │
│ CI = 0.031                                         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ STEP 3: Lookup Random Index (RI)                   │
│                                                     │
│ For n=5 criteria: RI = 1.12                        │
│ (From Saaty's RI table)                            │
│                                                     │
│ [Show RI table for n=1 to n=10]                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ STEP 4: Calculate Consistency Ratio (CR)           │
│                                                     │
│ CR = CI / RI                                       │
│ CR = 0.031 / 1.12                                  │
│ CR = 0.028                                         │
│                                                     │
│ ✓ CR < 0.1 → VALID (Excellent consistency!)       │
└─────────────────────────────────────────────────────┘
```

### Section 4.2: CR Meter & Threshold Visualization

**Gauge Chart: CR Score**
```
Visual: Semicircular gauge (speedometer style)
┌─────────────────────────────────┐
│         CR SCORE                │
│                                 │
│    ┌───────────────┐            │
│    │       0.028   │            │
│    │   ╱         ╲ │            │
│    │  ╱     ↑     ╲│            │
│    │ ╱      │      ╲            │
│    │────────┼───────│            │
│    0      0.1      0.2          │
│                                 │
│  Green Zone: 0 - 0.1 (Valid)   │
│  Red Zone: 0.1+ (Invalid)      │
└─────────────────────────────────┘

Needle position: 0.028 (deep in green zone)
Label: "EXCELLENT CONSISTENCY"
```

**Consistency Quality Indicator**
```
Visual: Traffic light system dengan descriptive labels

┌──────────────────────────────────────┐
│  ● GREEN  │ CR ≤ 0.05  │ Excellent  │
│  ● YELLOW │ 0.05-0.08  │ Good       │
│  ● ORANGE │ 0.08-0.10  │ Acceptable │
│  ● RED    │ CR > 0.10  │ Invalid    │
└──────────────────────────────────────┘

Current status: ● GREEN (0.028)
```

### Section 4.3: Inconsistency Detection & Guidance

**Contradiction Heatmap** (Only shown if CR > 0.1)
```
Visual: Matrix overlay highlighting problematic comparisons
- Red cells: Comparisons contributing most to inconsistency
- Suggested adjustments: "Consider changing C1 vs C3 from 5 to 3"
- Impact preview: "This would reduce CR to 0.09"
```

**Recalibration Wizard** (Interactive guide)
```
Step 1: Identify top 3 inconsistent comparisons
Step 2: Show original values + suggested values
Step 3: User adjusts via slider
Step 4: Real-time CR recalculation
Step 5: Validate & proceed or continue adjusting
```


---

## MODUL 5: FASE 04 DEEP DIVE - TOPSIS NORMALIZATION DASHBOARD
**Objective**: Transparansi transformasi data empiris

### Section 5.1: Decision Matrix Overview

**Raw Data Table**
```
Visual: Sortable, filterable data table
┌──────────────┬────────┬────────┬────────┬────────┬────────┐
│ Jurusan      │ Nilai  │ Akred  │ Biaya  │ Jarak  │ Karir  │
│              │ (B)    │ (B)    │ (C)    │ (C)    │ (B)    │
├──────────────┼────────┼────────┼────────┼────────┼────────┤
│ Tek. Inform. │  85    │  95    │  8.5M  │  15km  │  92    │
│ Sis. Inform. │  82    │  90    │  7.2M  │  12km  │  88    │
│ DKV          │  78    │  85    │  9.0M  │  8km   │  75    │
│ Ekonomi      │  80    │  88    │  6.5M  │  20km  │  80    │
│ ...          │  ...   │  ...   │  ...   │  ...   │  ...   │
└──────────────┴────────┴────────┴────────┴────────┴────────┘

Legend:
(B) = Benefit criterion (higher is better)
(C) = Cost criterion (lower is better)

Features:
- Sort by column
- Filter by range
- Highlight: User's top 5 matches
- Color coding: Green (high benefit/low cost), Red (opposite)
```

**Criteria Type Indicator**
```
Visual: Icon legend dengan tooltips
┌─────────────────────────────────────────────┐
│ ↑ BENEFIT   │ Higher values preferred      │
│ ↓ COST      │ Lower values preferred       │
└─────────────────────────────────────────────┘

Applied to each column header in table
```

### Section 5.2: Vector Normalization Visualization

**Normalization Formula Display**
```
┌──────────────────────────────────────────────────┐
│ Vector Normalization Formula:                    │
│                                                  │
│ rij = xij / √(Σ xij²)                           │
│                                                  │
│ Where:                                           │
│ - rij = normalized value                        │
│ - xij = original value                          │
│ - Σ xij² = sum of squared values in column     │
└──────────────────────────────────────────────────┘
```

**Step-by-Step Transformation Animation**
```
Example for "Nilai Akademik" column:

STEP 1: Square all values
85² = 7,225
82² = 6,724
78² = 6,084
80² = 6,400
...
Σ = 45,678

STEP 2: Calculate square root
√45,678 = 213.75

STEP 3: Divide each value
85 / 213.75 = 0.398
82 / 213.75 = 0.384
78 / 213.75 = 0.365
80 / 213.75 = 0.374
...

[Animate transformation with color transition]
```

**Before/After Comparison**
```
Visual: Side-by-side tables dengan connecting lines
┌─────────────┐         ┌─────────────┐
│ ORIGINAL    │  ═══>   │ NORMALIZED  │
│             │         │             │
│ 85          │  ═══>   │ 0.398       │
│ 82          │  ═══>   │ 0.384       │
│ 78          │  ═══>   │ 0.365       │
└─────────────┘         └─────────────┘

Benefit: All values now on 0-1 scale, comparable!
```

### Section 5.3: Weighted Matrix Construction

**Weight Application Visualization**
```
Visual: Matrix multiplication animation
┌─────────────────────────────────────────────────┐
│ Normalized Matrix × AHP Weights = Weighted Matrix│
│                                                 │
│ [0.398]              [0.352]      [0.140]      │
│ [0.384]      ×       [0.248]  =   [0.135]      │
│ [0.365]              [0.185]      [0.128]      │
│                      [0.123]                    │
│                      [0.092]                    │
└─────────────────────────────────────────────────┘

Animation: Show multiplication process cell-by-cell
```

**Weighted Matrix Heatmap**
```
Visual: Color-coded matrix
- Darker green: Higher weighted values (good for benefit)
- Darker red: Higher weighted values (bad for cost)
- Intensity reflects both raw performance AND user preference weight

Hover: Show calculation breakdown
"Tek. Informatika - Nilai Akademik:
 Normalized: 0.398
 × Weight: 0.352
 = Weighted: 0.140"
```

### Section 5.4: Data Quality Indicators

**Completeness Score**
```
Visual: Progress bars per data source
┌──────────────────────────────────────────┐
│ BAN-PT Accreditation  ████████████ 95%  │
│ Tracer Study Data     ██████████   85%  │
│ Tuition Fee Data      ████████████ 98%  │
│ Geographic Data       ████████████ 100% │
│                                          │
│ Overall Data Quality: ████████████ 94%  │
└──────────────────────────────────────────┘
```

**Data Freshness Indicator**
```
Visual: Timeline dengan last update timestamps
┌────────────────────────────────────────────┐
│ BAN-PT Data:      Updated 2 months ago ✓  │
│ Tracer Study:     Updated 6 months ago ⚠  │
│ Tuition Fees:     Updated 1 month ago  ✓  │
│ Alumni Salary:    Updated 3 months ago ✓  │
└────────────────────────────────────────────┘

Legend:
✓ Fresh (< 6 months)
⚠ Aging (6-12 months)
✗ Stale (> 12 months)
```

---

## MODUL 6: FASE 05 DEEP DIVE - IDEAL SOLUTION DISTANCE DASHBOARD
**Objective**: Visualisasi geometris positioning alternatif

### Section 6.1: Ideal Solution Definition

**A+ (Positive Ideal) Card**
```
┌─────────────────────────────────────────┐
│  ⭐ POSITIVE IDEAL SOLUTION (A+)        │
│                                         │
│  The "Perfect" Major (Hypothetical)    │
│                                         │
│  Nilai Akademik:    1.000 (max)        │
│  Akreditasi:        1.000 (max)        │
│  Biaya Kuliah:      0.000 (min)        │
│  Jarak Kampus:      0.000 (min)        │
│  Peluang Karir:     1.000 (max)        │
│                                         │
│  Note: This represents theoretical      │
│  perfection, not a real university.     │
└─────────────────────────────────────────┘
```

**A- (Negative Ideal) Card**
```
┌─────────────────────────────────────────┐
│  ⚠ NEGATIVE IDEAL SOLUTION (A-)         │
│                                         │
│  The "Worst" Major (Hypothetical)       │
│                                         │
│  Nilai Akademik:    0.000 (min)        │
│  Akreditasi:        0.000 (min)        │
│  Biaya Kuliah:      1.000 (max)        │
│  Jarak Kampus:      1.000 (max)        │
│  Peluang Karir:     0.000 (min)        │
│                                         │
│  Note: This represents theoretical      │
│  failure, not a real university.        │
└─────────────────────────────────────────┘
```

### Section 6.2: 3D Spatial Visualization

**Interactive 3D Scatter Plot**
```
Visual: Three.js powered 3D space
- X-axis: Academic Quality (composite)
- Y-axis: Financial Accessibility (composite)
- Z-axis: Career Prospects (composite)

Points:
- Green star (large): A+ (Positive Ideal)
- Red star (large): A- (Negative Ideal)
- Blue spheres: Top 10 recommended majors
- Gray spheres: Other alternatives
- Yellow sphere (highlighted): User's #1 recommendation

Features:
- Rotate: Drag to rotate view
- Zoom: Scroll to zoom in/out
- Hover: Tooltip dengan jurusan details
- Click: Select untuk detailed comparison
- Distance lines: Show Si+ and Si- visually
```

**2D Projection Alternative** (for accessibility)
```
Visual: Scatter plot dengan dual axes
- X-axis: Distance to A+ (Si+)
- Y-axis: Distance to A- (Si-)

Quadrants:
┌─────────────┬─────────────┐
│ Far from A+ │ Far from A+ │
│ Far from A- │ Near A-     │
│ (Mediocre)  │ (Poor)      │
├─────────────┼─────────────┤
│ Near A+     │ Near A+     │
│ Far from A- │ Near A-     │
│ (IDEAL!)    │ (Mixed)     │
└─────────────┴─────────────┘

Optimal zone: Bottom-left (near A+, far from A-)
```

### Section 6.3: Euclidean Distance Calculation

**Distance Formula Display**
```
┌──────────────────────────────────────────────────┐
│ Euclidean Distance Formula:                      │
│                                                  │
│ Si+ = √[Σ(vij - vj+)²]                          │
│ Si- = √[Σ(vij - vj-)²]                          │
│                                                  │
│ Where:                                           │
│ - vij = weighted normalized value               │
│ - vj+ = ideal positive value for criterion j    │
│ - vj- = ideal negative value for criterion j    │
└──────────────────────────────────────────────────┘
```

**Calculation Breakdown Table**
```
Example: Teknik Informatika

┌──────────┬──────┬──────┬──────┬─────────┬─────────┐
│ Criterion│ vij  │ vj+  │ vj-  │ (vij-vj+)²│(vij-vj-)²│
├──────────┼──────┼──────┼──────┼─────────┼─────────┤
│ Nilai    │ 0.140│ 0.150│ 0.100│ 0.0001  │ 0.0016  │
│ Akred    │ 0.235│ 0.248│ 0.180│ 0.0002  │ 0.0030  │
│ Biaya    │ 0.095│ 0.050│ 0.150│ 0.0020  │ 0.0030  │
│ Jarak    │ 0.045│ 0.020│ 0.080│ 0.0006  │ 0.0012  │
│ Karir    │ 0.085│ 0.092│ 0.050│ 0.0000  │ 0.0012  │
├──────────┼──────┼──────┼──────┼─────────┼─────────┤
│ Sum      │      │      │      │ 0.0029  │ 0.0100  │
│ √Sum     │      │      │      │ 0.054   │ 0.100   │
└──────────┴──────┴──────┴──────┴─────────┴─────────┘

Si+ = 0.054 (Close to ideal! ✓)
Si- = 0.100 (Far from worst! ✓)
```

**Distance Comparison Chart**
```
Visual: Grouped bar chart untuk top 10 majors
┌────────────────────────────────────────┐
│ Tek. Inform.  ▓▓░░░░░░░░ Si+ (0.054)  │
│               ░░░░░░░░▓▓ Si- (0.100)  │
│                                        │
│ Sis. Inform.  ▓▓▓░░░░░░░ Si+ (0.062)  │
│               ░░░░░░░▓▓▓ Si- (0.095)  │
│                                        │
│ DKV           ▓▓▓▓░░░░░░ Si+ (0.078)  │
│               ░░░░░▓▓▓▓▓ Si- (0.085)  │
└────────────────────────────────────────┘

Legend:
▓ = Distance value
Shorter Si+ = Better (closer to ideal)
Longer Si- = Better (farther from worst)
```

---

## MODUL 7: FASE 06 DEEP DIVE - FINAL RANKING DASHBOARD
**Objective**: Presentasi rekomendasi final dengan full transparency

### Section 7.1: Closeness Coefficient Calculation

**Formula Display**
```
┌──────────────────────────────────────────────────┐
│ Closeness Coefficient (Ci):                      │
│                                                  │
│ Ci = Si- / (Si+ + Si-)                          │
│                                                  │
│ Range: 0 ≤ Ci ≤ 1                               │
│ - Ci = 1.0 → Identical to A+ (perfect)         │
│ - Ci = 0.0 → Identical to A- (worst)           │
│ - Higher Ci = Better recommendation             │
└──────────────────────────────────────────────────┘
```

**Calculation Examples**
```
Rank #1: Teknik Informatika
Ci = 0.100 / (0.054 + 0.100)
Ci = 0.100 / 0.154
Ci = 0.649 (64.9%)

Rank #2: Sistem Informasi
Ci = 0.095 / (0.062 + 0.095)
Ci = 0.095 / 0.157
Ci = 0.605 (60.5%)

Rank #3: DKV
Ci = 0.085 / (0.078 + 0.085)
Ci = 0.085 / 0.163
Ci = 0.521 (52.1%)
```

### Section 7.2: Final Ranking Leaderboard

**Animated Ranking Table**
```
┌──────┬─────────────────────┬──────┬──────┬──────┬────────────┐
│ Rank │ Jurusan             │ Ci   │ Si+  │ Si-  │ Confidence │
├──────┼─────────────────────┼──────┼──────┼──────┼────────────┤
│  🥇  │ Teknik Informatika  │ 0.649│ 0.054│ 0.100│ Very High  │
│      │ Universitas A (A)   │      │      │      │ ████████   │
│      │ [Explore Details →] │      │      │      │            │
├──────┼─────────────────────┼──────┼──────┼──────┼────────────┤
│  🥈  │ Sistem Informasi    │ 0.605│ 0.062│ 0.095│ High       │
│      │ Universitas B (A)   │      │      │      │ ███████░   │
│      │ [Explore Details →] │      │      │      │            │
├──────┼─────────────────────┼──────┼──────┼──────┼────────────┤
│  🥉  │ DKV                 │ 0.521│ 0.078│ 0.085│ High       │
│      │ Universitas C (B)   │      │      │      │ ██████░░   │
│      │ [Explore Details →] │      │      │      │            │
├──────┼─────────────────────┼──────┼──────┼──────┼────────────┤
│  4   │ Ekonomi             │ 0.498│ 0.085│ 0.082│ Medium     │
│  5   │ Manajemen           │ 0.475│ 0.092│ 0.078│ Medium     │
│  ... │ ...                 │ ...  │ ...  │ ...  │ ...        │
└──────┴─────────────────────┴──────┴──────┴──────┴────────────┘

Features:
- Sortable by any column
- Expandable rows untuk university options
- Color-coded confidence levels
- Export to PDF/Excel
```

### Section 7.3: Contribution Breakdown

**Criteria Contribution Analysis**
```
Visual: Stacked bar chart untuk top 3 recommendations

Teknik Informatika (Ci: 0.649)
┌────────────────────────────────────────────────┐
│ ████ Nilai (15%) ██████ Akred (25%)           │
│ ████ Biaya (18%) ███ Jarak (12%)              │
│ ██████████ Karir (30%)                        │
└────────────────────────────────────────────────┘

Sistem Informasi (Ci: 0.605)
┌────────────────────────────────────────────────┐
│ ████ Nilai (14%) ██████ Akred (23%)           │
│ █████ Biaya (20%) ████ Jarak (15%)            │
│ ████████ Karir (28%)                          │
└────────────────────────────────────────────────┘

Interpretation:
- Karir contributes most to Tek. Informatika's high score
- Biaya is more favorable for Sistem Informasi
- Hover untuk detailed breakdown
```

**Radar Chart Comparison**
```
Visual: Multi-layer radar chart
- 5 axes (one per criterion)
- 3 overlays (top 3 recommendations)
- User's weight preferences shown as reference line

Interaction:
- Toggle layers on/off
- Hover axis: Show raw scores
- Click recommendation: Highlight its layer
```

### Section 7.4: Detailed Recommendation Cards

**Expandable Card Design**
```
┌─────────────────────────────────────────────────────┐
│ 🥇 RANK #1: TEKNIK INFORMATIKA                      │
│ Closeness Coefficient: 0.649 (64.9%)               │
│ Confidence Level: VERY HIGH ████████                │
├─────────────────────────────────────────────────────┤
│ WHY THIS MAJOR?                                     │
│ ✓ Excellent alignment dengan minat programming     │
│ ✓ Strong career prospects (92% employment rate)    │
│ ✓ Akreditasi A dari BAN-PT                         │
│ ⚠ Slightly above budget (Rp 8.5M vs Rp 7M target) │
│ ⚠ Moderate distance (15km)                         │
├─────────────────────────────────────────────────────┤
│ TOP UNIVERSITIES OFFERING THIS MAJOR:               │
│                                                     │
│ 1. Universitas Indonesia                           │
│    Akreditasi: A | Biaya: Rp 8.2M | Jarak: 12km   │
│    [Apply Now] [Virtual Tour] [Alumni Network]     │
│                                                     │
│ 2. Institut Teknologi Bandung                      │
│    Akreditasi: A | Biaya: Rp 7.8M | Jarak: 150km  │
│    [Apply Now] [Virtual Tour] [Alumni Network]     │
│                                                     │
│ 3. Universitas Gadjah Mada                         │
│    Akreditasi: A | Biaya: Rp 7.5M | Jarak: 500km  │
│    [Apply Now] [Virtual Tour] [Alumni Network]     │
├─────────────────────────────────────────────────────┤
│ CAREER OUTLOOK (from Tracer Study):                 │
│ - Average starting salary: Rp 7.5M/month           │
│ - Employment within 6 months: 92%                  │
│ - Top employers: Tech startups, Banks, Consulting  │
│ - Career growth: High (avg 15% annual increase)    │
├─────────────────────────────────────────────────────┤
│ CURRICULUM HIGHLIGHTS:                              │
│ - Programming (Java, Python, C++)                  │
│ - Data Structures & Algorithms                     │
│ - Database Management                              │
│ - Software Engineering                             │
│ - AI & Machine Learning                            │
├─────────────────────────────────────────────────────┤
│ STUDENT TESTIMONIALS:                               │
│ "Challenging but rewarding. Great job prospects!"  │
│ - Ahmad, Class of 2024                             │
│                                                     │
│ [Read More Reviews] [Connect with Current Students]│
├─────────────────────────────────────────────────────┤
│ ACTIONS:                                            │
│ [Download Full Report] [Share with Parents]        │
│ [Schedule Counseling] [Compare with Rank #2]       │
└─────────────────────────────────────────────────────┘
```


---

## MODUL TAMBAHAN: ADVANCED FEATURES

### A. COMPARATIVE ANALYSIS DASHBOARD

**Side-by-Side Comparison Tool**
```
Visual: Split-screen comparison (up to 3 majors)
┌──────────────┬──────────────┬──────────────┐
│ Tek. Inform. │ Sis. Inform. │     DKV      │
├──────────────┼──────────────┼──────────────┤
│ Ci: 0.649    │ Ci: 0.605    │ Ci: 0.521    │
│ Rank: #1     │ Rank: #2     │ Rank: #3     │
├──────────────┼──────────────┼──────────────┤
│ STRENGTHS    │ STRENGTHS    │ STRENGTHS    │
│ • Karir ⭐⭐⭐ │ • Biaya ⭐⭐⭐  │ • Jarak ⭐⭐⭐  │
│ • Akred ⭐⭐⭐ │ • Akred ⭐⭐   │ • Minat ⭐⭐⭐  │
├──────────────┼──────────────┼──────────────┤
│ WEAKNESSES   │ WEAKNESSES   │ WEAKNESSES   │
│ • Biaya ⚠    │ • Karir ⚠    │ • Karir ⚠⚠   │
│ • Jarak ⚠    │ • Jarak ⚠    │ • Akred ⚠    │
├──────────────┼──────────────┼──────────────┤
│ BEST FOR:    │ BEST FOR:    │ BEST FOR:    │
│ Career-      │ Budget-      │ Creative     │
│ focused      │ conscious    │ minds        │
└──────────────┴──────────────┴──────────────┘

Features:
- Drag & drop majors to compare
- Highlight differences
- Export comparison report
```

**Difference Analyzer**
```
Visual: Delta visualization
┌─────────────────────────────────────────────┐
│ Tek. Informatika vs Sistem Informasi       │
│                                             │
│ Ci Difference: +0.044 (7.3% better)        │
│                                             │
│ Key Differentiators:                        │
│ ▲ Karir: +4 points (TI wins)               │
│ ▼ Biaya: -1.3M (SI wins)                   │
│ ▲ Akred: +5 points (TI wins)               │
│ ≈ Jarak: Similar (3km difference)          │
│                                             │
│ Verdict: TI is better IF you prioritize    │
│ career over cost. Otherwise, SI is solid.  │
└─────────────────────────────────────────────┘
```

### B. HISTORICAL TRACKING DASHBOARD

**Assessment History Timeline**
```
Visual: Horizontal timeline dengan nodes
┌─────────────────────────────────────────────┐
│ Jan 2026    Mar 2026    May 2026    Now     │
│    ●───────────●───────────●─────────●      │
│    │           │           │          │      │
│  First      Re-test    Adjusted   Current   │
│  Assess     (CR fail)  Weights    Results   │
│                                             │
│ Click node to view historical results      │
└─────────────────────────────────────────────┘
```

**Preference Evolution Chart**
```
Visual: Line chart showing weight changes over time
┌─────────────────────────────────────────────┐
│ Criteria Weight Evolution                   │
│                                             │
│ 50%│         ╱Karir                         │
│    │        ╱                                │
│ 40%│       ╱                                 │
│    │   Biaya╲                                │
│ 30%│  ╱      ╲___                           │
│    │ ╱           ╲___Akred                  │
│ 20%│╱                ╲___                   │
│    └─────────────────────────────           │
│    Jan    Mar    May    Now                 │
│                                             │
│ Insight: Your priority shifted from cost   │
│ to career prospects over 6 months.         │
└─────────────────────────────────────────────┘
```

**Recommendation Stability Indicator**
```
Visual: Consistency score
┌─────────────────────────────────────────────┐
│ Top Recommendation Stability: 85%           │
│                                             │
│ Tek. Informatika has been your #1 choice   │
│ in 3 out of 4 assessments.                 │
│                                             │
│ This indicates strong alignment with your  │
│ core preferences. High confidence!         │
└─────────────────────────────────────────────┘
```

### C. WHAT-IF SCENARIO SIMULATOR

**Interactive Scenario Builder**
```
Visual: Control panel dengan sliders & toggles
┌─────────────────────────────────────────────┐
│ SCENARIO: "What if I get scholarship?"     │
│                                             │
│ Adjust Parameters:                          │
│ Biaya Kuliah: [====|====] -50% (scholarship)│
│ Jarak Kampus: [====|====] No change        │
│ Akreditasi:   [====|====] No change        │
│                                             │
│ [Run Simulation]                            │
│                                             │
│ RESULTS:                                    │
│ New Rank #1: Universitas Swasta Premium    │
│ (Previously #5, now affordable!)           │
│                                             │
│ Ci change: 0.521 → 0.678 (+30%)            │
└─────────────────────────────────────────────┘
```

**Scenario Library**
```
Pre-built scenarios:
1. "I got scholarship" (Biaya -50%)
2. "I'm willing to relocate" (Jarak weight -50%)
3. "Career is everything" (Karir weight +20%)
4. "Budget is tight" (Biaya weight +30%)
5. "Only top universities" (Akred minimum = A)

User can save custom scenarios
```

### D. RISK ASSESSMENT DASHBOARD

**Risk Matrix**
```
Visual: 2x2 matrix
┌─────────────────────────────────────────────┐
│           RISK ASSESSMENT                   │
│                                             │
│ High Risk  │ Moderate Risk                  │
│ High Reward│ High Reward                    │
│            │                                 │
│ ─────────────────────────────               │
│            │                                 │
│ Low Risk   │ Moderate Risk                  │
│ Low Reward │ Low Reward                     │
│                                             │
│ Your Top 3:                                 │
│ • Tek. Inform: Moderate Risk, High Reward  │
│ • Sis. Inform: Low Risk, High Reward ✓     │
│ • DKV: Moderate Risk, Moderate Reward      │
└─────────────────────────────────────────────┘
```

**Risk Factors Breakdown**
```
Visual: Risk indicator cards
┌─────────────────────────────────────────────┐
│ TEKNIK INFORMATIKA - Risk Analysis          │
│                                             │
│ ⚠ Academic Difficulty: HIGH                 │
│   - High dropout rate (18%)                 │
│   - Intensive math requirements             │
│   - Mitigation: Take bridge courses         │
│                                             │
│ ✓ Job Market: LOW RISK                     │
│   - 92% employment rate                     │
│   - Growing industry demand                 │
│                                             │
│ ⚠ Financial: MODERATE                       │
│   - Above budget by 21%                     │
│   - Mitigation: Apply for scholarships      │
│                                             │
│ Overall Risk Score: 6.2/10 (Moderate)      │
└─────────────────────────────────────────────┘
```

### E. PEER COMPARISON DASHBOARD

**Anonymous Benchmarking**
```
Visual: Percentile chart
┌─────────────────────────────────────────────┐
│ How You Compare to Similar Students         │
│                                             │
│ Students with similar profile (n=1,247):    │
│                                             │
│ Your Ci Score: 0.649                        │
│ ────────────────────────|─────              │
│ 0.3    0.5    0.7    0.9    1.0            │
│                                             │
│ You're in the 78th percentile!              │
│ Your recommendation quality is better than  │
│ 78% of students with similar backgrounds.   │
│                                             │
│ Average Ci for your cohort: 0.582           │
│ Your advantage: +0.067 (11.5% better)      │
└─────────────────────────────────────────────┘
```

**Popular Choices Among Peers**
```
Visual: Bubble chart
┌─────────────────────────────────────────────┐
│ Top Majors Chosen by SMK TIK Graduates      │
│                                             │
│        ●Tek.Inform (35%)                    │
│                                             │
│   ●Sis.Inform (22%)    ●DKV (18%)          │
│                                             │
│     ●Manajemen (12%)  ●Ekonomi (8%)        │
│                                             │
│ Bubble size = popularity                    │
│ Your top choice: Tek. Inform (aligned!)    │
└─────────────────────────────────────────────┘
```

### F. EXPORT & SHARING FEATURES

**Report Generator**
```
Options:
1. Executive Summary (2 pages)
   - Top 3 recommendations
   - Key insights
   - Action items

2. Comprehensive Report (15-20 pages)
   - Full methodology explanation
   - All 6 phases detailed
   - Complete ranking (top 25)
   - University options per major
   - Career outlook data
   - Risk assessment

3. Presentation Deck (10 slides)
   - For discussing with parents/counselors
   - Visual-heavy, less technical
   - Key decision points highlighted

Formats: PDF, PowerPoint, Excel
```

**Sharing Options**
```
1. Share with Parents
   - Email with password protection
   - Read-only access
   - Comment feature enabled

2. Share with Counselor
   - Full access to methodology
   - Ability to adjust weights (with approval)
   - Collaborative notes

3. Share with Friends
   - Anonymous comparison
   - No personal data exposed
   - "We both like Tek. Inform!"

4. Social Media
   - "I found my perfect major with 95% confidence!"
   - Custom graphics generated
   - Link to MajorMind (referral tracking)
```

---

## TECHNICAL SPECIFICATIONS

### Performance Requirements
- Page load time: < 2 seconds
- Chart rendering: < 500ms
- Real-time calculations: < 100ms
- Smooth animations: 60fps
- Responsive: Mobile, tablet, desktop

### Data Visualization Libraries
- Charts: Recharts / Chart.js / D3.js
- 3D Graphics: Three.js
- Maps: Mapbox / Leaflet
- Animations: Framer Motion / GSAP
- Tables: TanStack Table / AG Grid

### Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support
- Color blind friendly palettes
- High contrast mode

### Interactivity Patterns
- Hover: Tooltips dengan detailed info
- Click: Navigate to detail view
- Drag: Reorder, compare, adjust
- Scroll: Lazy load, infinite scroll
- Pinch/Zoom: For charts & graphs

---

## USER EXPERIENCE GUIDELINES

### Progressive Disclosure
- Level 1: At-a-glance summary (Command Center)
- Level 2: Phase-specific deep dives
- Level 3: Raw data & calculations
- Level 4: Export & advanced analysis

### Contextual Help
- "?" icons dengan tooltips
- Inline explanations untuk technical terms
- Video tutorials embedded
- Chatbot untuk Q&A

### Feedback Mechanisms
- Success messages: Green toast notifications
- Errors: Red alerts dengan actionable fixes
- Warnings: Yellow banners dengan context
- Progress: Loading states, skeleton screens

### Personalization
- Save custom views
- Bookmark favorite comparisons
- Set notification preferences
- Theme: Light/Dark mode

---

## DASHBOARD NAVIGATION STRUCTURE

```
┌─────────────────────────────────────────────┐
│ SIDEBAR MENU                                │
├─────────────────────────────────────────────┤
│ 🏠 Command Center                           │
│                                             │
│ 📊 Phase Deep Dives                         │
│   ├─ 01: Behavioral Profiling               │
│   ├─ 02: AHP Pairwise Comparison            │
│   ├─ 03: Consistency Validation             │
│   ├─ 04: TOPSIS Normalization               │
│   ├─ 05: Ideal Solution Distance            │
│   └─ 06: Final Ranking                      │
│                                             │
│ 🔬 Advanced Analysis                        │
│   ├─ Comparative Analysis                   │
│   ├─ What-If Scenarios                      │
│   ├─ Risk Assessment                        │
│   └─ Peer Comparison                        │
│                                             │
│ 📈 Historical Tracking                      │
│   ├─ Assessment History                     │
│   ├─ Preference Evolution                   │
│   └─ Recommendation Stability               │
│                                             │
│ 📄 Reports & Export                         │
│   ├─ Generate Report                        │
│   ├─ Download Data                          │
│   └─ Share Results                          │
│                                             │
│ ⚙️ Settings                                 │
│   ├─ Profile Management                     │
│   ├─ Notification Preferences               │
│   └─ Privacy Controls                       │
│                                             │
│ ❓ Help & Support                           │
│   ├─ Tutorial Videos                        │
│   ├─ FAQ                                    │
│   └─ Contact Counselor                      │
└─────────────────────────────────────────────┘
```

---

## MOBILE-SPECIFIC CONSIDERATIONS

### Responsive Adaptations
- Command Center: Vertical card stack
- Charts: Simplified, swipeable
- Tables: Horizontal scroll, collapsible columns
- 3D visualizations: 2D fallback
- Navigation: Bottom tab bar

### Touch Interactions
- Swipe: Navigate between phases
- Tap: Expand/collapse sections
- Long press: Context menu
- Pinch: Zoom charts
- Pull to refresh: Update data

### Mobile-First Features
- Push notifications: "Your assessment is ready!"
- Offline mode: View cached results
- Quick actions: Widget untuk home screen
- Share sheet: Native sharing

---

## GAMIFICATION ELEMENTS

### Achievement Badges
- "Consistency Master": CR < 0.05
- "Thorough Researcher": Viewed all 6 phases
- "Decision Maker": Completed assessment in < 30 min
- "Wise Chooser": Top recommendation matches peer success
- "Explorer": Ran 5+ what-if scenarios

### Progress Tracking
- Assessment completion: 0% → 100%
- Profile completeness: "85% complete, add 2 more details"
- Exploration score: "You've explored 60% of features"

### Social Features
- Leaderboard: "Fastest assessment completion"
- Referral program: "Invite 3 friends, unlock premium"
- Success stories: "Alumni who chose this major"

---

## ACCESSIBILITY & INCLUSIVITY

### Language Support
- Bahasa Indonesia (primary)
- English (secondary)
- Regional languages (future)

### Cognitive Accessibility
- Simple language mode (reduce jargon)
- Visual mode (more charts, less text)
- Text mode (more explanations, less visuals)

### Assistive Technology
- Screen reader optimized
- Voice navigation
- High contrast themes
- Adjustable font sizes

---

## SECURITY & PRIVACY

### Data Protection
- End-to-end encryption
- GDPR/UU PDP compliant
- No data selling
- Anonymous analytics only

### User Controls
- Export all data
- Delete account
- Opt-out of analytics
- Control sharing permissions

---

## KESIMPULAN PROMPT DASHBOARD

Dashboard MajorMind harus menjadi masterpiece dalam data visualization dan user experience design. Setiap pixel harus melayani tujuan: memberikan transparency, membangun trust, dan memfasilitasi informed decision-making.

### Key Principles Recap:
1. **Transparency**: Expose seluruh algorithmic journey
2. **Interactivity**: User dapat explore, adjust, simulate
3. **Clarity**: Complex math → Simple visuals
4. **Actionability**: Insights → Concrete next steps
5. **Confidence**: Data quality indicators, risk assessment

### Success Metrics:
- User engagement: Avg 15+ minutes on dashboard
- Feature adoption: 80%+ users explore deep dives
- Satisfaction: 4.5/5 rating
- Conversion: 70%+ proceed to application
- Retention: 60%+ return for re-assessment

Dashboard ini bukan hanya tool, tapi companion dalam journey pemilihan jurusan yang akan menentukan masa depan user. Treat it with the gravitas it deserves! 🚀
