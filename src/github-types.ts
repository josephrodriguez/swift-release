export interface Inputs {
  token: string;
  owner: string;
  repo: string;
  name: string | undefined;
  tag: string | undefined;
  body: string | undefined;
  draft: boolean;
  prerelease: boolean;
  asset_name: string | undefined;
  asset_path: string | undefined;
}

export interface Release {
  owner: string;
  repo: string;
  id: number;
  html_url: string;
  upload_url: string;
}

export interface AssetInfo {
  path: string;
  name: string;
}

export interface AssetResponse {
  name: string;
  url: string;
  size: number;
  content_type: string;
}

export class RetryOptions {
  readonly retryAttempts: number;
  readonly retryDelayMs: number;

  private static readonly DEFAULT_RETRY_ATTEMPTS = 3;
  private static readonly DEFAULT_RETRY_DELAY_MS = 1000;
  private static readonly instance: RetryOptions = new RetryOptions();

  private constructor(
    retryAttempts: number = RetryOptions.DEFAULT_RETRY_ATTEMPTS,
    retryDelayMs: number = RetryOptions.DEFAULT_RETRY_DELAY_MS
  ) {
    this.retryAttempts = retryAttempts;
    this.retryDelayMs = retryDelayMs;
  }

  static getDefaultOptions(): RetryOptions {
    return RetryOptions.instance;
  }

  withRetryAttempts(retryAttempts: number): RetryOptions {
    return new RetryOptions(retryAttempts, this.retryDelayMs);
  }

  withRetryDelayMs(retryDelayMs: number): RetryOptions {
    return new RetryOptions(this.retryAttempts, retryDelayMs);
  }
}
