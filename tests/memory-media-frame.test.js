import test from 'node:test'
import assert from 'node:assert/strict'
import { memoryMediaFrame } from '../src/components/scene/memoryMediaFrame.js'

const near = (actual, expected, message) => {
  const tolerance = 1e-12 * Math.max(1, Math.abs(expected))
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} versus ${expected}`)
}

test('landscape, portrait and square media retain their original proportions', () => {
  for (const aspect of [16 / 9, 4 / 3, 1, 3 / 4, 9 / 16]) {
    const { halfWidth, halfHeight } = memoryMediaFrame(aspect)
    assert.ok(halfWidth > 0 && halfHeight > 0)
    near(halfWidth / halfHeight, aspect, `source aspect ${aspect}`)
    near(Math.hypot(halfWidth, halfHeight), 0.96, `corner radius ${aspect}`)
    for (const x of [-halfWidth, halfWidth]) {
      for (const y of [-halfHeight, halfHeight]) {
        assert.ok(Math.hypot(x, y) < 1, `source corner must remain inside the sphere for ${aspect}`)
      }
    }
  }
})

test('very wide and very tall sources remain finite and completely inside the inset', () => {
  for (const aspect of [1e-12, 1e-6, 1e6, 1e12, Number.MAX_VALUE]) {
    const { halfWidth, halfHeight } = memoryMediaFrame(aspect)
    assert.ok(Number.isFinite(halfWidth) && Number.isFinite(halfHeight))
    assert.ok(halfWidth > 0 && halfHeight > 0)
    near(Math.hypot(halfWidth, halfHeight), 0.96, `extreme-aspect corner radius ${aspect}`)
    assert.ok(halfWidth <= 0.96 + Number.EPSILON && halfHeight <= 0.96 + Number.EPSILON)
    // Cross multiplication also stays meaningful when width/height would overflow.
    near(halfWidth, halfHeight * aspect, `extreme source aspect ${aspect}`)
  }
})

test('changing the inset scales the whole frame without changing its aspect', () => {
  const aspect = 16 / 9
  const standard = memoryMediaFrame(aspect)
  for (const inset of [0.3, 0.65, 0.95]) {
    const frame = memoryMediaFrame(aspect, inset)
    near(Math.hypot(frame.halfWidth, frame.halfHeight), inset, `requested inset ${inset}`)
    near(frame.halfWidth / frame.halfHeight, aspect, `aspect at inset ${inset}`)
    near(frame.halfWidth / standard.halfWidth, inset / 0.96, `uniform horizontal scale ${inset}`)
    near(frame.halfHeight / standard.halfHeight, inset / 0.96, `uniform vertical scale ${inset}`)
  }
})

test('missing or invalid aspect ratios produce a safe square frame', () => {
  const expected = memoryMediaFrame(1)
  for (const aspect of [undefined, null, NaN, Infinity, -Infinity, 0, -1, '16/9']) {
    assert.deepEqual(memoryMediaFrame(aspect), expected, `safe fallback for ${String(aspect)}`)
  }
})

test('independently fitted poster and video frames do not inherit one another’s proportions', () => {
  const poster = memoryMediaFrame(1)
  const video = memoryMediaFrame(16 / 9)
  near(poster.halfWidth, poster.halfHeight, 'square poster')
  near(video.halfWidth / video.halfHeight, 16 / 9, 'landscape video')
  assert.ok(video.halfWidth > poster.halfWidth)
  assert.ok(video.halfHeight < poster.halfHeight)
  near(Math.hypot(poster.halfWidth, poster.halfHeight), Math.hypot(video.halfWidth, video.halfHeight), 'shared containment radius')
})
