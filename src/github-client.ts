import {getOctokit} from '@actions/github';
import * as core from '@actions/core';
import {
  AssetInfo,
  AssetResponse,
  Inputs,
  Release,
  RetryOptions
} from './github-types';
import {readFileSync} from 'fs';
import mime from 'mime-types';
import path from 'path';

class GitHubClient {
  private octokit: ReturnType<typeof getOctokit>;

  constructor(token: string) {
    this.octokit = getOctokit(token);
  }

  public async createRelease(inputs: Inputs): Promise<Release> {
    const release = await this.retryPromise(
      () => this.createReleaseFn(inputs),
      RetryOptions.getDefaultOptions()
    );
    return release;
  }

  public async uploadReleaseAsset(
    release: Release,
    assetInfo: AssetInfo
  ): Promise<AssetResponse> {
    const asset = await this.retryPromise(
      () => this.uploadAssetToReleaseRequest(release, assetInfo),
      RetryOptions.getDefaultOptions()
    );
    return asset;
  }

  private async createReleaseFn(inputs: Inputs): Promise<Release> {
    const existingRelease = await this.getExistingReleaseRequest(inputs);
    if (existingRelease) {
      return existingRelease;
    }

    return await this.createReleaseRequest(inputs);
  }

  private async createReleaseRequest(inputs: Inputs): Promise<Release> {
    const {data} = await this.octokit.rest.repos.createRelease({
      owner: inputs.owner,
      repo: inputs.repo,
      name: inputs.name,
      tag_name: inputs.tag!,
      body: inputs.body,
      draft: inputs.draft,
      prerelease: inputs.prerelease
    });

    return {
      owner: inputs.owner,
      repo: inputs.repo,
      id: data.id,
      html_url: data.html_url,
      upload_url: data.upload_url
    };
  }

  private async getExistingReleaseRequest(
    inputs: Inputs
  ): Promise<Release | undefined> {
    try {
      const {data} = await this.octokit.rest.repos.getReleaseByTag({
        owner: inputs.owner,
        repo: inputs.repo,
        tag: inputs.tag!
      });

      return {
        owner: inputs.owner,
        repo: inputs.repo,
        id: data.id,
        html_url: data.html_url,
        upload_url: data.upload_url
      };
    } catch (error: any) {
      if (error.status === 404) {
        return undefined;
      } else {
        throw error;
      }
    }
  }

  private async uploadAssetToReleaseRequest(
    release: Release,
    assetInfo: AssetInfo
  ): Promise<AssetResponse> {
    const assetContent = readFileSync(assetInfo.path);

    const extension = path.extname(assetInfo.path).slice(1).toLowerCase();
    const contentType =
      mime.contentType(extension) || 'application/octet-stream';

    const {data: asset} = await this.octokit.rest.repos.uploadReleaseAsset({
      owner: release.owner,
      repo: release.repo,
      release_id: release.id,
      name: assetInfo.name,
      data: assetContent as unknown as string,
      headers: {
        'Content-Type': contentType
      }
    });

    return {
      name: asset.name,
      content_type: asset.content_type,
      size: asset.size,
      url: asset.url
    };
  }

  private async retryPromise<T>(
    promiseFn: () => Promise<T>,
    options: RetryOptions
  ): Promise<T> {
    for (let attempt = 1; attempt <= options.retryAttempts; attempt++) {
      try {
        return await promiseFn();
      } catch (error) {
        core.info(`Error: Attempt ${attempt} failed. ${error}`);
        if (attempt < options.retryAttempts) {
          await this.sleep(options.retryDelayMs);
        }
      }
    }
    throw new Error('Failed after multiple attempts');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default GitHubClient;
