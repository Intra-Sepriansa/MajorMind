<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Criterion;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class CriterionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Criterion::query()
                ->active()
                ->orderBy('display_order')
                ->get(),
        ]);
    }
}
