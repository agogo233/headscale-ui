import en from './en';

type Key = keyof typeof en;

const zh: Record<Key, string> = {
	// Navigation
	'nav.users': '用户视图',
	'nav.devices': '设备视图',
	'nav.groups': '群组视图',
	'nav.settings': '设置',

	// Common - identifiers and labels
	'common.id': 'ID',
	'common.search': '搜索',
	'common.name': '名称',
	'common.tag': '标签',
	'common.never': '永不',
	'common.neverSeen': '从未见过',
	'common.neverExpires': '永不过期',
	'common.online': '在线',
	'common.active': '活跃',
	'common.expired': '已过期',
	'common.unused': '未使用',
	'common.used': '已使用',
	'common.reusable': '可重用',
	'common.ephemeral': '临时',
	'common.pending': '待处理',
	'common.subnet': '子网',
	'common.cancel': '取消',
	'common.done': '完成',
	'common.copy': '复制',
	'common.copied': '已复制',
	'common.working': '处理中...',
	'common.add': '+ 添加',
	'common.addTag': '+ 标签',
	'common.delete': '删除',
	'common.refresh': '刷新',
	'common.confirm': '确认',
	'common.orCancel': '或取消 ',
	'common.deletingConfirm': '正在删除 {name}。确认 ',
	'common.lastSeen': '最近在线',

	// Common - time units
	'common.seconds': '秒',
	'common.minute': '分钟',
	'common.minutes': '分钟',
	'common.hour': '小时',
	'common.hours': '小时',
	'common.day': '天',
	'common.days': '天',

	// Common - status
	'common.unknown': '未知',
	'common.healthy': '健康',
	'common.unreachable': '无法访问',
	'common.device': '设备',

	// Common - validation
	'common.invalidName': '只能使用小写字母、句点或连字符',
	'common.tagEmpty': '标签不能为空',
	'common.tagSpaces': '标签不能包含空格',
	'common.tagEmptyOrSpaces': '标签不能为空或包含空格',
	'common.addAnotherTagFirst': '请先添加其他标签 - 已标记节点不能没有标签',
	'common.copyUnavailable': '无法复制 - 请手动选择并复制密钥',
	'common.copyFailed': '复制失败 - 请手动选择并复制密钥',

	// Common - API errors
	'common.requestFailed': '请求失败',
	'common.unexpectedResponse': '收到服务器意外响应',

	// Common - API test failure
	'common.apiFailedTitle': 'API 测试未成功。',
	'common.apiFailedDetail': 'Headscale 可能已停止运行或需要设置 API',
	'common.apiFailedHint': '请在',
	'common.settingsPage': '设置',
	'common.apiFailedHintEnd': '页面更改服务器设置',

	// Users
	'users.view': '用户视图',
	'users.newUser': '+ 新用户',
	'users.hideNewUser': '- 隐藏新用户',
	'users.email': '邮箱',
	'users.creationDate': '用户创建时间',
	'users.preauthKeys': '预授权密钥',
	'users.hideExpiredUsed': '隐藏已过期/已使用的密钥',
	'users.expiry': '过期时间：',
	'users.reusable': '可重用：',
	'users.ephemeral': '临时：',
	'users.tags': '标签：',
	'users.copyKeyNow': '请立即复制此密钥 — 它不会再次显示。',
	'users.createPreauthKey': '创建预授权密钥',
	'users.sortUserName': '用户名',
	'users.sortCreationDate': '创建时间',

	// Devices
	'devices.view': '设备视图',
	'devices.server': '服务器：{status}',
	'devices.newDevice': '+ 新设备',
	'devices.hideNewDevice': '- 隐藏新设备',
	'devices.provideValidKey': '请提供有效的密钥',
	'devices.sortDeviceName': '设备名称',
	'devices.sortLastSeen': '最近在线',

	// Devices - create tabs
	'devices.tabDefault': '默认配置',
	'devices.tabPreauth': '使用预授权密钥',
	'devices.tabOidc': '使用 OIDC',

	'devices.tabDefaultIntro1': '安装 Tailscale，将客户端指向你的域名（参见',
	'devices.tabDefaultLink1': 'headscale 客户端文档',
	'devices.tabDefaultIntro2': '）。使用托盘图标登录，浏览器会提示你输入密钥。',
	'devices.copyKeyBelow': '复制以下密钥：',
	'devices.deviceKey': '设备密钥',
	'devices.selectUser': '选择用户',

	'devices.tabPreauthP1a': '预授权密钥提供使用预注册密钥安装 tailscale 的能力（参见',
	'devices.tabPreauthP1b': ' 标志中的',
	'devices.tabPreauthLink1': 'tailscale 命令行文档',
	'devices.tabPreauthP1c': '）',
	'devices.tabPreauthP2a': '预授权密钥特别适用于将 headscale 部署为始终在线的 VPN（参见',
	'devices.tabPreauthP2b': ' 安装选项中的',
	'devices.tabPreauthLink2': 'tailscale 文档',
	'devices.tabPreauthP2c': '）或路由器级别的 VPN。',
	'devices.tabPreauthManageA': '预授权密钥可在',
	'devices.tabPreauthLink3': '用户部分',
	'devices.tabPreauthManageB': ' 进行管理',

	'devices.tabOidcP1a': 'OIDC 提供注册外部身份提供商（如',
	'devices.tabOidcLink1': 'keycloak',
	'devices.tabOidcP1b': '）以认证 headscale 设备的能力。',
	'devices.tabOidcP2a': '配置 Headscale 以注册身份提供商（参见',
	'devices.tabOidcLink2': 'headscale 配置文档',
	'devices.tabOidcP2b': '）。配置完成后，成功认证的设备将自动注册。',

	// Devices - card fields
	'devices.lastSeen': '设备最近在线',
	'devices.lastSeenAgo': '最近在线：{n} {unit} 前',
	'devices.regUnknown': '未知',
	'devices.regAuthKey': '授权密钥',
	'devices.regOidc': 'OIDC',
	'devices.regCli': 'CLI',
	'devices.ipAddresses': 'IP 地址',
	'devices.assignedUser': '分配用户',
	'devices.expiry': '过期时间',
	'devices.registerMethod': '注册方式',
	'devices.deviceRoutes': '设备路由',
	'devices.clickToEnable': '点击启用路由',
	'devices.taggedNodeInfo': '已标记节点 — 由标签管理，无法分配用户',
	'devices.ipv4Placeholder': 'IPv4 地址',
	'devices.mayNeedReconnect': '设备可能需要重新连接',
	'devices.ipConfirm': '该地址当前已分配给 {device}。保存后将交换两个设备的地址，且两个设备都需要重新连接。继续？',
	'devices.neverExpireTitle': '永不过期',
	'devices.neverExpireConfirm': '设置 {name} 永不过期？确认 ',

	// Devices - pending auth requests
	'devices.pendingRequests': '待处理登录请求',
	'devices.pendingCount': '（{count}）',
	'devices.loadingRequests': '正在加载待处理请求...',
	'devices.loadFailed': '无法加载待处理登录请求。',
	'devices.noRequests': '没有待处理的登录请求。',
	'devices.unknownHost': '未知主机',
	'devices.authUser': '用户：{name}',
	'devices.authRoutes': '路由：{routes}',
	'devices.approve': '批准',
	'devices.reject': '拒绝',

	// Settings - API keys
	'settings.apiKeys': 'API 密钥',
	'settings.deleteConfirm': '删除此 API 密钥？此操作无法撤销。',
	'settings.loading': '加载中...',
	'settings.noKeys': '未找到 API 密钥。',
	'settings.prefix': '前缀',
	'settings.created': '创建时间',
	'settings.expires': '过期时间',
	'settings.expire': '过期',

	// Settings - server
	'settings.serverSettings': '服务器设置',
	'settings.headscaleUrl': 'Headscale URL',
	'settings.urlHint': '你的 headscale 服务器实例 URL',
	'settings.headscaleApiKey': 'Headscale API 密钥',
	'settings.apiKeyHint': '为你的 headscale 实例生成一个 API 密钥并放置在此处。',
	'settings.saveApiKey': '保存 API 密钥',
	'settings.editApiKey': '编辑 API 密钥',
	'settings.clearSettings': '清除服务器设置',
	'settings.testSettings': '测试服务器设置',
	'settings.rolloverApiKey': '轮换 API 密钥',

	// Settings - theme
	'settings.themeSettings': '主题设置',

	// Settings - key expiry
	'settings.keyExpiryWarning': 'API 密钥将在 {days} 天后过期，建议轮换密钥',
	'settings.keyExpiryTip': '剩余 {days} 天过期',

	// Settings - dev flags
	'settings.developerFlags': '开发者选项',
	'settings.devFlagsTip': '用于启用开发功能。仅在你确实是开发者或喜欢混乱时才勾选此项',
	'settings.aclPages': 'ACL 页面',

	// Settings - version
	'settings.version': '版本',
	'settings.uiVersion': 'UI：',
	'settings.serverVersion': 'Headscale 服务器：',

	// Settings - language
	'settings.language': '语言',
	'settings.languageEnglish': 'English',
	'settings.languageChinese': '中文',

	// Groups / ACL
	'groups.title': 'ACL 策略',
	'groups.loading': '正在加载策略...',
	'groups.policyPlaceholder': '以 HuJSON 格式输入 ACL 策略...',
	'groups.saving': '正在保存...',
	'groups.savePolicy': '保存策略',
	'groups.validate': '验证',
	'groups.reload': '重新加载',
	'groups.syntaxValid': '策略语法正确',
	'groups.validationFailed': '策略验证失败：{error}',
	'groups.updatedSuccessfully': '策略更新成功'
};

export default zh;
