<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use Kreait\Firebase\Exception\Auth\FailedToVerifyToken;
use Kreait\Firebase\Factory;

class FirebaseAuthController
{
    /**
     * Handle Firebase authentication callback (Google Sign-In).
     *
     * Flow: Frontend gets Firebase ID token via popup → sends here → we verify & login.
     */
    public function callback(Request $request): JsonResponse
    {
        $request->validate([
            'id_token' => ['required', 'string'],
        ]);

        try {
            $firebaseAuth = $this->getFirebaseAuth();
            $verifiedToken = $firebaseAuth->verifyIdToken($request->input('id_token'));
        } catch (FailedToVerifyToken $e) {
            return response()->json([
                'message' => 'Token verifikasi gagal. Silakan coba lagi.',
            ], 401);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan pada server.',
            ], 500);
        }

        $claims = $verifiedToken->claims();
        $firebaseUid = $claims->get('sub');
        $email = $claims->get('email', '');
        $name = $claims->get('name', '');
        $avatar = $claims->get('picture', '');

        if (empty($firebaseUid) || empty($email)) {
            return response()->json([
                'message' => 'Data akun Google tidak lengkap.',
            ], 422);
        }

        // Find or create user
        $user = User::query()->where('firebase_uid', $firebaseUid)->first()
            ?? User::query()->where('email', $email)->first();

        if ($user) {
            // Link existing user to Firebase if not already linked
            if (! $user->firebase_uid) {
                $user->update([
                    'firebase_uid' => $firebaseUid,
                    'avatar_url' => $avatar ?: $user->avatar_url,
                    'auth_provider' => 'google',
                ]);
            }
        } else {
            // Create new user
            $user = User::create([
                'name' => $name ?: 'User',
                'email' => $email,
                'firebase_uid' => $firebaseUid,
                'avatar_url' => $avatar,
                'auth_provider' => 'google',
                'password' => Str::random(32), // Random password for Google-only users
            ]);
        }

        Auth::login($user, true);

        return response()->json([
            'message' => 'Berhasil masuk dengan Google.',
            'redirect' => route('dashboard'),
        ]);
    }

    private function getFirebaseAuth(): FirebaseAuth
    {
        $credentialsPath = base_path('storage/firebase-credentials.json');

        $factory = (new Factory)->withServiceAccount($credentialsPath);

        return $factory->createAuth();
    }
}
