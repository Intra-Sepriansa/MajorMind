<?php

namespace App\Services\Validation;

/**
 * Validates response quality by detecting bias patterns and suspicious behavior.
 */
class ResponseQualityValidator
{
    /**
     * Run all quality checks on the assessment data.
     *
     * @param  array<string, int>  $riasecResponses    48 RIASEC answers (1–5)
     * @param  array<string, int>  $gritResponses      12 Grit answers (1–5)
     * @param  array<string, float> $responseTimes     Optional: seconds per item
     */
    public function validate(
        array $riasecResponses,
        array $gritResponses,
        array $responseTimes = [],
    ): array {
        $allResponses = array_merge(array_values($riasecResponses), array_values($gritResponses));
        $flags = [];
        $warnings = [];

        // 1. Straight-lining detection
        $straightLineResult = $this->detectStraightLining($allResponses);
        if ($straightLineResult['detected']) {
            $flags[] = [
                'type' => 'straight_lining',
                'severity' => 'high',
                'message' => sprintf(
                    'Detected %.0f%% identical responses (%d). Consider reviewing.',
                    $straightLineResult['percentage'],
                    $straightLineResult['most_common_value'],
                ),
            ];
        }

        // 2. Central tendency bias
        $centralResult = $this->detectCentralTendency($allResponses);
        if ($centralResult['detected']) {
            $warnings[] = [
                'type' => 'central_tendency',
                'severity' => 'medium',
                'message' => sprintf(
                    '%.0f%% of responses are neutral (value 3). May indicate indecisive responding.',
                    $centralResult['percentage'],
                ),
            ];
        }

        // 3. Response time analysis
        if (! empty($responseTimes)) {
            $speedResult = $this->detectSpeedResponding($responseTimes);
            if ($speedResult['detected']) {
                $flags[] = [
                    'type' => 'speed_responding',
                    'severity' => 'high',
                    'message' => sprintf(
                        '%d items answered in under 2 seconds. May indicate careless responding.',
                        $speedResult['fast_count'],
                    ),
                ];
            }
        }

        // 4. Extreme responding
        $extremeResult = $this->detectExtremeResponding($allResponses);
        if ($extremeResult['detected']) {
            $warnings[] = [
                'type' => 'extreme_responding',
                'severity' => 'medium',
                'message' => sprintf(
                    '%.0f%% of responses are extreme values (1 or 5). May indicate acquiescence bias.',
                    $extremeResult['percentage'],
                ),
            ];
        }

        // Calculate quality score (0–100)
        $deductions = count($flags) * 15 + count($warnings) * 5;
        $qualityScore = max(0, 100 - $deductions);

        return [
            'quality_score' => $qualityScore,
            'flags' => $flags,
            'warnings' => $warnings,
            'checks_passed' => empty($flags),
            'total_items' => count($allResponses),
            'confidence_level' => $qualityScore >= 80 ? 'High' : ($qualityScore >= 50 ? 'Medium' : 'Low'),
        ];
    }

    private function detectStraightLining(array $responses): array
    {
        if (empty($responses)) {
            return ['detected' => false, 'percentage' => 0, 'most_common_value' => 0];
        }

        $counts = array_count_values($responses);
        $maxCount = max($counts);
        $mostCommon = array_search($maxCount, $counts);
        $percentage = ($maxCount / count($responses)) * 100;

        return [
            'detected' => $percentage > 80,
            'percentage' => $percentage,
            'most_common_value' => $mostCommon,
        ];
    }

    private function detectCentralTendency(array $responses): array
    {
        if (empty($responses)) {
            return ['detected' => false, 'percentage' => 0];
        }

        $neutralCount = count(array_filter($responses, fn ($r) => $r === 3));
        $percentage = ($neutralCount / count($responses)) * 100;

        return [
            'detected' => $percentage > 70,
            'percentage' => $percentage,
        ];
    }

    private function detectSpeedResponding(array $responseTimes): array
    {
        $fastCount = count(array_filter($responseTimes, fn ($t) => $t < 2.0));
        $percentage = count($responseTimes) > 0
            ? ($fastCount / count($responseTimes)) * 100
            : 0;

        return [
            'detected' => $percentage > 30,
            'fast_count' => $fastCount,
            'percentage' => $percentage,
        ];
    }

    private function detectExtremeResponding(array $responses): array
    {
        if (empty($responses)) {
            return ['detected' => false, 'percentage' => 0];
        }

        $extremeCount = count(array_filter($responses, fn ($r) => $r === 1 || $r === 5));
        $percentage = ($extremeCount / count($responses)) * 100;

        return [
            'detected' => $percentage > 80,
            'percentage' => $percentage,
        ];
    }
}
