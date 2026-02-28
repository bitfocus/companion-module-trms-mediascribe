import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { UpdatePresets } from './presets.js'

function secondsToTimecode(seconds: number): string {
	const hrs = Math.floor(seconds / 3600)
	const mins = Math.floor((seconds % 3600) / 60)
	const secs = Math.floor(seconds % 60)
	return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export interface StatusPreset {
	id: string
	name: string
}

interface StatusRecording {
	position: number
	path: string
}

export interface StatusData {
	siteName: string
	presets: StatusPreset[]
	activePresetId: string
	hasNoSignal: boolean
	inputError?: string
	recording?: StatusRecording
}

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig
	timeout: NodeJS.Timeout | null = null
	statusData: StatusData | null = null
	private lastPresetsJson: string = ''

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.updatePresets()

		await this.reload()
	}

	async destroy(): Promise<void> {
		if (this.timeout) {
			clearTimeout(this.timeout)
			this.timeout = null
		}
		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		await this.reload()
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updatePresets(): void {
		UpdatePresets(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	async apiRequest(path: string, method: string = 'GET', body?: object): Promise<Response> {
		const controller = new AbortController()
		const timeout = setTimeout(() => controller.abort(), 5000)
		try {
			return await fetch(`${this.config.host}${path}`, {
				method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.config.apiToken}`,
				},
				body: body ? JSON.stringify(body) : undefined,
				signal: controller.signal,
			})
		} finally {
			clearTimeout(timeout)
		}
	}

	async reload(): Promise<void> {
		this.log('debug', 'Beginning polling loop')
		if (this.timeout) {
			clearTimeout(this.timeout)
			this.timeout = null
		}

		if (!this.config.host || !this.config.apiToken) {
			this.log('warn', 'Module not configured. Host and API Token are required.')
			this.updateStatus(InstanceStatus.Disconnected)
			return
		}

		this.poll()
	}

	async updateVariables(): Promise<void> {
		const response = await this.apiRequest('/api/control/status')
		if (!response.ok) {
			throw new Error(`Failed to fetch status: ${response.statusText}`)
		}
		const statusData = (await response.json()) as StatusData
		this.log('debug', `Status data: ${JSON.stringify(statusData)}`)

		this.statusData = statusData

		const presetsJson = JSON.stringify(statusData.presets)
		if (presetsJson !== this.lastPresetsJson) {
			this.lastPresetsJson = presetsJson
			this.updateActions()
			this.updatePresets()
		}

		const positionInSeconds = statusData.recording?.position || 0
		const timecode = secondsToTimecode(positionInSeconds)
		this.setVariableValues({
			'transcription-status': statusData.recording ? 'Active' : 'Inactive',
			'active-preset-id': statusData.activePresetId || '',
			'active-preset-name': statusData.presets.find((p) => p.id === statusData.activePresetId)?.name || '',
			'transcription-duration-seconds': positionInSeconds,
			'transcription-duration-string': timecode,
			'site-name': statusData.siteName || '',
			'has-no-signal': statusData.hasNoSignal ? 'true' : 'false',
		})

		this.checkFeedbacks()
	}

	poll(): void {
		this.updateVariables()
			.then(() => {
				this.updateStatus(InstanceStatus.Ok)
			})
			.catch((error) => {
				this.log('error', `Error updating variables: ${error}`)
				this.updateStatus(InstanceStatus.ConnectionFailure)
			})
			.finally(() => {
				if (this.timeout) {
					clearTimeout(this.timeout)
				}
				this.timeout = setTimeout(() => this.poll(), 1000)
			})
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
