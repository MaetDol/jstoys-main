import { processEnvService } from './ProcessEnv';

type GtagCommands = Parameters<Gtag.Gtag>[0];

class GoogleAnalytics4 {
  private readonly debugMode = !processEnvService.isProducton();

  private send(
    type: GtagCommands,
    action: string,
    event?: Record<string, string>
  ) {
    if (!('gtag' in window)) {
      throw new Error('Seems like Google Analytics 4 is not loaded.');
    }
    if (typeof window.gtag !== 'function') {
      throw new Error('window.gtag is not a function');
    }

    if (this.debugMode) {
      console.group(`[${type}]: ${action}`);
      console.log(event);
      console.groupEnd();
      return;
    }

    window.gtag(type, action, event);
  }

  public init() {
    this.send('js', new Date().toString());
    this.send('config', 'G-DT9Y6614LF', {
      debug_mode: this.debugMode.toString(),
    });
  }

  public event<T extends Object>(action: string, event: Record<string, T>) {
    const stringifyEvent: Record<string, string> = {};
    for (const key in event) {
      stringifyEvent[key] = event[key].toString();
    }

    this.send('event', action, stringifyEvent);
  }
}

export const ga4Service = new GoogleAnalytics4();
