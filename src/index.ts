import * as core from '@actions/core';
import * as path from 'path';
import {getInputs} from './github-input';
import GitHubClient from './github-client';

export async function run() {
  try {
    const inputs = getInputs();

    const ghClient = new GitHubClient(inputs.token);
    const release = await ghClient.createRelease(inputs);

    if (inputs.asset_path ?? false) {
      const asset = await ghClient.uploadReleaseAsset(release, {
        name: inputs.asset_name || path.basename(inputs.asset_path!),
        path: inputs.asset_path!
      });

      core.info(`Uploaded asset ${asset.name} to ${asset.url}`);

      core.setOutput('asset_name', asset.name);
      core.setOutput('asset_content_type', asset.content_type);
      core.setOutput('asset_url', asset.url);
      core.setOutput('asset_size', asset.size);
    }

    core.setOutput('id', release.id);
    core.setOutput('html_url', release.html_url);
    core.setOutput('upload_url', release.upload_url);

    core.info('Release created successfully');
  } catch (err: any) {
    core.setFailed(`${err.message}`);
  }
}

if (require.main === module) {
  run();
} else {
  core.info('the script is loaded as a module, so skipping the execution');
}
