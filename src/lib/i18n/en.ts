export default {
	// Navigation
	'nav.users': 'User View',
	'nav.devices': 'Device View',
	'nav.groups': 'Group View',
	'nav.settings': 'Settings',

	// Common - identifiers and labels
	'common.id': 'ID',
	'common.search': 'search',
	'common.name': 'name',
	'common.tag': 'tag',
	'common.never': 'Never',
	'common.neverSeen': 'Never seen',
	'common.neverExpires': 'never expires',
	'common.online': 'online',
	'common.active': 'Active',
	'common.expired': 'Expired',
	'common.unused': 'Unused',
	'common.used': 'Used',
	'common.reusable': 'Reusable',
	'common.ephemeral': 'Ephemeral',
	'common.pending': 'Pending',
	'common.subnet': 'Subnet',
	'common.cancel': 'Cancel',
	'common.done': 'Done',
	'common.copy': 'Copy',
	'common.copied': 'Copied',
	'common.working': 'Working...',
	'common.add': '+ Add',
	'common.addTag': '+ tag',
	'common.delete': 'Delete',
	'common.refresh': 'Refresh',
	'common.confirm': 'Confirm',
	'common.orCancel': 'or Cancel ',
	'common.deletingConfirm': 'Deleting {name}. Confirm ',
	'common.lastSeen': 'Last Seen',

	// Common - time units
	'common.seconds': 'seconds',
	'common.minute': 'minute',
	'common.minutes': 'minutes',
	'common.hour': 'hour',
	'common.hours': 'hours',
	'common.day': 'day',
	'common.days': 'days',

	// Common - status
	'common.unknown': 'unknown',
	'common.healthy': 'healthy',
	'common.unreachable': 'unreachable',
	'common.device': 'device',

	// Common - validation
	'common.invalidName': 'Use lower case letters, periods, or dashes only',
	'common.tagEmpty': 'Tag must not be empty',
	'common.tagSpaces': 'Tags must not contain spaces',
	'common.tagEmptyOrSpaces': 'Tag must not be empty or contain spaces',
	'common.addAnotherTagFirst': 'Add another tag first - a tagged node cannot have zero tags',
	'common.copyUnavailable': 'Copy is not available - select the key and copy it manually',
	'common.copyFailed': 'Copy failed - select the key and copy it manually',

	// Common - API errors
	'common.requestFailed': 'Request failed',
	'common.unexpectedResponse': 'Received an unexpected response from the server',

	// Common - API test failure
	'common.apiFailedTitle': 'API test did not succeed.',
	'common.apiFailedDetail': 'Headscale might be down or API settings may need to be set',
	'common.apiFailedHint': 'change server settings in the ',
	'common.settingsPage': 'settings',
	'common.apiFailedHintEnd': ' page',

	// Users
	'users.view': 'User View',
	'users.newUser': '+ New User',
	'users.hideNewUser': '- Hide New User',
	'users.email': 'Email',
	'users.creationDate': 'User Creation Date',
	'users.preauthKeys': 'Preauth Keys',
	'users.hideExpiredUsed': 'Hide Expired/Used Keys',
	'users.expiry': 'Expiry:',
	'users.reusable': 'Reusable:',
	'users.ephemeral': 'Ephemeral:',
	'users.tags': 'Tags:',
	'users.copyKeyNow': 'Copy this key now — it will not be shown again.',
	'users.createPreauthKey': 'Create Preauth Key',
	'users.sortUserName': 'User Name',
	'users.sortCreationDate': 'Creation Date',

	// Devices
	'devices.view': 'Device View',
	'devices.server': 'Server: {status}',
	'devices.newDevice': '+ New Device',
	'devices.hideNewDevice': '- Hide New Device',
	'devices.provideValidKey': 'provide a valid key',
	'devices.sortDeviceName': 'Device Name',
	'devices.sortLastSeen': 'Last Seen',

	// Devices - create tabs
	'devices.tabDefault': 'Default Configuration',
	'devices.tabPreauth': 'With Preauth Keys',
	'devices.tabOidc': 'With OIDC',

	'devices.tabDefaultIntro1': 'Install Tailscale with the client pointing to your domain (see ',
	'devices.tabDefaultLink1': 'headscale client documentation',
	'devices.tabDefaultIntro2': '). Log in using the tray icon, and your browser should give you instructions with a key.',
	'devices.copyKeyBelow': 'Copy the key below:',
	'devices.deviceKey': 'Device Key',
	'devices.selectUser': 'Select User',

	'devices.tabPreauthP1a': 'Preauth Keys provide the capability to install tailscale using a pre-registered key (see the ',
	'devices.tabPreauthP1b': ' flag in the ',
	'devices.tabPreauthLink1': 'tailscale command line documentation',
	'devices.tabPreauthP1c': ')',
	'devices.tabPreauthP2a': 'Preauth Keys are especially useful for deploying headscale as an always-on VPN (see the ',
	'devices.tabPreauthP2b': ' install option in the ',
	'devices.tabPreauthLink2': 'tailscale documentation',
	'devices.tabPreauthP2c': ') or router-level VPN.',
	'devices.tabPreauthManageA': 'Preauth Keys can be managed in the ',
	'devices.tabPreauthLink3': 'User Section',
	'devices.tabPreauthManageB': ' of the UI',

	'devices.tabOidcP1a': 'OIDC provides the ability to register an external authentication provider (such as ',
	'devices.tabOidcLink1': 'keycloak',
	'devices.tabOidcP1b': ') to authenticate devices to headscale.',
	'devices.tabOidcP2a': 'Configure Headscale to register with an authentication provider (see ',
	'devices.tabOidcLink2': 'headscale configuration documentation',
	'devices.tabOidcP2b': '). Once configured, successfully authenticated devices will automatically self-register',

	// Devices - card fields
	'devices.lastSeen': 'Device Last Seen',
	'devices.lastSeenAgo': 'Last seen {n} {unit} ago',
	'devices.regUnknown': 'Unknown',
	'devices.regAuthKey': 'Auth Key',
	'devices.regOidc': 'OIDC',
	'devices.regCli': 'CLI',
	'devices.ipAddresses': 'IP Addresses',
	'devices.assignedUser': 'Assigned User',
	'devices.expiry': 'Expiry',
	'devices.registerMethod': 'Register Method',
	'devices.deviceRoutes': 'Device Routes',
	'devices.clickToEnable': 'click to enable route',
	'devices.taggedNodeInfo': 'Tagged node — managed by tag, cannot be assigned a user',
	'devices.ipv4Placeholder': 'IPv4 address',
	'devices.mayNeedReconnect': 'the device may need to reconnect',
	'devices.ipConfirm': 'The address is currently assigned to {device}. Saving will swap the addresses of both devices and both will need to reconnect. Continue?',
	'devices.neverExpireTitle': 'Never Expire',
	'devices.neverExpireConfirm': 'Never expire {name}? Confirm ',

	// Devices - pending auth requests
	'devices.pendingRequests': 'Pending Login Requests',
	'devices.pendingCount': '({count})',
	'devices.loadingRequests': 'Loading pending requests...',
	'devices.loadFailed': 'Could not load pending login requests.',
	'devices.noRequests': 'No pending login requests.',
	'devices.unknownHost': 'unknown host',
	'devices.authUser': 'user: {name}',
	'devices.authRoutes': 'routes: {routes}',
	'devices.approve': 'Approve',
	'devices.reject': 'Reject',

	// Settings - API keys
	'settings.apiKeys': 'API Keys',
	'settings.deleteConfirm': 'Delete this API key? This cannot be undone.',
	'settings.loading': 'Loading...',
	'settings.noKeys': 'No API keys found.',
	'settings.prefix': 'Prefix',
	'settings.created': 'Created',
	'settings.expires': 'Expires',
	'settings.expire': 'Expire',

	// Settings - server
	'settings.serverSettings': 'Server Settings',
	'settings.headscaleUrl': 'Headscale URL',
	'settings.urlHint': 'URL for your headscale server instance',
	'settings.headscaleApiKey': 'Headscale API Key',
	'settings.apiKeyHint': 'Generate an API key for your headscale instance and place it here.',
	'settings.saveApiKey': 'Save API Key',
	'settings.editApiKey': 'Edit API Key',
	'settings.clearSettings': 'Clear Server Settings',
	'settings.testSettings': 'Test Server Settings',
	'settings.rolloverApiKey': 'Rollover API Key',

	// Settings - theme
	'settings.themeSettings': 'Theme Settings',

	// Settings - key expiry
	'settings.keyExpiryWarning': '{days} days left before API Key expiry, consider rolling your key',
	'settings.keyExpiryTip': '{days} days left before expiry',

	// Settings - dev flags
	'settings.developerFlags': 'Developer Flags',
	'settings.devFlagsTip': "To enable development features. Only check this if you're a developer or like being confused",
	'settings.aclPages': 'ACL Pages',

	// Settings - version
	'settings.version': 'Version',
	'settings.uiVersion': 'UI:',
	'settings.serverVersion': 'Headscale server:',

	// Settings - language
	'settings.language': 'Language',
	'settings.languageEnglish': 'English',
	'settings.languageChinese': '中文',

	// Groups / ACL
	'groups.title': 'ACL Policy',
	'groups.loading': 'Loading policy...',
	'groups.policyPlaceholder': 'Enter ACL policy in HuJSON format...',
	'groups.saving': 'Saving...',
	'groups.savePolicy': 'Save Policy',
	'groups.validate': 'Validate',
	'groups.reload': 'Reload',
	'groups.syntaxValid': 'Policy syntax is valid',
	'groups.validationFailed': 'Policy validation failed: {error}',
	'groups.updatedSuccessfully': 'Policy updated successfully'
} as const;
