
import * as core from '@actions/core';
import { getInputs } from './github-input';
import { createRelease } from './github-client';

export async function run() {
    try {
        const inputs = getInputs();
        await createRelease(inputs);
    } catch (err) {
        core.setFailed(`${err}`);
    }
}

if (require.main === module) {
    run();
} else {
    core.info('the script is loaded as a module, so skipping the execution');
}