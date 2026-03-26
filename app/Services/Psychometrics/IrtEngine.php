<?php

namespace App\Services\Psychometrics;

class IrtEngine
{
    /**
     * Calculate Theta (Ability) using Maximum Likelihood Estimation via Grid Search.
     * This avoids the non-convergence issues of Newton-Raphson for small item banks.
     * 
     * @param array $responses Array of arrays, each containing:
     *                         ['is_correct' => bool|int, 'a_param' => float, 'b_param' => float, 'c_param' => float]
     * @return float The estimated theta (logit score), usually between -4.0 and 4.0
     */
    public static function estimateTheta(array $responses): float
    {
        if (empty($responses)) {
            return 0.0; // Default to mean if no responses
        }

        $minTheta = -4.0;
        $maxTheta = 4.0;
        $step = 0.01;
        $bestTheta = 0.0;
        $maxLikelihood = -INF;

        // Protective handling for extreme scores: MLE tends towards infinity for 0% or 100% correct.
        $totalCorrect = array_reduce($responses, fn($carry, $r) => $carry + ($r['is_correct'] ? 1 : 0), 0);
        if ($totalCorrect === 0) return $minTheta;
        if ($totalCorrect === count($responses)) return $maxTheta;

        for ($theta = $minTheta; $theta <= $maxTheta; $theta += $step) {
            $logLikelihood = 0.0;

            foreach ($responses as $response) {
                $a = (float) $response['a_param'];
                $b = (float) $response['b_param'];
                $c = (float) $response['c_param'];
                $u = $response['is_correct'] ? 1 : 0;

                // 3PL IRT Formula. Clamping the exponent to avoid math overflow.
                $exponent = min(max(-$a * ($theta - $b), -20), 20);
                $expVal = exp($exponent);
                $p = $c + (1 - $c) * (1 / (1 + $expVal));

                // Clamp probability to avoid taking log(0)
                $p = max(min($p, 0.9999), 0.0001);

                if ($u === 1) {
                    $logLikelihood += log($p);
                } else {
                    $logLikelihood += log(1 - $p);
                }
            }

            if ($logLikelihood > $maxLikelihood) {
                $maxLikelihood = $logLikelihood;
                $bestTheta = $theta;
            }
        }

        return round($bestTheta, 4);
    }
}
