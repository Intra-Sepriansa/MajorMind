export type Criterion = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    type: string;
    display_order: number;
};

export type ProfileMatchingGap = {
    student: number;
    target: number;
    raw_gap: number;
    gap_value: number;
    is_core: boolean;
};

export type ProfileMatchingMeta = {
    core_factors: string[];
    secondary_factors: string[];
    core_score: number;
    secondary_score: number;
    gaps: Record<string, ProfileMatchingGap>;
};

export type SawVerificationMeta = {
    saw_rank: number;
    saw_score: number;
};

export type RecommendationMeta = {
    probability_percentage?: number;
    weighted_scores?: Record<string, number>;
    profile_matching?: ProfileMatchingMeta;
    saw_verification?: SawVerificationMeta;
};

export type Recommendation = {
    rank: number;
    major: {
        id: number;
        name: string;
        slug: string;
    };
    topsis_score: number;
    behavioral_score: number;
    final_score: number;
    distance_positive: number;
    distance_negative: number;
    meta: RecommendationMeta | null;
};

export type AssessmentSummary = {
    lambda_max?: number;
    consistency_index?: number;
    recommendation_confidence?: number;
    algorithm_agreement?: boolean;
    eliminated_alternatives?: number;
    scoring_method?: string;
    cross_verification?: string;
    psychometric_data?: PsychometricProfile;
};

export type RiasecScores = {
    scores: Record<string, number>;
    holland_code: string;
    primary_type: string;
    secondary_type: string;
    tertiary_type: string;
};

export type GritResult = {
    total_score: number;
    perseverance_score: number;
    consistency_score: number;
    percentile: number;
    level: string;
};

export type LogicTestResult = {
    theta: number;
    standard_error: number;
    score: number;
    items_administered: number;
    reliability: number;
};

export type QualityValidation = {
    is_valid: boolean;
    flags: string[];
    quality_score: number;
    metrics: Record<string, any>;
};

export type PsychometricProfile = {
    riasec: RiasecScores | null;
    grit: GritResult | null;
    logic: LogicTestResult | null;
    validation: QualityValidation | null;
};

export type AssessmentResponse = {
    id: number;
    student_name: string | null;
    created_at?: string;
    mode?: 'primary' | 'scenario';
    label?: string | null;
    scenario_notes?: string | null;
    decision_rationale?: string | null;
    parent_assessment_id?: number | null;
    criterion_order: string[];
    criterion_weights: Record<string, number>;
    consistency_ratio: number;
    behavioral_profile: Record<string, number>;
    top_major: {
        id: number;
        name: string;
        slug: string;
    } | null;
    summary: AssessmentSummary | null;
    psychometric_profile?: PsychometricProfile;
    recommendations: Recommendation[];
};

export type AssessmentHistoryItem = {
    id: number;
    student_name: string | null;
    created_at: string | null;
    consistency_ratio: number;
    confidence: number;
    top_major: {
        id: number;
        name: string;
        slug: string;
    } | null;
};

export type AssessmentHistoryPaginated = {
    data: AssessmentHistoryItem[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export type ApiResponse<T> = {
    data: T;
};
