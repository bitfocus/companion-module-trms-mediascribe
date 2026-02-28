import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	host: string
	apiToken: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'MediaScribe Appliance URL',
			tooltip: 'The full URL of your MediaScribe appliance, e.g. http://192.168.1.100:8080',
			width: 8,
			default: 'http://',
			regex: Regex.SOMETHING,
		},
		{
			type: 'textinput',
			id: 'apiToken',
			label: 'API Token',
			width: 8,
			regex: Regex.SOMETHING,
		},
	]
}
