import * as core from '@actions/core';

export interface ReleaseData {
  id: number;
  html_url: string;
  upload_url: string;
}

export function setOutputs(release: ReleaseData) {
  core.setOutput('id', release.id);
  core.setOutput('html_url', release.html_url);
  core.setOutput('upload_url', release.upload_url);
}
