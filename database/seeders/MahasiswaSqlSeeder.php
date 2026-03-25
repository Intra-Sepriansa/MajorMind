<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class MahasiswaSqlSeeder extends Seeder
{
    /**
     * Seed mahasiswa credentials from the SQL dump into MajorMind users.
     */
    public function run(): void
    {
        $sqlPath = database_path('seeders/mahasiswa.sql');

        if (! is_file($sqlPath)) {
            throw new RuntimeException("SQL dump tidak ditemukan di {$sqlPath}");
        }

        $contents = file_get_contents($sqlPath);

        if ($contents === false) {
            throw new RuntimeException("Gagal membaca file {$sqlPath}");
        }

        if (! preg_match('/INSERT INTO `mahasiswa` .*? VALUES\s*(.+?);/s', $contents, $matches)) {
            throw new RuntimeException('Insert data tabel `mahasiswa` tidak ditemukan pada dump SQL.');
        }

        $rows = collect($this->parseValueRows($matches[1]))
            ->map(function (array $row): array {
                [$id, $name, $nim, $password, $rememberToken, $createdAt, $updatedAt] = $row;
                $nim = (string) $nim;

                return [
                    'name' => (string) $name,
                    'nim' => $nim,
                    'email' => sprintf('%s@student.majormind.local', $nim),
                    'email_verified_at' => null,
                    'password' => Hash::make($this->resolveDemoPassword($nim)),
                    'remember_token' => $rememberToken,
                    'created_at' => $createdAt,
                    'updated_at' => $updatedAt ?? $createdAt,
                ];
            })
            ->all();

        if ($rows === []) {
            return;
        }

        DB::table('users')->upsert(
            $rows,
            ['nim'],
            ['name', 'email', 'password', 'remember_token', 'updated_at']
        );
    }

    /**
     * Parse SQL tuples from an INSERT ... VALUES block.
     *
     * @return array<int, array<int, mixed>>
     */
    private function parseValueRows(string $valueBlock): array
    {
        $rows = [];
        $buffer = '';
        $depth = 0;
        $inString = false;
        $escapeNext = false;

        $length = strlen($valueBlock);

        for ($i = 0; $i < $length; $i++) {
            $char = $valueBlock[$i];

            if ($escapeNext) {
                $buffer .= $char;
                $escapeNext = false;
                continue;
            }

            if ($char === '\\') {
                $buffer .= $char;
                $escapeNext = true;
                continue;
            }

            if ($char === "'") {
                $buffer .= $char;
                $inString = ! $inString;
                continue;
            }

            if (! $inString && $char === '(') {
                $depth++;
            }

            if ($depth > 0) {
                $buffer .= $char;
            }

            if (! $inString && $char === ')') {
                $depth--;

                if ($depth === 0) {
                    $rows[] = $this->parseTuple($buffer);
                    $buffer = '';
                }
            }
        }

        return $rows;
    }

    /**
     * @return array<int, mixed>
     */
    private function parseTuple(string $tuple): array
    {
        $tuple = trim($tuple);
        $tuple = trim($tuple, '()');

        return array_map(function (?string $value): mixed {
            if ($value === null) {
                return null;
            }

            $trimmed = trim($value);

            if (strtoupper($trimmed) === 'NULL') {
                return null;
            }

            return str_replace("\\'", "'", $trimmed);
        }, str_getcsv($tuple, ',', "'", '\\'));
    }

    private function resolveDemoPassword(string $nim): string
    {
        return 'tplk004#'.substr($nim, -3);
    }
}
