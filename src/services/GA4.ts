import { processEnvService } from './ProcessEnv';

type GtagCommands = Parameters<Gtag.Gtag>[0];

class GoogleAnalytics4 {
  private readonly debugMode = !processEnvService.isProducton();
  private isInit = false;

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
      console.groupCollapsed(`[Gtag] - (${type}) ${action}`);
      console.log(event);
      console.groupEnd();
    }

    if (event) {
      window.gtag(type, action, event);
    } else {
      window.gtag(type, action);
    }
  }

  public init() {
    if (this.isInit) return;
    this.isInit = true;
    
    // string 타입을 받는다곤 하나, toString 으로 보내면 아예 초기화가 되지 않는 듯 합니다.
    // 때문에 타입에러를 무시하기 위해 다음 라인을 추가했어요.
    // @ts-ignore
    this.send('js', new Date());
    this.send('config', 'G-DT9Y6614LF', {
      // @ts-ignore
      debug_mode: this.debugMode,
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
