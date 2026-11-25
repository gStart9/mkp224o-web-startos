# Updating the upstream version

The package builds [gStart9/mkp224o-web](https://github.com/gStart9/mkp224o-web), which is the `upstream-project` git submodule. mkp224o-web's own Dockerfile pins the mkp224o release that the image compiles, so a new mkp224o release is a change to mkp224o-web first.

## Determining the upstream version

The latest mkp224o-web release tag:

```
gh release view -R gStart9/mkp224o-web --json tagName -q .tagName
```

The latest mkp224o release tag, to compare with `MKP224O_VERSION` in `upstream-project/Dockerfile`:

```
gh release view -R cathugger/mkp224o --json tagName -q .tagName
```

## Applying the bump

1. For a new mkp224o release, update `MKP224O_VERSION` and `MKP224O_COMMIT` in mkp224o-web's Dockerfile, test the build, and release a new mkp224o-web version with a tag of the form `v0.2.0`.
2. Point the submodule at the new mkp224o-web tag:

   ```
   git -C upstream-project fetch --tags origin
   git -C upstream-project checkout v0.2.0
   ```

3. Set the upstream part of the version in `startos/versions/current.ts` to the mkp224o-web version without the `v`, for example `0.2.0:0`.
