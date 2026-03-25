<?php

namespace App\Services\ScenarioLab;

class MonteCarloSimulator
{
    private const SIMULATION_ITERATIONS = 5000;
    
    public function simulateOutcomes(
        array $userProfile,
        array $majorRecommendations,
        array $uncertaintyFactors
    ): array {
        $simulations = [];
        
        foreach ($majorRecommendations as $major) {
            $outcomes = $this->runSimulations(
                $userProfile,
                $major,
                $uncertaintyFactors
            );
            
            $simulations[$major['major']['id'] ?? $major['major_id']] = [
                'major_name' => $major['major']['name'],
                'success_probability_distribution' => $this->calculateDistribution($outcomes['success']),
                'gpa_distribution' => $this->calculateDistribution($outcomes['gpa']),
                'completion_time_distribution' => $this->calculateDistribution($outcomes['completion_time']),
                'dropout_probability' => round((count(array_filter($outcomes['success'], fn($s) => $s < 50)) / self::SIMULATION_ITERATIONS) * 100, 2),
                'expected_value' => array_sum($outcomes['success']) / self::SIMULATION_ITERATIONS
            ];
        }
        
        return $simulations;
    }
    
    private function runSimulations(
        array $userProfile,
        array $major,
        array $uncertaintyFactors
    ): array {
        $outcomes = [
            'success' => [],
            'gpa' => [],
            'completion_time' => [],
        ];

        // Base values mock derived from final_score
        $baseSuccess = ($major['final_score'] ?? 0.5) * 100;
        $baseGpa = 2.5 + (($major['behavioral_score'] ?? 0.5) * 1.5); // Range 2.5 to 4.0
        $baseCompletion = 4.0 + (1 - ($major['topsis_score'] ?? 0.5)) * 1.5; // Range 4.0 to 5.5
        
        for ($i = 0; $i < self::SIMULATION_ITERATIONS; $i++) {
            // Apply gaussian variance to emulate real life uncertanties.
            
            // Academic readiness variance limits gpa variance
            $academicVariance = $uncertaintyFactors['academics'] ?? 0.5;
            $gpaVar = $this->gaussianRandom(0, $academicVariance * 0.2); 
            $gpa = max(1.0, min(4.0, $baseGpa + $gpaVar));

            // Life circumstances noise
            $lifeVariance = $uncertaintyFactors['life_circumstances'] ?? 10.0;
            $succVar = $this->gaussianRandom(0, $lifeVariance);
            $success = max(0, min(100, $baseSuccess + $succVar));

            // Time noise
            $timeVariance = $uncertaintyFactors['time'] ?? 0.5;
            $timeVar = $this->gaussianRandom(0, $timeVariance);
            $completion = max(3.5, min(7.0, $baseCompletion + $timeVar));

            $outcomes['success'][] = round($success, 2);
            $outcomes['gpa'][] = round($gpa, 2);
            $outcomes['completion_time'][] = round($completion, 2);
        }
        
        return $outcomes;
    }
    
    private function gaussianRandom(float $mean, float $stdDev): float
    {
        // Box-Muller transform
        $u1 = mt_rand() / mt_getrandmax();
        $u2 = mt_rand() / mt_getrandmax();
        
        $u1 = max(0.0001, $u1);
        
        $z0 = sqrt(-2 * log($u1)) * cos(2 * pi() * $u2);
        
        return $mean + $stdDev * $z0;
    }
    
    private function calculateDistribution(array $values): array
    {
        sort($values);
        $count = count($values);
        
        $mean = array_sum($values) / $count;
        $stdDev = $this->calculateStdDev($values, $mean);

        return [
            'mean' => round($mean, 2),
            'median' => round($values[intval($count / 2)], 2),
            'std_dev' => round($stdDev, 2),
            'percentile_10' => round($values[intval($count * 0.10)], 2),
            'percentile_25' => round($values[intval($count * 0.25)], 2),
            'percentile_75' => round($values[intval($count * 0.75)], 2),
            'percentile_90' => round($values[intval($count * 0.90)], 2),
            'min' => round(min($values), 2),
            'max' => round(max($values), 2)
        ];
    }

    private function calculateStdDev(array $values, float $mean): float
    {
        $sumSq = 0;
        foreach ($values as $val) {
            $sumSq += pow($val - $mean, 2);
        }
        return sqrt($sumSq / count($values));
    }
}
