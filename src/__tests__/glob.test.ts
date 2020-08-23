import {src} from 'gulp';
import through2 = require("through2");


describe('Glob匹配文件', function () {

  it('Assets Files', () => {
    src(['src/**/*.(json|ts)']).pipe(through2.obj(chunk => {
      console.log(chunk.path);
    }))
  })
});
