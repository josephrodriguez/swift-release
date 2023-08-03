import {getOctokit} from '@actions/github';
import {Release, Inputs} from '../src/github-types';
import GitHubClient from '../src/github-client';

jest.mock('@actions/github', () => ({
  getOctokit: jest.fn().mockReturnValue({
    rest: {
      repos: {
        createRelease: jest.fn(),
        getReleaseByTag: jest.fn()
      }
    }
  })
}));

describe('GitHubClient', () => {
  let ghClient: GitHubClient;

  beforeEach(() => {
    ghClient = new GitHubClient('mock_token');
  });

  it('should create a release with default values', async () => {
    const getReleaseByTagMock = jest
      .fn()
      .mockResolvedValue({data: {html_url: 'https://example.com'}});
    ghClient['getExistingReleaseRequest'] = getReleaseByTagMock;

    const inputs: Inputs = {
      token: 'mock_token',
      owner: 'owner',
      repo: 'repo',
      name: undefined,
      tag: 'v1.0.0',
      body: undefined,
      draft: false,
      prerelease: false,
      asset_name: undefined,
      asset_path: undefined
    };

    const release: Release = await ghClient.createRelease(inputs);

    expect(getOctokit).toHaveBeenCalledWith('mock_token');
    expect(getReleaseByTagMock).toHaveBeenCalledWith({
      token: 'mock_token',
      owner: 'owner',
      repo: 'repo',
      tag: 'v1.0.0',
      draft: false,
      prerelease: false
    });
    // expect(release.html_url).toBe('https://example.com');
  });
});
