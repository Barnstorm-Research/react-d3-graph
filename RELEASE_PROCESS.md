## Release Process

This is not yet a full automated process, so here are a few steps to get the thing properly released on github
and publish under npm registry.

### Setup (serve a local version to run tests against it)

1.  npm run dist:sandbox
2.  npm run start

### See Cypress Test Results

You can run the cypress tests from the developers console by running
`node_modules/cypress/bin/cypress open`. Select "Electron 59" tool
and "Run All Tests".

### Release steps

1.  npm run dist
2.  npm run docs:lint (fix if errors)
3.  Update versioning in package.json
4.  npm run docs
5.  Small tweaks on documentation page (quicklinks)
6.  Replace current files in docs for the generated ones in gen-docs
7.  Generate CHANGELOG.md (github_changelog_generator -u GITHUB_USERNAME)
8.  git commit -m "Release x.x.x"
9.  Create release x.x.x in github
10. git pull (origin master)
11. npm pack (to generate the tarball)
12. npm publish (to publish to NPM repo)
