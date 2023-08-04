import * as core from '@actions/core';
import {context} from '@actions/github';
import {Inputs} from './github-types';
import * as constants from './constants';

export function getInputs(): Inputs {
  return {
    token:
      core.getInput(constants.INPUT_TOKEN, {required: false}) ||
      process.env.GITHUB_TOKEN!,
    owner:
      core.getInput(constants.INPUT_OWNER, {required: false}) ||
      context.repo.owner,
    repo:
      core.getInput(constants.INPUT_REPO, {required: false}) ||
      context.repo.repo,
    name:
      core.getInput(constants.INPUT_RELEASE_NAME, {required: false}) ||
      context.ref.replace('refs/tags/', ''),
    tag:
      core.getInput(constants.INPUT_TAG_NAME, {required: false}) ||
      context.ref.replace('refs/tags/', ''),
    body: core.getInput(constants.INPUT_BODY, {required: false}),
    draft: core.getBooleanInput(constants.INPUT_DRAFT, {required: false}),
    prerelease: core.getBooleanInput(constants.INPUT_PRERELEASE, {
      required: false
    }),
    asset_name: core.getInput(constants.INPUT_ASSET_NAME, {required: false}),
    asset_path: core.getInput(constants.INPUT_ASSET_PATH, {required: false})
  };
}
