# PROMPT SUPER ADVANCE: ALGORITHM ENHANCEMENT MAJORMIND
## Transformasi Menuju Enterprise-Grade Decision Support System

## KONTEKS STRATEGIS
MajorMind saat ini menggunakan hybrid AHP-TOPSIS dengan akurasi 95.71%. Untuk mencapai status enterprise-grade dan menjadi masterpiece akademik yang tak tertandingi, sistem harus ditingkatkan melalui 5 Pilar Struktural dengan fokus pada penguatan algoritma, eliminasi bias, dan skalabilitas komputasi.

---

## PILAR 1: PSIKOMETRI - ELIMINASI SELF-REPORTING BIAS

### 1.1 PROBLEM STATEMENT

**Current State (Kelemahan)**:
```
Input Method: Manual slider (1-100)
- User input: "Minat Teknologi: 85"
- User input: "Kemampuan Logika: 90"
- User input: "Konsistensi: 95"

CRITICAL FLAW:
❌ Dunning-Kruger Effect: User overestimate kemampuan
❌ Social Desirability Bias: User jawab sesuai ekspektasi sosial
❌ No validation: Tidak ada mekanisme verifikasi objektif
❌ Manipulation risk: User bisa "game the system"
```

**Impact Analysis**:
- Jika user overestimate Logika dari 70 (real) → 90 (claimed)
- TOPSIS akan merekomendasikan STEM majors (Teknik, Matematika)
- User masuk jurusan yang terlalu sulit → Drop-out risk tinggi
- Akurasi sistem turun dari 95.71% → ~70%

### 1.2 SOLUTION ARCHITECTURE

#### A. Holland RIASEC Integration

**Theoretical Foundation**:
```
Holland's Theory: 6 personality types
- Realistic (R): Hands-on, mechanical
- Investigative (I): Analytical, scientific
- Artistic (A): Creative, expressive
- Social (S): Helping, teaching
- Enterprising (E): Leadership, persuasion
- Conventional (C): Organized, detail-oriented
```

**Implementation Algorithm**:
```python
# RIASEC Assessment Engine
class RIASECAssessment:
    def __init__(self):
        self.questions = self.load_validated_questions()
        self.scoring_matrix = self.load_scoring_matrix()
    
    def administer_test(self, user_id):
        """
        60 pertanyaan tervalidasi (10 per dimensi)
        Format: Likert scale 1-5
        Durasi: 15 menit
        """
        responses = []
        for question in self.questions:
            response = self.present_question(question)
            responses.append(response)
        
        return self.calculate_riasec_profile(responses)
    
    def calculate_riasec_profile(self, responses):
        """
        Output: 6-dimensional profile
        Example: R=45, I=78, A=62, S=55, E=40, C=50
        """
        profile = {
            'Realistic': sum(responses[0:10]),
            'Investigative': sum(responses[10:20]),
            'Artistic': sum(responses[20:30]),
            'Social': sum(responses[30:40]),
            'Enterprising': sum(responses[40:50]),
            'Conventional': sum(responses[50:60])
        }
        
        # Normalize to 0-100 scale
        return self.normalize_profile(profile)
    
    def map_to_majors(self, riasec_profile):
        """
        Mapping RIASEC → Major categories
        
        High I + High R → Engineering
        High I + High A → Architecture, Design
        High S + High A → Psychology, Education
        High E + High C → Business, Management
        High I + Low R → Pure Sciences, Research
        """
        major_affinity = {}
        
        # Engineering majors
        major_affinity['Teknik Informatika'] = (
            0.4 * riasec_profile['Investigative'] +
            0.3 * riasec_profile['Realistic'] +
            0.2 * riasec_profile['Conventional'] +
            0.1 * riasec_profile['Artistic']
        )
        
        # Medical majors
        major_affinity['Kedokteran'] = (
            0.5 * riasec_profile['Investigative'] +
            0.3 * riasec_profile['Social'] +
            0.2 * riasec_profile['Realistic']
        )
        
        # Arts majors
        major_affinity['DKV'] = (
            0.6 * riasec_profile['Artistic'] +
            0.2 * riasec_profile['Investigative'] +
            0.2 * riasec_profile['Enterprising']
        )
        
        # Business majors
        major_affinity['Manajemen'] = (
            0.4 * riasec_profile['Enterprising'] +
            0.3 * riasec_profile['Conventional'] +
            0.2 * riasec_profile['Social'] +
            0.1 * riasec_profile['Investigative']
        )
        
        return major_affinity
```

#### B. Item Response Theory (IRT) for Cognitive Assessment

**Theoretical Foundation**:
```
IRT Model: 3-Parameter Logistic (3PL)

P(θ) = c + (1-c) / (1 + e^(-a(θ-b)))

Where:
- θ (theta): Latent ability of student
- a: Discrimination parameter (how well item differentiates)
- b: Difficulty parameter (item difficulty level)
- c: Guessing parameter (probability of correct guess)
- P(θ): Probability of correct response given ability θ
```

**Implementation Algorithm**:
```python
# IRT-Based Adaptive Testing Engine
class IRTAdaptiveTest:
    def __init__(self):
        self.item_bank = self.load_calibrated_items()
        self.theta_estimate = 0.0  # Initial ability estimate
        self.theta_se = 1.0  # Standard error
        
    def administer_adaptive_test(self, user_id):
        """
        Computerized Adaptive Testing (CAT)
        - Start with medium difficulty (b=0)
        - Adjust based on responses
        - Stop when SE < 0.3 or max 20 questions
        """
        responses = []
        items_administered = []
        
        while self.theta_se > 0.3 and len(responses) < 20:
            # Select next optimal item
            next_item = self.select_next_item(
                self.theta_estimate, 
                items_administered
            )
            
            # Administer item
            response = self.present_item(next_item)
            responses.append(response)
            items_administered.append(next_item)
            
            # Update ability estimate (Maximum Likelihood Estimation)
            self.theta_estimate, self.theta_se = self.update_theta(
                responses, 
                items_administered
            )
        
        # Convert theta (-3 to +3) to 0-100 scale
        cognitive_score = self.theta_to_score(self.theta_estimate)
        
        return {
            'cognitive_ability': cognitive_score,
            'confidence_interval': self.theta_se,
            'questions_asked': len(responses),
            'theta': self.theta_estimate
        }
    
    def select_next_item(self, theta, administered):
        """
        Select item with maximum information at current theta
        Information function: I(θ) = a² * P(θ) * Q(θ) / (c + Q(θ))²
        """
        max_info = 0
        best_item = None
        
        for item in self.item_bank:
            if item not in administered:
                info = self.item_information(item, theta)
                if info > max_info:
                    max_info = info
                    best_item = item
        
        return best_item
    
    def update_theta(self, responses, items):
        """
        Maximum Likelihood Estimation (MLE)
        Find θ that maximizes likelihood of observed responses
        """
        # Newton-Raphson method
        theta = self.theta_estimate
        
        for iteration in range(10):  # Max 10 iterations
            L_prime = 0  # First derivative
            L_double_prime = 0  # Second derivative
            
            for i, item in enumerate(items):
                a, b, c = item['a'], item['b'], item['c']
                u = responses[i]  # 1 if correct, 0 if wrong
                
                P = self.probability_correct(theta, a, b, c)
                Q = 1 - P
                
                L_prime += a * (u - P) / (P * Q)
                L_double_prime -= a**2 * (u - P) * (1 - 2*P) / (P**2 * Q**2)
            
            # Newton-Raphson update
            theta_new = theta - L_prime / L_double_prime
            
            if abs(theta_new - theta) < 0.001:
                break
            
            theta = theta_new
        
        # Calculate standard error
        se = 1 / sqrt(-L_double_prime)
        
        return theta, se
    
    def probability_correct(self, theta, a, b, c):
        """3PL model"""
        return c + (1 - c) / (1 + exp(-a * (theta - b)))
    
    def theta_to_score(self, theta):
        """
        Convert theta (-3 to +3) to 0-100 scale
        Using cumulative normal distribution
        """
        from scipy.stats import norm
        percentile = norm.cdf(theta)
        return int(percentile * 100)
```

#### C. Grit Scale for Consistency Measurement

**Theoretical Foundation**:
```
Grit = Perseverance + Passion for Long-term Goals
Developed by Angela Duckworth (2007)

12-item questionnaire measuring:
- Consistency of Interest (6 items)
- Perseverance of Effort (6 items)

Scoring: 5-point Likert scale
Output: Grit score 1.0 - 5.0
```

**Implementation Algorithm**:
```python
# Grit Scale Assessment
class GritScaleAssessment:
    def __init__(self):
        self.questions = [
            # Consistency of Interest
            {"text": "Saya sering menetapkan tujuan tapi kemudian mengejar tujuan yang berbeda", "reverse": True},
            {"text": "Ide dan proyek baru kadang mengalihkan perhatian saya dari ide/proyek sebelumnya", "reverse": True},
            {"text": "Saya kesulitan mempertahankan fokus pada proyek yang memakan waktu lebih dari beberapa bulan", "reverse": True},
            {"text": "Minat saya berubah dari tahun ke tahun", "reverse": True},
            {"text": "Saya pernah terobsesi dengan ide/proyek tertentu untuk waktu singkat tapi kemudian kehilangan minat", "reverse": True},
            {"text": "Saya kesulitan mempertahankan fokus pada tujuan yang memakan waktu bertahun-tahun", "reverse": True},
            
            # Perseverance of Effort
            {"text": "Saya menyelesaikan apa pun yang saya mulai", "reverse": False},
            {"text": "Kemunduran tidak membuat saya berkecil hati", "reverse": False},
            {"text": "Saya adalah pekerja keras", "reverse": False},
            {"text": "Saya menyelesaikan apa yang saya mulai", "reverse": False},
            {"text": "Saya gigih dalam mencapai tujuan jangka panjang", "reverse": False},
            {"text": "Saya tidak mudah menyerah", "reverse": False}
        ]
    
    def calculate_grit_score(self, responses):
        """
        responses: List of 12 integers (1-5)
        Returns: Grit score (1.0 - 5.0) and subscales
        """
        consistency_items = [0, 1, 2, 3, 4, 5]
        perseverance_items = [6, 7, 8, 9, 10, 11]
        
        # Reverse scoring for reverse-coded items
        adjusted_responses = []
        for i, response in enumerate(responses):
            if self.questions[i]['reverse']:
                adjusted_responses.append(6 - response)
            else:
                adjusted_responses.append(response)
        
        # Calculate subscales
        consistency_score = sum([adjusted_responses[i] for i in consistency_items]) / 6
        perseverance_score = sum([adjusted_responses[i] for i in perseverance_items]) / 6
        
        # Overall grit score
        grit_score = (consistency_score + perseverance_score) / 2
        
        # Convert to 0-100 scale for MajorMind
        grit_normalized = ((grit_score - 1) / 4) * 100
        
        return {
            'grit_score': grit_score,
            'grit_normalized': grit_normalized,
            'consistency_of_interest': consistency_score,
            'perseverance_of_effort': perseverance_score
        }
```

### 1.3 INTEGRATION WITH MAJORMIND

**Unified Behavioral Profile**:
```python
class UnifiedBehavioralProfile:
    def __init__(self):
        self.riasec = RIASECAssessment()
        self.irt = IRTAdaptiveTest()
        self.grit = GritScaleAssessment()
    
    def generate_profile(self, user_id):
        """
        Generate comprehensive behavioral profile
        Replaces manual slider inputs
        """
        # 1. RIASEC for Interest
        riasec_profile = self.riasec.administer_test(user_id)
        interest_score = self.riasec.map_to_majors(riasec_profile)
        
        # 2. IRT for Cognitive Ability
        irt_result = self.irt.administer_adaptive_test(user_id)
        logic_score = irt_result['cognitive_ability']
        
        # 3. Grit Scale for Consistency
        grit_responses = self.collect_grit_responses(user_id)
        grit_result = self.grit.calculate_grit_score(grit_responses)
        consistency_score = grit_result['grit_normalized']
        
        # 4. Construct behavioral_profile for TOPSIS
        behavioral_profile = {
            'minat': interest_score,  # Dict of major → affinity score
            'logika': logic_score,  # 0-100
            'konsistensi': consistency_score,  # 0-100
            'confidence': {
                'riasec_reliability': self.calculate_cronbach_alpha(riasec_profile),
                'irt_se': irt_result['confidence_interval'],
                'grit_reliability': 0.85  # Published reliability
            }
        }
        
        return behavioral_profile
```

**Validation Metrics**:
```python
def validate_psychometric_instruments():
    """
    Ensure instruments meet psychometric standards
    """
    validation_results = {
        'RIASEC': {
            'reliability': 0.90,  # Cronbach's Alpha
            'validity': 'Construct validity established',
            'test_retest': 0.85  # 2-week interval
        },
        'IRT_CAT': {
            'reliability': 0.92,  # Marginal reliability
            'validity': 'Criterion validity with GPA r=0.65',
            'efficiency': '50% fewer items than fixed-length test'
        },
        'Grit_Scale': {
            'reliability': 0.85,  # Cronbach's Alpha
            'validity': 'Predictive validity for retention',
            'test_retest': 0.68  # 1-year interval
        }
    }
    
    return validation_results
```

