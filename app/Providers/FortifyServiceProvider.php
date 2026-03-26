<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Models\User;
use App\Actions\Fortify\ResetUserPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::authenticateUsing(function (Request $request): ?User {
            $request->validate([
                'login' => ['required', 'string'],
                'password' => ['required', 'string'],
            ]);

            $login = $request->string('login')->toString();

            // Try NIM first, then email
            $user = User::query()->where('nim', $login)->first()
                ?? User::query()->where('email', $login)->first();

            if (! $user || ! Hash::check($request->string('password')->toString(), $user->password)) {
                return null;
            }

            return $user;
        });
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => $this->redirectAuthenticatedUser(
            $request,
            fn (): InertiaResponse => Inertia::render('auth/login', [
                'canResetPassword' => Features::enabled(Features::resetPasswords()),
                'canRegister' => Features::enabled(Features::registration()),
                'status' => $request->session()->get('status'),
            ]),
        ));

        Fortify::resetPasswordView(fn (Request $request) => $this->redirectAuthenticatedUser(
            $request,
            fn (): InertiaResponse => Inertia::render('auth/reset-password', [
                'email' => $request->email,
                'token' => $request->route('token'),
            ]),
        ));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => $this->redirectAuthenticatedUser(
            $request,
            fn (): InertiaResponse => Inertia::render('auth/forgot-password', [
                'status' => $request->session()->get('status'),
            ]),
        ));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn (Request $request) => $this->redirectAuthenticatedUser(
            $request,
            fn (): InertiaResponse => Inertia::render('auth/register'),
        ));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }

    private function redirectAuthenticatedUser(
        Request $request,
        callable $viewFactory,
    ): InertiaResponse|RedirectResponse {
        if ($request->user()) {
            return Redirect::route('dashboard');
        }

        return $viewFactory();
    }
}
