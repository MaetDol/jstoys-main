class ProcessEnvService {
  public isProducton() {
    return process.env.NODE_ENV === 'production';
  }
}

export const processEnvService = new ProcessEnvService();
