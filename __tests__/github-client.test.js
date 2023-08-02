"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const github_1 = require("@actions/github");
const github_client_1 = require("../src/github-client");
jest.mock('@actions/github', () => ({
    getOctokit: jest.fn()
}));
describe('createRelease function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should create a release with default values', () => __awaiter(void 0, void 0, void 0, function* () {
        const createReleaseMock = jest
            .fn()
            .mockResolvedValue({ data: { html_url: 'https://example.com' } });
        const octokitMock = { rest: { repos: { createRelease: createReleaseMock } } };
        github_1.getOctokit.mockReturnValue(octokitMock);
        const inputs = {
            token: 'mock-token',
            owner: 'owner',
            repo: 'repo',
            release_name: undefined,
            tag_name: 'v1.0.0',
            body: undefined,
            draft: false,
            prerelease: false
        };
        const releaseData = yield (0, github_client_1.createRelease)(inputs);
        expect(github_1.getOctokit).toHaveBeenCalledWith('mock-token');
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
    }));
    it('should create a release with provided inputs', () => __awaiter(void 0, void 0, void 0, function* () {
        const createReleaseMock = jest
            .fn()
            .mockResolvedValue({ data: { html_url: 'https://example.com' } });
        const octokitMock = { rest: { repos: { createRelease: createReleaseMock } } };
        github_1.getOctokit.mockReturnValue(octokitMock);
        const inputs = {
            token: 'other-token',
            owner: 'other-owner',
            repo: 'other-repo',
            release_name: 'Custom Release',
            tag_name: 'v2.0.0',
            body: 'Custom release notes',
            draft: true,
            prerelease: true
        };
        const releaseData = yield (0, github_client_1.createRelease)(inputs);
        expect(github_1.getOctokit).toHaveBeenCalledWith('other-token');
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
    }));
    it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const createReleaseMock = jest
            .fn()
            .mockRejectedValue(new Error('Failed to create release after multiple attempts'));
        const octokitMock = { rest: { repos: { createRelease: createReleaseMock } } };
        github_1.getOctokit.mockReturnValue(octokitMock);
        const inputs = {
            token: 'mock-token',
            owner: 'owner',
            repo: 'repo',
            release_name: undefined,
            tag_name: 'v1.0.0',
            body: undefined,
            draft: false,
            prerelease: false
        };
        yield expect((0, github_client_1.createRelease)(inputs)).rejects.toThrowError('Failed to create release after multiple attempts');
        expect(github_1.getOctokit).toHaveBeenCalledWith('mock-token');
        expect(createReleaseMock).toHaveBeenCalled();
    }));
});
