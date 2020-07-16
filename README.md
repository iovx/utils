## 微风平台基础工具库

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
