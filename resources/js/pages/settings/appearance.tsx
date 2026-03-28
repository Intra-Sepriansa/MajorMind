import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun, Palette } from 'lucide-react';
import type { Appearance as AppearanceType } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
import type { BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance Settings',
        href: editAppearance(),
    },
];

export default function Appearance() {
    const { appearance, updateAppearance } = useAppearance();

    const themes: { value: AppearanceType; icon: LucideIcon; label: string; description: string; colors: string[] }[] = [
        { 
            value: 'light', 
            icon: Sun, 
            label: 'Light Mode', 
            description: 'A bright, clean interface.',
            colors: ['#ffffff', '#f4f4f5', '#e4e4e7']
        },
        { 
            value: 'dark', 
            icon: Moon, 
            label: 'Dark Mode', 
            description: 'Premium dark glassmorphism.',
            colors: ['#060910', '#18181b', '#27272a']
        },
        { 
            value: 'system', 
            icon: Monitor, 
            label: 'System Sync', 
            description: 'Follows your OS setting automatically.',
            colors: ['#060910', '#ffffff', '#a1a1aa']
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance Settings" />

            <SettingsLayout>
                <div className="space-y-10">
                    <section className="relative overflow-hidden rounded-[32px] border border-white/[0.06] bg-[#060910]/80 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
                        <div className="pointer-events-none absolute top-0 left-1/2 h-full w-full -translate-x-1/2 bg-gradient-to-b from-white/[0.03] to-transparent" />
                        
                        <div className="mb-8 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-500">
                                <Palette className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Appearance Settings</h2>
                                <p className="text-sm text-slate-400">Update your account's display theme.</p>
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {themes.map(({ value, icon: Icon, label, description, colors }) => {
                                const isActive = appearance === value;
                                
                                return (
                                    <button
                                        key={value}
                                        onClick={() => updateAppearance(value)}
                                        className={cn(
                                            'group relative flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-300 hover:scale-[1.02]',
                                            isActive
                                                ? 'border-purple-500/50 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.15)]'
                                                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                                        )}
                                    >
                                        {/* Mockup Preview Area */}
                                        <div className="relative h-32 w-full overflow-hidden border-b border-white/5 bg-black/40 p-4 shrink-0 flex items-center justify-center">
                                            {/* Abstract layered mockup */}
                                            <div className="relative h-20 w-32 rounded-lg border border-white/10 shadow-lg flex flex-col overflow-hidden" style={{ backgroundColor: colors[0] }}>
                                                <div className="h-4 w-full border-b border-white/10" style={{ backgroundColor: colors[1] }} />
                                                <div className="p-2 space-y-2 flex-1 relative overflow-hidden">
                                                    <div className="h-2 w-3/4 rounded-full opacity-50" style={{ backgroundColor: colors[2] }} />
                                                    <div className="h-2 w-1/2 rounded-full opacity-50" style={{ backgroundColor: colors[2] }} />
                                                    {/* Glow indicating selection over the mockup */}
                                                    {isActive && (
                                                        <div className="absolute inset-0 bg-purple-500/10" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex flex-1 flex-col justify-between p-5">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Icon className={cn("h-4 w-4", isActive ? "text-purple-400" : "text-slate-400")} />
                                                    <span className={cn("font-medium", isActive ? "text-purple-50" : "text-slate-200")}>
                                                        {label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500">
                                                    {description}
                                                </p>
                                            </div>

                                            {/* Active Indicator Radio */}
                                            <div className="mt-4 flex items-center gap-2 text-sm">
                                                <div className={cn(
                                                    'flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-300',
                                                    isActive ? 'border-purple-500 bg-purple-500' : 'border-slate-600 bg-transparent group-hover:border-slate-400'
                                                )}>
                                                    {isActive && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                                </div>
                                                <span className={isActive ? 'text-purple-400' : 'text-slate-500'}>
                                                    {isActive ? 'Active' : 'Select'}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
