import fs from 'fs';
import path from 'path';
import {conf2Obj} from '../conf';

const data = fs.readFileSync(path.resolve(__dirname, './assets/data.conf'), 'utf-8');

describe('conf文件解析', () => {
  test('conf内容解析', () => {
    expect(conf2Obj(data)).toHaveProperty('http');
  });
});

