import * as core from '@actions/core';
import {getInputs} from './github-input';
import {setOutputs} from './github-output';
import {createRelease} from './github-client';

export async function run() {
  try {
    const inputs = getInputs();
    core.info(`Inputs: ${JSON.stringify(inputs)}`);

    const release = await createRelease(inputs);
    setOutputs(release);

    core.info(`Outputs: ${JSON.stringify(release)}`);
    core.info('Release created successfully');
  } catch (err) {
    core.setFailed(`${err}`);
  }
}

if (require.main === module) {
  run();
} else {
  core.info('the script is loaded as a module, so skipping the execution');
}
