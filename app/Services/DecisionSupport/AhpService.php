<?php

namespace App\Services\DecisionSupport;

use InvalidArgumentException;

class AhpService
{
    private const RANDOM_INDEX = [
        1 => 0.00,
        2 => 0.00,
        3 => 0.58,
        4 => 0.90,
        5 => 1.12,
        6 => 1.24,
        7 => 1.32,
        8 => 1.41,
        9 => 1.45,
        10 => 1.49,
    ];

    public function calculate(array $matrix): array
    {
        $size = count($matrix);

        if ($size < 2) {
            throw new InvalidArgumentException('Matriks AHP minimal berukuran 2x2.');
        }

        foreach ($matrix as $rowIndex => $row) {
            if (! is_array($row) || count($row) !== $size) {
                throw new InvalidArgumentException('Matriks AHP harus berbentuk persegi.');
            }

            foreach ($row as $columnIndex => $value) {
                if (! is_numeric($value) || (float) $value <= 0) {
                    throw new InvalidArgumentException('Nilai matriks AHP harus berupa angka positif.');
                }

                $numericValue = (float) $value;

                if ($rowIndex === $columnIndex && abs($numericValue - 1.0) > 0.0001) {
                    throw new InvalidArgumentException('Diagonal matriks AHP harus bernilai 1.');
                }

                $inverse = (float) $matrix[$columnIndex][$rowIndex];

                if (abs($numericValue - (1 / $inverse)) > 0.001) {
                    throw new InvalidArgumentException('Matriks AHP harus resiprokal antar pasangan kriteria.');
                }
            }
        }

        $geometricMeans = array_map(
            fn (array $row): float => pow(array_product(array_map('floatval', $row)), 1 / $size),
            $matrix,
        );

        $weightSum = array_sum($geometricMeans);
        $weights = array_map(
            fn (float $value): float => $value / $weightSum,
            $geometricMeans,
        );

        $weightedSums = [];

        foreach ($matrix as $row) {
            $weightedSums[] = array_sum(array_map(
                fn ($cell, $index): float => (float) $cell * $weights[$index],
                $row,
                array_keys($weights),
            ));
        }

        $consistencyVector = array_map(
            fn (float $weightedSum, int $index): float => $weightedSum / $weights[$index],
            $weightedSums,
            array_keys($weightedSums),
        );

        $lambdaMax = array_sum($consistencyVector) / $size;
        $consistencyIndex = ($lambdaMax - $size) / ($size - 1);
        $randomIndex = self::RANDOM_INDEX[$size] ?? 1.49;
        $consistencyRatio = $randomIndex > 0
            ? $consistencyIndex / $randomIndex
            : 0.0;

        return [
            'weights' => $weights,
            'lambda_max' => round($lambdaMax, 6),
            'consistency_index' => round($consistencyIndex, 6),
            'consistency_ratio' => round($consistencyRatio, 6),
            'is_consistent' => $consistencyRatio <= 0.1,
        ];
    }
}
