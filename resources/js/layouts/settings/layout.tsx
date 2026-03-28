import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { UserCircle, Shield, Paintbrush, ChevronRight } from 'lucide-react';
import Heading from '@/components/heading';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';

const sidebarNavItems = [
    {
        title: 'Profile Information',
        description: 'Personal details and credentials',
        href: edit(),
        icon: UserCircle,
        color: '#ff2d20',
    },
    {
        title: 'Security',
        description: 'Passwords and authentication',
        href: editSecurity(),
        icon: Shield,
        color: '#3b82f6',
    },
    {
        title: 'Appearance',
        description: 'Theme and display settings',
        href: editAppearance(),
        icon: Paintbrush,
        color: '#a855f7',
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="relative min-h-[calc(100vh-[4.5rem])] overflow-hidden bg-[#060910]">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-[-10%] left-[-15%] h-[500px] w-[500px] rounded-full bg-[#ff2d20]/10 blur-[100px]" />
                <div className="absolute top-[20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[80px]" />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '32px 32px',
                    }}
                />
            </div>

            <div className="relative mx-auto w-full px-4 py-8 lg:px-6 xl:py-12">
                <div className="mb-10 lg:mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
                        Account Settings
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Manage your profile, security preferences, and display settings.
                    </p>
                </div>

                <div className="flex flex-col gap-8 lg:flex-row lg:gap-12 xl:gap-16">
                    {/* Sidebar Navigation */}
                    <aside className="w-full shrink-0 lg:w-72 xl:w-80">
                        <nav className="flex flex-col gap-3" aria-label="Settings">
                            {sidebarNavItems.map((item, index) => {
                                const isActive = isCurrentOrParentUrl(item.href);
                                return (
                                    <Link
                                        key={`${toUrl(item.href)}-${index}`}
                                        href={item.href}
                                        className={cn(
                                            'group relative flex items-center justify-between overflow-hidden rounded-2xl border p-4 transition-all duration-300',
                                            isActive
                                                ? 'border-white/10 bg-white/[0.04] shadow-lg'
                                                : 'border-transparent bg-transparent hover:bg-white/[0.02]'
                                        )}
                                    >
                                        {/* Active glow background */}
                                        {isActive && (
                                            <div
                                                className="absolute inset-0 opacity-10"
                                                style={{
                                                    background: `linear-gradient(135deg, ${item.color}, transparent)`,
                                                }}
                                            />
                                        )}

                                        <div className="relative z-10 flex items-center gap-4">
                                            <div
                                                className={cn(
                                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300',
                                                    isActive
                                                        ? 'bg-opacity-20 border-opacity-30'
                                                        : 'border-transparent bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-slate-300'
                                                )}
                                                style={isActive ? {
                                                    backgroundColor: `${item.color}20`,
                                                    borderColor: `${item.color}40`,
                                                    color: item.color,
                                                } : {}}
                                            >
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className={cn('text-sm font-semibold transition-colors', isActive ? 'text-white' : 'text-slate-300')}>
                                                    {item.title}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {item.description}
                                                </div>
                                            </div>
                                        </div>

                                        <ChevronRight
                                            className={cn(
                                                'relative z-10 h-4 w-4 shrink-0 transition-all duration-300',
                                                isActive
                                                    ? 'translate-x-0 opacity-100 text-slate-400'
                                                    : '-translate-x-2 opacity-0 text-slate-600 group-hover:translate-x-0 group-hover:opacity-100'
                                            )}
                                        />
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1">
                        <div className="relative max-w-3xl">
                            {/* Accent line above content on mobile */}
                            <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent lg:hidden" />
                            
                            {/* Content wrapper with fade-in animation */}
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
