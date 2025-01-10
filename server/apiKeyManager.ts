class ApiKeyManager {
  private defaultKeys: string[];
  private customKeys: string[] = [];
  private currentIndex: number = 0;

  constructor(defaultKeys: string[]) {
    if (!defaultKeys || defaultKeys.length === 0) {
      throw new Error('No default API keys provided');
    }
    this.defaultKeys = defaultKeys.filter(key => key && key.trim());
    if (this.defaultKeys.length === 0) {
      throw new Error('No valid default API keys provided');
    }
  }

  public setCustomKeys(keys: string[]) {
    this.customKeys = keys.filter(key => key && key.trim());
    this.currentIndex = 0; // Reset index when changing keys
  }

  public clearCustomKeys() {
    this.customKeys = [];
    this.currentIndex = 0;
  }

  public getNextKey(): string {
    const activeKeys = this.customKeys.length > 0 ? this.customKeys : this.defaultKeys;
    const key = activeKeys[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % activeKeys.length;
    return key;
  }

  public getAllKeys(): string[] {
    return this.customKeys.length > 0 ? [...this.customKeys] : [...this.defaultKeys];
  }

  public getKeyCount(): number {
    return this.customKeys.length > 0 ? this.customKeys.length : this.defaultKeys.length;
  }

  public isUsingCustomKeys(): boolean {
    return this.customKeys.length > 0;
  }
}

export default ApiKeyManager; 