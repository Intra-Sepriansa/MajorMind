import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    FlaskConical,
    GitCompareArrows,
    LayoutGrid,
    Menu,
    Sparkles,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { UserMenuContent } from '@/components/user-menu-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { assessment, home } from '@/routes';
import type { Auth, BreadcrumbItem, NavItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Assessment',
        href: assessment(),
        icon: Sparkles,
    },
    {
        title: 'Scenario Lab',
        href: '/scenario-lab',
        icon: FlaskConical,
    },
    {
        title: 'Comparison',
        href: '/comparison',
        icon: GitCompareArrows,
    },
    {
        title: 'Insights',
        href: '/insights',
        icon: BarChart3,
    },
];

function HeaderNavLink({
    item,
    isActive,
    mobile = false,
}: {
    item: NavItem;
    isActive: boolean;
    mobile?: boolean;
}) {
    return (
        <Link
            href={item.href}
            className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
                mobile
                    ? 'w-full justify-start border-white/10 bg-white/[0.03] text-slate-200 hover:border-white/20 hover:bg-white/[0.06]'
                    : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white',
                isActive &&
                    (mobile
                        ? 'border-[#ff2d20]/35 bg-[#ff2d20]/12 text-white'
                        : 'border-[#ff2d20]/35 bg-[#ff2d20]/12 text-white'),
            )}
        >
            {item.icon ? <item.icon className="h-4 w-4" /> : null}
            {item.title}
        </Link>
    );
}

export function AppHeader({ breadcrumbs = [] }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const getInitials = useInitials();
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <>
            <header className="sticky top-0 z-40 border-b border-white/8 bg-[#070a10]/92 backdrop-blur-xl">
                <div className="flex h-[4.5rem] w-full items-center gap-4 px-4 lg:px-6">
                    <div className="flex items-center gap-3">
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-full border border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.08]"
                                    >
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="w-80 border-white/10 bg-[#0b0e14] text-white"
                                >
                                    <SheetHeader className="border-b border-white/8 pb-5 text-left">
                                        <SheetTitle className="text-white">
                                            MajorMind Navigation
                                        </SheetTitle>
                                    </SheetHeader>

                                    <div className="mt-6 space-y-3">
                                        {navItems.map((item) => (
                                            <HeaderNavLink
                                                key={item.title}
                                                item={item}
                                                mobile
                                                isActive={isCurrentOrParentUrl(
                                                    item.href,
                                                )}
                                            />
                                        ))}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        <Link href="/dashboard" prefetch className="shrink-0">
                            <AppLogo />
                        </Link>
                    </div>

                    <div className="hidden flex-1 items-center justify-center lg:flex">
                        <nav className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.025] p-1.5">
                            {navItems.map((item) => (
                                <HeaderNavLink
                                    key={item.title}
                                    item={item}
                                    isActive={isCurrentOrParentUrl(item.href)}
                                />
                            ))}
                        </nav>
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        <Link
                            href={home()}
                            className="hidden h-10 items-center rounded-full border border-white/10 px-4 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white sm:inline-flex"
                        >
                            Landing
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-11 rounded-full border border-white/10 bg-white/[0.03] px-1.5 hover:bg-white/[0.08]"
                                >
                                    <div className="flex items-center gap-3 px-1">
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            <AvatarImage
                                                src={auth.user.avatar}
                                                alt={auth.user.name}
                                            />
                                            <AvatarFallback className="bg-[#ff2d20] text-black">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="hidden text-left sm:block">
                                            <div className="max-w-36 truncate text-sm font-medium text-white">
                                                {auth.user.name}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                Decision workspace
                                            </div>
                                        </div>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56 border-white/10 bg-[#0f131c] text-white"
                                align="end"
                            >
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {breadcrumbs.length > 0 ? (
                <div className="border-b border-white/8 bg-[#0b0e14]">
                    <div className="flex h-12 w-full items-center px-4 text-sm text-slate-400 lg:px-6">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            ) : null}
        </>
    );
}
