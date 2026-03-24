import EnvironmentRequirements from './components/EnvironmentRequirements'
import NetworkSupportChecker from './components/NetworkSupportChecker'
import AchievementsDashboard from './achievements/AchievementsDashboard'

export default function Home() {
  return (
    <>
      <EnvironmentRequirements />
      <NetworkSupportChecker />
      <div className="justify-content flex flex-grow flex-col items-center justify-center rounded-md p-3 w-full">
        <AchievementsDashboard />
      </div>
    </>
  )
}
