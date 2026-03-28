import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { User, CreditCard, Mail, Edit3, ShieldAlert } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile Settings',
        href: edit(),
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile Settings" />

            <SettingsLayout>
                <div className="space-y-10">
                    {/* Section 1: Profile Information */}
                    <section className="relative overflow-hidden rounded-[32px] border border-white/[0.06] bg-[#060910]/80 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
                        {/* Subtle background glow */}
                        <div className="pointer-events-none absolute top-0 left-1/2 h-full w-full -translate-x-1/2 bg-gradient-to-b from-white/[0.03] to-transparent" />
                        
                        <div className="mb-8 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ff2d20]/20 bg-[#ff2d20]/10 text-[#ff2d20]">
                                <Edit3 className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                                <p className="text-sm text-slate-400">Update your account's display name, NIM, and email.</p>
                            </div>
                        </div>

                        <Form
                            {...ProfileController.update.form()}
                            options={{ preserveScroll: true }}
                            className="space-y-8"
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-slate-300">Name</Label>
                                            <div className="relative">
                                                <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                                <Input
                                                    id="name"
                                                    className="w-full border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-600 focus:border-[#ff2d20]/50 focus:ring-[#ff2d20]/20"
                                                    defaultValue={auth.user.name}
                                                    name="name"
                                                    required
                                                    autoComplete="name"
                                                    placeholder="Full name"
                                                />
                                            </div>
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nim" className="text-slate-300">NIM (Optional)</Label>
                                            <div className="relative">
                                                <CreditCard className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                                <Input
                                                    id="nim"
                                                    className="w-full border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-600 focus:border-[#ff2d20]/50 focus:ring-[#ff2d20]/20"
                                                    defaultValue={String(auth.user.nim ?? '')}
                                                    name="nim"
                                                    autoComplete="username"
                                                    placeholder="Nomor induk mahasiswa"
                                                />
                                            </div>
                                            <InputError message={errors.nim} />
                                        </div>

                                        <div className="space-y-2 sm:col-span-2">
                                            <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    className="w-full border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-600 focus:border-[#ff2d20]/50 focus:ring-[#ff2d20]/20"
                                                    defaultValue={auth.user.email}
                                                    name="email"
                                                    required
                                                    autoComplete="email"
                                                    placeholder="Email address"
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>
                                    </div>

                                    {mustVerifyEmail && auth.user.email_verified_at === null && (
                                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                                            <p className="text-sm text-amber-200">
                                                Your email address is unverified.{' '}
                                                <Link
                                                    href={send().url}
                                                    as="button"
                                                    className="font-semibold text-amber-500 underline decoration-amber-500/30 underline-offset-4 hover:decoration-amber-500"
                                                >
                                                    Click here to resend the verification email.
                                                </Link>
                                            </p>
                                            {status === 'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-emerald-400">
                                                    A new verification link has been sent to your email address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                        <Button
                                            disabled={processing}
                                            className="relative overflow-hidden bg-white text-black hover:bg-zinc-200"
                                        >
                                            Save Changes
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
                                                Saved successfully
                                            </p>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Form>
                    </section>

                    {/* Section 2: Delete Account */}
                    <section className="relative overflow-hidden rounded-[32px] border border-red-500/10 bg-red-950/10 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.05),transparent_70%)]" />
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Danger Zone</h2>
                                <p className="text-sm text-red-400">Permanently delete your account and all data.</p>
                            </div>
                        </div>
                        <DeleteUser />
                    </section>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
