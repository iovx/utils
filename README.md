# 🧰 WX Base Utils Library

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![license][license]][license-url]
![tests][tests]
[![cover][cover]][cover-url]
[![last-commit][last-commit]][last-commit-url]
[![release][release]][release-url]
[![prs][prs]][prs-url]
[![download][download]][download-url]


## Get Started

### install

```
npm i -D @iovx/utils
```
### Usage

```js
import {Http} from '@iovx/utils'

Http.get({url:'http://example.com/api/getUserInfo'}).then(res=>{
  console.log(res);
});

```
## LICENSE

The MIT License (MIT)



[npm]: https://img.shields.io/npm/v/@iovx/utils
[npm-url]: https://www.npmjs.com/package/@iovx/utils
[node]: https://badgen.net/npm/node/@iovx/utils
[node-url]: https://nodejs.org
[deps]: https://img.shields.io/david/webpack/webpack.svg
[deps-url]: #
[prs]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[prs-url]: https://github.com/iovx/utils/pulls
[tag]: https://badgen.net/github/tags/iovx/utils
[tag-url]: #
[release]: https://badgen.net/github/release/iovx/utils
[release-url]: #
[license]: https://img.shields.io/github/license/iovx/utils
[license-url]: #
[tests-url]:https://travis-ci.com/github/iovx/utils/builds
[tests]:https://badgen.net/travis/iovx/utils
[last-commit-url]: https://travis-ci.com/github/iovx/utils/builds
[last-commit]: https://badgen.net/github/last-commit/iovx/utils
[cover-url]: https://codecov.io/github/iovx/utils/
[cover]: https://badgen.net/codecov/c/github/iovx/utils/master
[download-url]: https://www.npmjs.com/package/@iovx/utils
[download]: https://badgen.net/npm/dw/@iovx/utils
