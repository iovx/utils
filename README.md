## 微风平台基础工具库

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![license][license]][license-url]
[![Build Status](https://travis-ci.com/iovx/utils.svg?branch=master)](https://travis-ci.com/iovx/utils)
[![last-commit][last-commit]][last-commit-url]
[![tag][tag]][tag-url]
[![release][release]][release-url]
[![prs][prs]][prs-url]

### install

```
npm i -D @iovx/utils
```
CODECOV_TOKEN='1fab2446-6bd0-4a44-a0be-720255d658dd'
### Usage

```js
import {Http} from '@iovx/utils'

Http.get({url:'http://example.com/api/getUserInfo'}).then(res=>{
  console.log(res);
});

```


[npm]: https://img.shields.io/npm/v/@iovx/utils
[npm-url]: https://www.npmjs.com/package/@iovx/utils
[node]: https://badgen.net/npm/node/@iovx/utils
[node-url]: https://nodejs.org
[deps]: https://img.shields.io/david/webpack/webpack.svg
[deps-url]: #
[tests]: https://img.shields.io/travis/webpack/webpack/master.svg
[tests-url]: #
[prs]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[prs-url]: https://github.com/iovx/utils/pulls
[tag]: https://badgen.net/github/tags/iovx/utils
[tag-url]: #
[release]: https://badgen.net/github/release/iovx/utils
[release-url]: #
[license]: https://badgen.net/npm/license/@iovx/utils
[license-url]: #
[builds-url]: https://travis-ci.com/github/iovx/utils/builds
[builds]: https://api.travis-ci.org/iovx/utils.svg?branch=master
[last-commit-url]: https://travis-ci.com/github/iovx/utils/builds
[last-commit]: https://badgen.net/github/last-commit/iovx/utils
[cover]: https://img.shields.io/coveralls/webpack/webpack.svg
