<?php

namespace App\Services\Algorithms;

class SigmoidTransformer
{
    /**
     * Normalizes an infinite logit score (theta) into a bounded [0, 1] rational scalar.
     * S(theta) = 1 / (1 + e^-theta)
     * 
     * This transformation acts as the mathematical bridge allowing unbounded IRT metrics 
     * to safely interact inside a TOPSIS Cartesian Euclidean coordinate space without distorting order.
     *
     * @param float|null $theta The raw IRT capability logit from -inf to +inf
     * @return float The normalized benefit value strictly between 0 and 1
     */
    public static function transform(?float $theta): float
    {
        if ($theta === null) {
            return 0.5; // Default neutral ekuilibrium sentral if no test taken
        }

        // Clamp extreme values before exponentiation to prevent overflow/underflow
        $exponent = min(max(-$theta, -20), 20);
        $expVal = exp($exponent);
        
        return 1 / (1 + $expVal);
    }
}
