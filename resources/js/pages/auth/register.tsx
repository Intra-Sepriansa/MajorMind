import { useState } from 'react';
import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { signInWithGoogle, authenticateWithBackend } from '@/lib/firebase';

export default function Register() {
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState<string | null>(null);

    const handleGoogleSignUp = async () => {
        setGoogleLoading(true);
        setGoogleError(null);
        try {
            const { idToken } = await signInWithGoogle();
            const { redirect } = await authenticateWithBackend(idToken);
            window.location.href = redirect;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Gagal daftar dengan Google.';
            if (message.includes('popup-closed')) {
                setGoogleLoading(false);
                return;
            }
            setGoogleError(message);
            setGoogleLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Buat akun untuk workspace keputusan Anda"
            description="Daftarkan akun untuk menyimpan assessment, menjalankan simulasi skenario, dan membandingkan hasil rekomendasi secara terstruktur."
        >
            <Head title="Daftar" />

            {/* Google Sign-Up — first option */}
            <div className="mb-6 flex flex-col gap-4">
                <Button
                    type="button"
                    onClick={() => void handleGoogleSignUp()}
                    disabled={googleLoading}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] text-white backdrop-blur-md transition-all hover:bg-white/[0.08]"
                    data-test="google-register-button"
                >
                    {googleLoading ? (
                        <Spinner />
                    ) : (
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.99 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                    )}
                    Daftar dengan Google
                </Button>

                {googleError && (
                    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                        {googleError}
                    </div>
                )}

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                    </div>
                    <span className="relative bg-[#0b0e14] px-4 text-xs text-slate-500">
                        atau daftar dengan email
                    </span>
                </div>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-slate-200">
                                    Nama
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nama lengkap"
                                    className="h-12 rounded-2xl border-white/10 bg-[#05070b]/90 text-white placeholder:text-slate-500"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nim" className="text-slate-200">
                                    NIM{' '}
                                    <span className="text-xs font-normal text-slate-500">(opsional)</span>
                                </Label>
                                <Input
                                    id="nim"
                                    type="text"
                                    tabIndex={2}
                                    autoComplete="username"
                                    name="nim"
                                    placeholder="Nomor induk mahasiswa (boleh kosong)"
                                    className="h-12 rounded-2xl border-white/10 bg-[#05070b]/90 text-white placeholder:text-slate-500"
                                />
                                <InputError message={errors.nim} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-slate-200">
                                    Alamat email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={3}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className="h-12 rounded-2xl border-white/10 bg-[#05070b]/90 text-white placeholder:text-slate-500"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-slate-200">
                                    Kata sandi
                                </Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Kata sandi"
                                    className="h-12 rounded-2xl border-white/10 bg-[#05070b]/90 text-white placeholder:text-slate-500"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-slate-200">
                                    Konfirmasi kata sandi
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Konfirmasi kata sandi"
                                    className="h-12 rounded-2xl border-white/10 bg-[#05070b]/90 text-white placeholder:text-slate-500"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-12 w-full rounded-2xl bg-[#ff2d20] text-black hover:bg-[#ff5549]"
                                tabIndex={6}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Buat akun
                            </Button>
                        </div>

                        <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-center text-sm text-slate-400">
                            Sudah punya akun?{' '}
                            <TextLink href={login().url} tabIndex={7} className="text-[#ffb4ae] hover:text-white">
                                Masuk
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
