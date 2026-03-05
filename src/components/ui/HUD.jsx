import styles from './HUD.module.css'
import useStore from '../../hooks/useStore'
import WhisperText from './WhisperText'

export default function HUD() {
  const entranceTime = useStore((s) => s.entranceTime)
  const activePanel = useStore((s) => s.activePanel)
  const memoryPanelOpen = activePanel?.type === 'memory'
  const uiProgress = Math.min(1, Math.max(0, (entranceTime - 2.5) / 0.5))

  return (
    <>
      <WhisperText />
    </>
  )
}
