export const MEDAL_CATALOG = [
  {
    kind: 1,
    slug: 'bloodlust-butcher',
    title: '嗜血屠夫',
    subtitle: 'Bloodlust Butcher',
    rarity: 'Legendary',
    requirement: '在 killmail 索引中累计 5 次 attacker 记录。',
    teaser: '让每一次击毁都留下可验证的血色坐标。',
    tone: 'crimson',
  },
  {
    kind: 2,
    slug: 'void-pioneer',
    title: '深空拓荒者',
    subtitle: 'Void Pioneer',
    rarity: 'Epic',
    requirement: '锚定 1 个 network node，或累计锚定 3 个 storage unit。',
    teaser: '你不是路过边境的人，你是把边境钉在星图上的人。',
    tone: 'azure',
  },
  {
    kind: 3,
    slug: 'galactic-courier',
    title: '星际物流商',
    subtitle: 'Galactic Courier',
    rarity: 'Rare',
    requirement: '完成 10 次 gate::jump 跃迁。',
    teaser: '真正让文明运转的，从来不是炮火，而是持续抵达的货舱。',
    tone: 'teal',
  },
  {
    kind: 4,
    slug: 'turret-sentry',
    title: '炮塔哨卫',
    subtitle: 'Turret Sentry',
    rarity: 'Uncommon',
    requirement: '部署或操作 turret 达 3 次。',
    teaser: '每一门炮塔都是主权的宣言——你告诉宇宙，这片空间有人守着。',
    tone: 'amber',
  },
  {
    kind: 5,
    slug: 'assembly-pioneer',
    title: '装配先驱',
    subtitle: 'Assembly Pioneer',
    rarity: 'Uncommon',
    requirement: '与 Smart Assembly 交互达 3 次。',
    teaser: '你搭起来的每一个装配体，都是 Frontier 基础设施版图上的新坐标。',
    tone: 'steel',
  },
  {
    kind: 6,
    slug: 'turret-anchor',
    title: '炮台筑防者',
    subtitle: 'Turret Anchor',
    rarity: 'Rare',
    requirement: '永久部署（锚定）炮台达 3 次。',
    teaser: '每一门永久钉入星图的炮台，都是你主权意志的宣言。',
    tone: 'amber',
  },
  {
    kind: 7,
    slug: 'ssu-trader',
    title: '星际贸易商',
    subtitle: 'SSU Trader',
    rarity: 'Uncommon',
    requirement: '通过智能存储单元完成 5 次货物存取操作。',
    teaser: '供应链不会无中生有——是你的货舱让 Frontier 的经济持续运转。',
    tone: 'teal',
  },
  {
    kind: 8,
    slug: 'fuel-feeder',
    title: '节点燃料官',
    subtitle: 'Fuel Feeder',
    rarity: 'Uncommon',
    requirement: '向网络节点投喂燃料达 5 次。',
    teaser: '基地的灯不会自己亮。每一次投喂，都是对整个网络的承诺。',
    tone: 'steel',
  },
] as const

export type MedalDefinition = (typeof MEDAL_CATALOG)[number]
export type MedalKind = MedalDefinition['kind']
export type MedalSlug = MedalDefinition['slug']
export type MedalTone = MedalDefinition['tone']

export const getMedalDefinitionByKind = (kind: number) =>
  MEDAL_CATALOG.find((definition) => definition.kind === kind)

export const getMedalDefinitionBySlug = (slug: string) =>
  MEDAL_CATALOG.find((definition) => definition.slug === slug)
