import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { ShieldCheck, ShieldAlert, KeyRound, Lock, Fingerprint } from 'lucide-react';
import { useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/security';
import { disable, enable } from '@/routes/two-factor';
import type { BreadcrumbItem } from '@/types';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Security Settings',
        href: edit(),
    },
];

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Security Settings" />

            <SettingsLayout>
                <div className="space-y-10">
                    {/* Update Password Section */}
                    <section className="relative overflow-hidden rounded-[32px] border border-white/[0.06] bg-[#060910]/80 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
                        <div className="pointer-events-none absolute top-0 left-1/2 h-full w-full -translate-x-1/2 bg-gradient-to-b from-white/[0.03] to-transparent" />
                        
                        <div className="mb-8 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-500">
                                <KeyRound className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Update Password</h2>
                                <p className="text-sm text-slate-400">Ensure your account is using a long, random password to stay secure.</p>
                            </div>
                        </div>

                        <Form
                            {...SecurityController.update.form()}
                            options={{ preserveScroll: true }}
                            resetOnError={['password', 'password_confirmation', 'current_password']}
                            resetOnSuccess
                            onError={(errors) => {
                                if (errors.password) passwordInput.current?.focus();
                                if (errors.current_password) currentPasswordInput.current?.focus();
                            }}
                            className="space-y-8"
                        >
                            {({ errors, processing, recentlySuccessful }) => (
                                <>
                                    <div className="grid gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="current_password" className="text-slate-300">Current Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute top-[30%] left-3 h-4 w-4 text-slate-500 z-10" />
                                                <PasswordInput
                                                    id="current_password"
                                                    ref={currentPasswordInput}
                                                    name="current_password"
                                                    className="w-full border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20"
                                                    autoComplete="current-password"
                                                    placeholder="Enter your current password"
                                                />
                                            </div>
                                            <InputError message={errors.current_password} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-slate-300">New Password</Label>
                                            <div className="relative">
                                                <Fingerprint className="absolute top-[30%] left-3 h-4 w-4 text-slate-500 z-10" />
                                                <PasswordInput
                                                    id="password"
                                                    ref={passwordInput}
                                                    name="password"
                                                    className="w-full border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20"
                                                    autoComplete="new-password"
                                                    placeholder="Enter a strong new password"
                                                />
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation" className="text-slate-300">Confirm Password</Label>
                                            <div className="relative">
                                                <ShieldCheck className="absolute top-[30%] left-3 h-4 w-4 text-slate-500 z-10" />
                                                <PasswordInput
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    className="w-full border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20"
                                                    autoComplete="new-password"
                                                    placeholder="Confirm your new password"
                                                />
                                            </div>
                                            <InputError message={errors.password_confirmation} />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                        <Button
                                            disabled={processing}
                                            className="relative overflow-hidden bg-white text-black hover:bg-zinc-200"
                                        >
                                            Save Password
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-out duration-300"
                                            enterFrom="opacity-0 translate-y-1"
                                            enterTo="opacity-100 translate-y-0"
                                            leave="transition ease-in duration-200"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="flex items-center gap-2 text-sm font-medium text-[#22c55e]">
                                                <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
                                                Password updated
                                            </p>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Form>
                    </section>

                    {/* Two Factor Authentication Section */}
                    {canManageTwoFactor && (
                        <section className="relative overflow-hidden rounded-[32px] border border-white/[0.06] bg-[#060910]/80 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
                            {/* Ambient glow indicating secure area */}
                            <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-500/5 blur-[100px]" />
                            
                            <div className="mb-8 flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                                    <ShieldAlert className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Two-Factor Authentication</h2>
                                    <p className="text-sm text-slate-400">Add additional security to your account using TOTP.</p>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                                {twoFactorEnabled ? (
                                    <div className="flex flex-col items-start gap-6">
                                        <div className="flex items-center gap-3 rounded-lg bg-emerald-500/10 px-4 py-2 text-emerald-400 border border-emerald-500/20">
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                                            </span>
                                            <span className="text-sm font-medium">Authentication Enabled</span>
                                        </div>

                                        <p className="text-sm leading-relaxed text-slate-300">
                                            You are currently protected by a secure, random pin generated from the authenticator app on your phone.
                                            Keep your recovery codes somewhere safe.
                                        </p>

                                        <div className="w-full h-px bg-white/10" />

                                        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                            <TwoFactorRecoveryCodes
                                                recoveryCodesList={recoveryCodesList}
                                                fetchRecoveryCodes={fetchRecoveryCodes}
                                                errors={errors}
                                            />
                                            
                                            <div className="mt-4 lg:mt-0 lg:ml-auto">
                                                <Form {...disable.form()}>
                                                    {({ processing }) => (
                                                        <Button
                                                            variant="destructive"
                                                            type="submit"
                                                            disabled={processing}
                                                            className="w-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 lg:w-auto"
                                                        >
                                                            Disable 2FA
                                                        </Button>
                                                    )}
                                                </Form>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-start gap-6">
                                        <p className="text-sm leading-relaxed text-slate-300">
                                            When you enable two-factor authentication, you will be prompted for a secure pin during login. 
                                            This pin can be retrieved from a Google Authenticator or similar TOTP-supported application.
                                        </p>

                                        <div>
                                            {hasSetupData ? (
                                                <Button
                                                    onClick={() => setShowSetupModal(true)}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                                                >
                                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                                    Continue Setup
                                                </Button>
                                            ) : (
                                                <Form
                                                    {...enable.form()}
                                                    onSuccess={() => setShowSetupModal(true)}
                                                >
                                                    {({ processing }) => (
                                                        <Button
                                                            type="submit"
                                                            disabled={processing}
                                                            className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                                                        >
                                                            <Lock className="mr-2 h-4 w-4" />
                                                            Enable 2FA
                                                        </Button>
                                                    )}
                                                </Form>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <TwoFactorSetupModal
                                isOpen={showSetupModal}
                                onClose={() => setShowSetupModal(false)}
                                requiresConfirmation={requiresConfirmation}
                                twoFactorEnabled={twoFactorEnabled}
                                qrCodeSvg={qrCodeSvg}
                                manualSetupKey={manualSetupKey}
                                clearSetupData={clearSetupData}
                                fetchSetupData={fetchSetupData}
                                errors={errors}
                            />
                        </section>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
