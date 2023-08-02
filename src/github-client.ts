import {getOctokit} from '@actions/github';
import * as core from '@actions/core';
import * as ghIn from './github-input';
import * as ghOut from './github-output';

async function retryPromise<T>(
  promiseFn: () => Promise<T>,
  retryAttempts: number,
  retryDelayMs: number
): Promise<T> {
  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      return await promiseFn();
    } catch (error) {
      core.setFailed(`Error: Attempt ${attempt} failed. ${error}`);
      if (attempt < retryAttempts) {
        await sleep(retryDelayMs);
      }
    }
  }
  throw new Error('Failed after multiple attempts');
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function createRelease(
  inputs: ghIn.Inputs
): Promise<ghOut.ReleaseData> {
  const octokit = getOctokit(inputs.token);

  const createReleaseFn = async () => {
    const {data} = await octokit.rest.repos.createRelease({
      owner: inputs.owner,
      repo: inputs.repo,
      name: inputs.name,
      tag_name: inputs.tag!,
      body: inputs.body,
      draft: inputs.draft,
      prerelease: inputs.prerelease
    });

    return data;
  };

  const retryAttempts = 5;
  const retryDelayMs = 1000;

  try {
    const data = await retryPromise(
      createReleaseFn,
      retryAttempts,
      retryDelayMs
    );

    const releaseData: ghOut.ReleaseData = {
      id: data.id,
      html_url: data.html_url,
      upload_url: data.upload_url
    };
    return releaseData;
  } catch (error) {
    throw new Error('Failed to create release after multiple attempts');
  }
}
