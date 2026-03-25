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

export default function Register() {
    return (
        <AuthLayout
            title="Buat akun untuk workspace keputusan Anda"
            description="Daftarkan akun untuk menyimpan assessment, menjalankan simulasi skenario, dan membandingkan hasil rekomendasi secara terstruktur."
        >
            <Head title="Daftar" />
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
                                    NIM
                                </Label>
                                <Input
                                    id="nim"
                                    type="text"
                                    required
                                    tabIndex={2}
                                    autoComplete="username"
                                    name="nim"
                                    placeholder="Nomor induk mahasiswa"
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
                            <TextLink href={login()} tabIndex={7} className="text-[#ffb4ae] hover:text-white">
                                Masuk
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
