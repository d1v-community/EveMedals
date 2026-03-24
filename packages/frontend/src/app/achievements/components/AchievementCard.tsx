import { Card, Button } from '@radix-ui/themes'
import type { Achievement } from '../AchievementsDashboard'

export default function AchievementCard({ achievement }: { achievement: Achievement }) {
  const { name, description, rarity, unlocked, progress, target, icon } = achievement

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-md border text-2xl ${unlocked ? 'border-emerald-400' : 'border-slate-300 opacity-75 grayscale'}`}>
          <span aria-hidden>{icon}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {name} {unlocked ? '✨' : ''}
            </h3>
            <span className="text-xs text-slate-500">{rarity}</span>
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>

          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded bg-slate-200 dark:bg-slate-800">
              <div
                className={`h-full bg-gradient-to-r ${unlocked ? 'from-emerald-400 to-emerald-500' : 'from-sds-blue to-sds-pink'}`}
                style={{ width: `${Math.min(100, Math.round((progress / Math.max(1, target)) * 100))}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-slate-500">
              进度：{Math.min(progress, target)} / {target}
            </div>
          </div>

          <div className="mt-3">
            <Button size="2" disabled={!unlocked} title={!unlocked ? '达成条件后可领取' : undefined}>
              {unlocked ? 'Claim（铸造 SBT）' : '未解锁'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
