<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAssessmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_name' => ['nullable', 'string', 'max:255'],
            'mode' => ['nullable', 'string', 'in:primary,scenario'],
            'label' => ['nullable', 'string', 'max:255'],
            'scenario_notes' => ['nullable', 'string'],
            'decision_rationale' => ['nullable', 'string'],
            'parent_assessment_id' => ['nullable', 'integer', 'exists:assessments,id'],
            'criterion_order' => ['required', 'array', 'min:2'],
            'criterion_order.*' => ['required', 'string', 'distinct', 'exists:criteria,slug'],
            'pairwise_matrix' => ['required', 'array', 'min:2'],
            'pairwise_matrix.*' => ['required', 'array', 'min:2'],
            'pairwise_matrix.*.*' => ['required', 'numeric', 'gt:0'],
            'behavioral_profile' => ['required', 'array', 'min:1'],
            'behavioral_profile.*' => ['required', 'numeric', 'between:0,100'],

            // Psychometric profiling (optional — enabled when wizard uses RIASEC/Grit/Logic)
            'psychometric_profile' => ['nullable', 'array'],
            'psychometric_profile.riasec_answers' => ['nullable', 'array', 'min:48', 'max:48'],
            'psychometric_profile.riasec_answers.*' => ['nullable', 'integer', 'between:1,5'],
            'psychometric_profile.grit_answers' => ['nullable', 'array', 'min:12', 'max:12'],
            'psychometric_profile.grit_answers.*' => ['nullable', 'integer', 'between:1,5'],
            'psychometric_profile.logic_session' => ['nullable', 'array'],
            'psychometric_profile.response_times' => ['nullable', 'array'],
            'psychometric_profile.response_times.*' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'criterion_order.*.exists' => 'Kriteria yang dipilih tidak tersedia di sistem.',
            'pairwise_matrix.*.*.gt' => 'Nilai matriks AHP harus lebih besar dari nol.',
            'behavioral_profile.*.between' => 'Skor profil perilaku harus berada di rentang 0 sampai 100.',
            'mode.in' => 'Mode assessment hanya boleh primary atau scenario.',
        ];
    }
}
