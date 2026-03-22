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
    { id: 'on_fire', emoji: '🔥', label: 'On Fire', description: '7-day perfect streak', color: '#FDBA74' },
    { id: 'half_century', emoji: '⭐', label: 'Half Century', description: '50 tasks completed', color: '#FDE047' },
    { id: 'century', emoji: '🏆', label: 'Century', description: '100 tasks completed', color: '#FCD34D' },
    { id: 'social', emoji: '🤝', label: 'Social', description: '5 friends added', color: '#5EEAD4' },
    { id: 'unstoppable', emoji: '⚡', label: 'Unstoppable', description: '30-day perfect streak', color: '#FCA5A5' },
    { id: 'legend', emoji: '👑', label: 'Legend', description: 'Reach level 6', color: '#C4B5FD' },
];

// ── XP Constants ──
const XP_PER_HABIT = 10;
const XP_PER_CHALLENGE = 15;

// ── Calculate XP ──
export function calculateXP(habitLogs: number, challengeLogs: number): number {
    // Computes total XP from habit/challenge completion logs.
    return (habitLogs * XP_PER_HABIT) + (challengeLogs * XP_PER_CHALLENGE);
}

// ── Get Level from XP ──
export function getLevelFromXP(xp: number) {
    // Resolves current level, next level, and progress ratio.
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

// ── Calculate Streak (Perfect Day Streak) ──
export async function calculateStreak(userId: string): Promise<number> {
    // Calculates consecutive perfect days based on planned vs completed tasks.
    const today = new Date();
    const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    const yearStart = new Date(today);
    yearStart.setDate(today.getDate() - 365);
    const yearStartStr = yearStart.toISOString().split('T')[0];

    type HabitRow = {
        id: string;
        days: string[];
        start_date: string;
        end_date: string | null;
    };

    type ChallengeRow = {
        id: string;
        month: number;
        year: number;
        days: string[];
    };

    const { data: habitsData } = await supabase
        .from('habits')
        .select('id, days, start_date, end_date')
        .eq('user_id', userId);

    const { data: joinedRows } = await supabase
        .from('challenge_participants')
        .select('challenge_id')
        .eq('user_id', userId);

    const challengeIds = (joinedRows || []).map((r: any) => r.challenge_id);
    let challengesData: ChallengeRow[] = [];
    if (challengeIds.length > 0) {
        const { data } = await supabase
            .from('challenges')
            .select('id, month, year, days')
            .in('id', challengeIds);
        challengesData = (data || []) as ChallengeRow[];
    }

    const { data: habitLogs } = await supabase
        .from('habit_logs')
        .select('habit_id, completed_at')
        .eq('user_id', userId)
        .gte('completed_at', `${yearStartStr}T00:00:00`);

    const { data: challengeLogs } = await supabase
        .from('challenge_logs')
        .select('challenge_id, completed_at')
        .eq('user_id', userId)
        .gte('completed_at', `${yearStartStr}T00:00:00`);

    const habitLogsByDate = new Map<string, Set<string>>();
    for (const log of habitLogs || []) {
        const dateKey = new Date(log.completed_at).toISOString().split('T')[0];
        const set = habitLogsByDate.get(dateKey) || new Set<string>();
        set.add(log.habit_id);
        habitLogsByDate.set(dateKey, set);
    }

    const challengeLogsByDate = new Map<string, Set<string>>();
    for (const log of challengeLogs || []) {
        const dateKey = new Date(log.completed_at).toISOString().split('T')[0];
        const set = challengeLogsByDate.get(dateKey) || new Set<string>();
        set.add(log.challenge_id);
        challengeLogsByDate.set(dateKey, set);
    }

    const habits = (habitsData || []) as HabitRow[];
    let streak = 0;

    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        const dayKey = dayKeys[checkDate.getDay()];
        const month = checkDate.getMonth() + 1;
        const year = checkDate.getFullYear();

        const plannedHabits = habits.filter((h) => {
            if (!h.days.includes(dayKey)) return false;
            if (h.start_date && new Date(h.start_date) > checkDate) return false;
            if (h.end_date && new Date(h.end_date) < checkDate) return false;
            return true;
        });

        const plannedChallenges = challengesData.filter((c) => {
            if (c.month !== month || c.year !== year) return false;
            if (!c.days.includes(dayKey)) return false;
            return true;
        });

        const plannedHabitIds = plannedHabits.map((h) => h.id);
        const plannedChallengeIds = plannedChallenges.map((c) => c.id);
        const plannedTotal = plannedHabitIds.length + plannedChallengeIds.length;

        // No scheduled tasks on this day should not break the streak.
        if (plannedTotal === 0) {
            continue;
        }

        const doneHabitIds = habitLogsByDate.get(dateStr) || new Set<string>();
        const doneChallengeIds = challengeLogsByDate.get(dateStr) || new Set<string>();

        const allHabitsDone = plannedHabitIds.every((id) => doneHabitIds.has(id));
        const allChallengesDone = plannedChallengeIds.every((id) => doneChallengeIds.has(id));
        const isPerfectDay = allHabitsDone && allChallengesDone;

        if (isPerfectDay) {
            streak++;
        } else if (i > 0) {
            // Day 0 (today) can be incomplete without breaking streak.
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
    // Fetches counters used by badge progress rules.
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
