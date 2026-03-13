import { supabase } from './supabase';

// ── Level Definitions ──
export const LEVELS = [
    { level: 1, title: 'Rookie', xpRequired: 0, color: '#6B7280' },
    { level: 2, title: 'Explorer', xpRequired: 100, color: '#10B981' },
    { level: 3, title: 'Achiever', xpRequired: 300, color: '#3B82F6' },
    { level: 4, title: 'Warrior', xpRequired: 600, color: '#F59E0B' },
    { level: 5, title: 'Master', xpRequired: 1000, color: '#EF4444' },
    { level: 6, title: 'Legend', xpRequired: 1500, color: '#8B5CF6' },
];

// ── Badge Definitions ──
export const BADGES = [
    { id: 'first_step', emoji: '🌱', label: 'First Step', description: 'Complete your first habit', color: '#86EFAC' },
    { id: 'challenger', emoji: '💪', label: 'Challenger', description: 'Join your first challenge', color: '#93C5FD' },
    { id: 'on_fire', emoji: '🔥', label: 'On Fire', description: '7-day streak', color: '#FDBA74' },
    { id: 'half_century', emoji: '⭐', label: 'Half Century', description: '50 tasks completed', color: '#FDE047' },
    { id: 'century', emoji: '🏆', label: 'Century', description: '100 tasks completed', color: '#FCD34D' },
    { id: 'social', emoji: '🤝', label: 'Social', description: '5 friends added', color: '#5EEAD4' },
    { id: 'unstoppable', emoji: '⚡', label: 'Unstoppable', description: '30-day streak', color: '#FCA5A5' },
    { id: 'legend', emoji: '👑', label: 'Legend', description: 'Reach level 6', color: '#C4B5FD' },
];

// ── XP Constants ──
const XP_PER_HABIT = 10;
const XP_PER_CHALLENGE = 15;

// ── Calculate XP ──
export function calculateXP(habitLogs: number, challengeLogs: number): number {
    return (habitLogs * XP_PER_HABIT) + (challengeLogs * XP_PER_CHALLENGE);
}

// ── Get Level from XP ──
export function getLevelFromXP(xp: number) {
    let current = LEVELS[0];
    for (const level of LEVELS) {
        if (xp >= level.xpRequired) {
            current = level;
        } else {
            break;
        }
    }

    const currentIndex = LEVELS.indexOf(current);
    const nextLevel = LEVELS[currentIndex + 1] || null;

    const xpInCurrentLevel = xp - current.xpRequired;
    const xpForNextLevel = nextLevel ? nextLevel.xpRequired - current.xpRequired : 0;
    const progress = nextLevel ? xpInCurrentLevel / xpForNextLevel : 1;

    return {
        ...current,
        xp,
        xpInCurrentLevel,
        xpForNextLevel,
        progress: Math.min(progress, 1),
        nextLevel,
    };
}

// ── Calculate Streak ──
export async function calculateStreak(userId: string): Promise<number> {
    const today = new Date();
    let streak = 0;

    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];

        const { count: habitCount } = await supabase
            .from('habit_logs')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('completed_at', `${dateStr}T00:00:00`)
            .lte('completed_at', `${dateStr}T23:59:59`);

        const { count: challengeCount } = await supabase
            .from('challenge_logs')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('completed_at', `${dateStr}T00:00:00`)
            .lte('completed_at', `${dateStr}T23:59:59`);

        const totalToday = (habitCount || 0) + (challengeCount || 0);

        if (totalToday > 0) {
            streak++;
        } else if (i > 0) {
            // Day 0 (today) can be 0 without breaking streak
            break;
        }
    }

    return streak;
}

// ── Get Badge Progress ──
export type BadgeProgress = {
    id: string;
    unlocked: boolean;
    current: number;
    target: number;
    progress: number; // 0-1
};

export async function getBadgeProgress(userId: string): Promise<BadgeProgress[]> {
    // Counts
    const { count: habitLogs } = await supabase
        .from('habit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    const { count: challengeLogs } = await supabase
        .from('challenge_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    const { count: challengeParticipations } = await supabase
        .from('challenge_participants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    const { count: friendships } = await supabase
        .from('friendships')
        .select('*', { count: 'exact', head: true })
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .eq('status', 'accepted');

    const totalLogs = (habitLogs || 0) + (challengeLogs || 0);
    const xp = calculateXP(habitLogs || 0, challengeLogs || 0);
    const level = getLevelFromXP(xp);
    const streak = await calculateStreak(userId);

    const makeBadge = (id: string, current: number, target: number): BadgeProgress => ({
        id,
        unlocked: current >= target,
        current: Math.min(current, target),
        target,
        progress: Math.min(current / target, 1),
    });

    return [
        makeBadge('first_step', habitLogs || 0, 1),
        makeBadge('challenger', challengeParticipations || 0, 1),
        makeBadge('on_fire', streak, 7),
        makeBadge('half_century', totalLogs, 50),
        makeBadge('century', totalLogs, 100),
        makeBadge('social', friendships || 0, 5),
        makeBadge('unstoppable', streak, 30),
        makeBadge('legend', level.level, 6),
    ];
}
