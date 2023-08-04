## swift-release

GitHub Actions workflow to create, update, and upload releases for your projects.

### Inputs

| Name             | Description                                           | Required | Default Value | Example                           |
|------------------|-------------------------------------------------------|----------|---------------|-----------------------------------|
| `asset_name`     | The name of the uploaded asset (optional).           | No       | -             | `my-asset.zip`                   |
| `asset_path`     | The local path of the asset to upload (optional).    | No       | -             | `./dist/my-asset.zip`            |
| `body`           | The release notes or description.                    | No       | -             | `Initial release of the project.` |
| `draft`          | Set to `true` to create a draft release.             | No       | `false`       | `true`                            |
| `name`           | The title of the release.                            | No       | -             | `Release 1.0.0`                   |
| `owner`          | The owner of the repository.                         | No       | -             | `josephrodriguez`                 |
| `prerelease`     | Set to `true` to create a prerelease.                | No       | `false`       | `true`                            |
| `repo`           | The repository name.                                 | No       | -             | `create-release`                  |
| `tag`            | The tag name for the release.                        | No       | -             | `v1.0.0`                          |
| `token`          | GitHub token to access the repository.               | No       | -             | `${{ secrets.GITHUB_TOKEN }}`     |

### Outputs

| Name             | Description                                           | Example                    |
|------------------|-------------------------------------------------------|----------------------------|
| `asset_content_type` | The content type of the uploaded asset.           | `application/zip`          |
| `asset_name`     | The name of the uploaded asset.                      | `my-asset.zip`             |
| `asset_size`     | The size of the uploaded asset in bytes.             | `102400`                   |
| `asset_url`      | The URL of the uploaded asset on GitHub.             | `https://github.com/user/repo/releases/download/v1.0.0/my-asset.zip` |
| `html_url`       | The URL of the created release on GitHub.            | `https://github.com/user/repo/releases/tag/v1.0.0` |
| `id`             | The ID of the created release.                       | `123456789`                |
| `upload_url`     | The URL for uploading assets to the release.         | `https://uploads.github.com/user/repo/releases/123456789/assets{?name,label}` |

### Usage

Include `create-release` as a step in your GitHub Actions workflow:

```yaml
name: Create Release
on:
  push:
    branches:
      - master

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v2

      - name: Create GitHub Release
        uses: josephrodriguez/swift-release@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

Replace placeholders with actual values.

### Examples

Create a new release:

```yaml
- name: Create GitHub Release
  uses: josephrodriguez/swift-release@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    owner: josephrodriguez
    repo: create-release
    tag: v1.0.0
    name: Release 1.0.0
    body: Initial release of the project.
```

Create a draft release:

```yaml
- name: Create GitHub Release
  uses: josephrodriguez/swift-release@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    draft: true
```

### Contributing

Contributions are welcome! Report bugs or add new features via issues/pull requests.

### License

MIT License - [LICENSE](./LICENSE)