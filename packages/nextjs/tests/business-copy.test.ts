import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildChronicleActivityWarning,
  buildStandardProgressLabel,
  buildStandardProof,
  buildVoidPioneerProgressLabel,
  buildVoidPioneerProof,
  getInsufficientEvidenceLabel,
} from '../src/app/chronicle/config/businessCopy.ts'

test('buildStandardProgressLabel localizes Chronicle progress labels', () => {
  assert.equal(
    buildStandardProgressLabel({
      slug: 'galactic-courier',
      current: 6,
      target: 10,
      locale: 'en',
    }),
    '6 / 10 verified gate jumps'
  )
  assert.equal(
    buildStandardProgressLabel({
      slug: 'galactic-courier',
      current: 6,
      target: 10,
      locale: 'zh-CN',
    }),
    '6 / 10 次已验证星门跃迁'
  )
  assert.equal(
    buildStandardProgressLabel({
      slug: 'galactic-courier',
      current: 6,
      target: 10,
      locale: 'is',
    }),
    '6 / 10 staðfest stjörnuhliðarstökk'
  )
})

test('buildStandardProof localizes indexed proof copy', () => {
  assert.equal(
    buildStandardProof({
      slug: 'bloodlust-butcher',
      current: 7,
      locale: 'en',
    }),
    'Eve Eyes indexed 7 confirmed killmail attacker call(s).'
  )
  assert.equal(
    buildStandardProof({
      slug: 'bloodlust-butcher',
      current: 7,
      locale: 'zh-CN',
    }),
    'Eve Eyes 已索引 7 次已确认的击杀记录攻击者事件。'
  )
  assert.equal(
    buildStandardProof({
      slug: 'bloodlust-butcher',
      current: 7,
      locale: 'is',
    }),
    'Eve Eyes skráði 7 staðfesta árásaratburði úr killmail.'
  )
})

test('warnings and insufficient evidence copy stay localized', () => {
  assert.equal(
    getInsufficientEvidenceLabel('en'),
    'The system has not indexed enough frontier evidence yet.'
  )
  assert.equal(
    getInsufficientEvidenceLabel('zh-CN'),
    '系统还没有抓到足够的 Frontier 行为证据。'
  )
  assert.equal(
    getInsufficientEvidenceLabel('is'),
    'Kerfið hefur ekki enn skráð næg Frontier sönnunargögn.'
  )

  assert.equal(
    buildChronicleActivityWarning({
      scanMode: 'preview',
      locale: 'en',
    }),
    'Eve Eyes preview mode only scans the first few pages. Set EVE_EYES_API_KEY for deeper history.'
  )
  assert.equal(
    buildChronicleActivityWarning({
      scanMode: 'preview',
      locale: 'zh-CN',
    }),
    'Eve Eyes 预览模式只会扫描前几页。配置 EVE_EYES_API_KEY 后才能获取更深历史。'
  )
  assert.equal(
    buildChronicleActivityWarning({
      scanMode: 'preview',
      locale: 'is',
    }),
    'Eve Eyes preview mode skannar aðeins fyrstu síðurnar. Stilltu EVE_EYES_API_KEY fyrir dýpri sögu.'
  )
})

test('Void Pioneer progress and proof switch between node and storage branches', () => {
  assert.equal(
    buildVoidPioneerProgressLabel({
      networkNodeAnchors: 1,
      storageUnitAnchors: 2,
      locale: 'en',
    }),
    '1/1 network node or 2/3 storage units'
  )
  assert.equal(
    buildVoidPioneerProgressLabel({
      networkNodeAnchors: 1,
      storageUnitAnchors: 2,
      locale: 'zh-CN',
    }),
    '1/1 个网络节点，或 2/3 个储存单元'
  )
  assert.equal(
    buildVoidPioneerProgressLabel({
      networkNodeAnchors: 1,
      storageUnitAnchors: 2,
      locale: 'is',
    }),
    '1/1 nethnútur eða 2/3 geymslueiningar'
  )

  assert.equal(
    buildVoidPioneerProof({
      networkNodeAnchors: 1,
      storageUnitAnchors: 0,
      locale: 'en',
    }),
    'Eve Eyes indexed 1 successful network_node::anchor call(s).'
  )
  assert.equal(
    buildVoidPioneerProof({
      networkNodeAnchors: 1,
      storageUnitAnchors: 0,
      locale: 'zh-CN',
    }),
    'Eve Eyes 已索引 1 次成功的网络节点锚定事件。'
  )
  assert.equal(
    buildVoidPioneerProof({
      networkNodeAnchors: 1,
      storageUnitAnchors: 0,
      locale: 'is',
    }),
    'Eve Eyes skráði 1 heppna nethnútsfestingu.'
  )

  assert.equal(
    buildVoidPioneerProof({
      networkNodeAnchors: 0,
      storageUnitAnchors: 3,
      locale: 'en',
    }),
    'Eve Eyes indexed 3 successful storage_unit::anchor call(s).'
  )
  assert.equal(
    buildVoidPioneerProof({
      networkNodeAnchors: 0,
      storageUnitAnchors: 3,
      locale: 'zh-CN',
    }),
    'Eve Eyes 已索引 3 次成功的储存单元锚定事件。'
  )
  assert.equal(
    buildVoidPioneerProof({
      networkNodeAnchors: 0,
      storageUnitAnchors: 3,
      locale: 'is',
    }),
    'Eve Eyes skráði 3 heppnar geymslueiningafestingar.'
  )
})
