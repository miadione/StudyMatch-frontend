import { ref, onMounted, onUnmounted } from 'vue'

interface SwipeCallbacks {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

export function useSwipe(callbacks: SwipeCallbacks = {}) {
  const isDragging = ref(false)
  const dragOffset = ref({ x: 0, y: 0 })
  const startPos = ref({ x: 0, y: 0 })

  const SWIPE_THRESHOLD = 100
  const ANIMATION_DURATION = 300

  // Touch Events
  function handleTouchStart(e: TouchEvent): void {
    if (!e.touches[0]) return
    isDragging.value = true
    startPos.value = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  function handleTouchMove(e: TouchEvent): void {
    if (!isDragging.value || !e.touches[0]) return
    dragOffset.value = {
      x: e.touches[0].clientX - startPos.value.x,
      y: 0
    }
  }

  function handleTouchEnd(): void {
    if (!isDragging.value) return
    evaluateSwipe()
  }

  // Mouse Events
  function handleMouseDown(e: MouseEvent): void {
    isDragging.value = true
    startPos.value = { x: e.clientX, y: e.clientY }
  }

  function handleMouseMove(e: MouseEvent): void {
    if (!isDragging.value) return
    dragOffset.value = {
      x: e.clientX - startPos.value.x,
      y: 0
    }
  }

  function handleMouseUp(): void {
    if (!isDragging.value) return
    evaluateSwipe()
  }

  // Swipe auswerten
  function evaluateSwipe(): void {
    if (Math.abs(dragOffset.value.x) > SWIPE_THRESHOLD) {
      const direction = dragOffset.value.x > 0 ? 'right' : 'left'
      animateOut(direction)
    } else {
      resetPosition()
    }
  }

  function animateOut(direction: 'left' | 'right'): void {
    const multiplier = direction === 'right' ? 1 : -1
    dragOffset.value = { x: multiplier * 500, y: 0 }

    setTimeout(() => {
      if (direction === 'right') {
        callbacks.onSwipeRight?.()
      } else {
        callbacks.onSwipeLeft?.()
      }
      resetPosition()
    }, ANIMATION_DURATION)
  }

  function resetPosition(): void {
    dragOffset.value = { x: 0, y: 0 }
    isDragging.value = false
  }

  // Programmatische Swipes
  function swipeLeft(): void {
    animateOut('left')
  }

  function swipeRight(): void {
    animateOut('right')
  }

  // Card Style berechnen
  function getCardStyle(index: number, currentIndex: number): Record<string, string | number> {
    const position = index - currentIndex

    if (position < 0 || position > 2) {
      return {
        display: 'none',
        zIndex: 0,
        transform: 'none',
        opacity: 0
      }
    }

    const isTopCard = position === 0
    const baseTransform = `translateX(-50%) translateY(-${position * 20}px) scale(${1 - position * 0.1})`

    if (isTopCard && isDragging.value) {
      const rotation = dragOffset.value.x * 0.15
      return {
        zIndex: 10,
        transform: `translateX(-50%) translateX(${dragOffset.value.x}px) rotate(${rotation}deg)`,
        transition: 'none',
        display: 'flex',
        opacity: 1
      }
    }

    return {
      zIndex: 3 - position,
      transform: baseTransform,
      opacity: 1,
      transition: 'all 0.3s ease',
      display: 'flex'
    }
  }

  // Global Mouse Events registrieren
  onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })

  return {
    isDragging,
    dragOffset,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    swipeLeft,
    swipeRight,
    getCardStyle
  }
}
