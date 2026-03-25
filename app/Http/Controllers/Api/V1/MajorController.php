<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Major;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class MajorController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Major::query()
                ->active()
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'description', 'criteria_scores', 'behavioral_profile']),
        ]);
    }
}
