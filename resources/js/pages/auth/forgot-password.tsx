// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Pulihkan akses ke workspace Anda"
            description="Masukkan email akun Anda untuk menerima tautan reset kata sandi dan kembali ke dashboard keputusan."
        >
            <Head title="Lupa kata sandi" />

            {status && (
                <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-slate-200">
                                    Alamat email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="email@example.com"
                                    className="h-12 rounded-2xl border-white/10 bg-[#05070b]/90 text-white placeholder:text-slate-500"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="my-6 flex items-center justify-start">
                                <Button
                                    className="h-12 w-full rounded-2xl bg-[#ff2d20] text-black hover:bg-[#ff5549]"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}
                                    Kirim tautan reset kata sandi
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-center text-sm text-slate-400">
                    Kembali ke{' '}
                    <TextLink href={login()} className="text-[#ffb4ae] hover:text-white">
                        masuk
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
