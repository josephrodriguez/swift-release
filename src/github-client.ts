import * as core from '@actions/core';
import {getOctokit} from '@actions/github';
import * as gh from './github-input';

export async function createRelease(inputs: gh.Inputs) {
  const octokit = getOctokit(inputs.token);

  const {data} = await octokit.rest.repos.createRelease({
    owner: inputs.owner,
    repo: inputs.repo,
    name: inputs.release_name,
    tag_name: inputs.tag_name!,
    body: inputs.body,
    draft: inputs.draft,
    prerelease: inputs.prerelease
  });

  core.info(`Release created: ${data.html_url}`);
}
