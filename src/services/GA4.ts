import { processEnvService } from './ProcessEnv';

type GtagCommands = Parameters<Gtag.Gtag>[0];

class GoogleAnalytics4 {
  private readonly debugMode = !processEnvService.isProducton();

  private send(
    type: GtagCommands,
    action: string,
    event: Record<string, string>
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

  public event(action: string, event: Record<string, string>) {
    this.send('event', action, event);
  }
}

export const ga4Service = new GoogleAnalytics4();
