import * as core from '@actions/core';
import {context} from '@actions/github';
import * as constants from './constants';

export interface Inputs {
  token: string;
  owner: string;
  repo: string;
  release_name: string | undefined;
  tag_name: string | undefined;
  body: string | undefined;
  draft: boolean;
  prerelease: boolean;
}

export function getInputs(): Inputs {
  const token =
    core.getInput(constants.INPUT_TOKEN, {required: false}) ||
    process.env.GITHUB_TOKEN!;
  return {
    token,
    owner:
      core.getInput(constants.INPUT_OWNER, {required: false}) ||
      context.repo.owner,
    repo:
      core.getInput(constants.INPUT_REPO, {required: false}) ||
      context.repo.repo,
    release_name: core.getInput(constants.INPUT_RELEASE_NAME),
    tag_name:
      core.getInput(constants.INPUT_TAG_NAME) ||
      context.ref.replace('refs/tags/', ''),
    body: core.getInput(constants.INPUT_BODY),
    draft: core.getBooleanInput(constants.INPUT_DRAFT, {required: false}),
    prerelease: core.getBooleanInput(constants.INPUT_PRERELEASE, {
      required: false
    })
  };
}
