import {getOctokit} from '@actions/github';
import * as ghIn from '../src/github-input';
import * as ghOut from '../src/github-output';
import {createRelease} from '../src/github-client';

jest.mock('@actions/github', () => ({
  getOctokit: jest.fn()
}));

describe('createRelease function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a release with default values', async () => {
    const createReleaseMock = jest
      .fn()
      .mockResolvedValue({data: {html_url: 'https://example.com'}});
    const octokitMock = {rest: {repos: {createRelease: createReleaseMock}}};
    (getOctokit as jest.Mock).mockReturnValue(octokitMock);

    const inputs: ghIn.Inputs = {
      token: 'mock-token',
      owner: 'owner',
      repo: 'repo',
      name: undefined,
      tag: 'v1.0.0',
      body: undefined,
      draft: false,
      prerelease: false
    };

    const releaseData: ghOut.ReleaseData = await createRelease(inputs);

    expect(getOctokit).toHaveBeenCalledWith('mock-token');
    expect(createReleaseMock).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      name: undefined,
      tag_name: 'v1.0.0',
      body: undefined,
      draft: false,
      prerelease: false
    });
    expect(releaseData.html_url).toBe('https://example.com');
  });

  it('should create a release with provided inputs', async () => {
    const createReleaseMock = jest
      .fn()
      .mockResolvedValue({data: {html_url: 'https://example.com'}});
    const octokitMock = {rest: {repos: {createRelease: createReleaseMock}}};
    (getOctokit as jest.Mock).mockReturnValue(octokitMock);

    const inputs: ghIn.Inputs = {
      token: 'other-token',
      owner: 'other-owner',
      repo: 'other-repo',
      name: 'Custom Release',
      tag: 'v2.0.0',
      body: 'Custom release notes',
      draft: true,
      prerelease: true
    };

    const releaseData: ghOut.ReleaseData = await createRelease(inputs);

    expect(getOctokit).toHaveBeenCalledWith('other-token');
    expect(createReleaseMock).toHaveBeenCalledWith({
      owner: 'other-owner',
      repo: 'other-repo',
      name: 'Custom Release',
      tag_name: 'v2.0.0',
      body: 'Custom release notes',
      draft: true,
      prerelease: true
    });
    expect(releaseData.html_url).toBe('https://example.com');
  });

  it('should handle errors', async () => {
    const createReleaseMock = jest
      .fn()
      .mockRejectedValue(
        new Error('Failed to create release after multiple attempts')
      );
    const octokitMock = {rest: {repos: {createRelease: createReleaseMock}}};
    (getOctokit as jest.Mock).mockReturnValue(octokitMock);

    const inputs: ghIn.Inputs = {
      token: 'mock-token',
      owner: 'owner',
      repo: 'repo',
      name: undefined,
      tag: 'v1.0.0',
      body: undefined,
      draft: false,
      prerelease: false
    };

    await expect(createRelease(inputs)).rejects.toThrowError(
      'Failed to create release after multiple attempts'
    );
    expect(getOctokit).toHaveBeenCalledWith('mock-token');
    expect(createReleaseMock).toHaveBeenCalled();
  });
});
