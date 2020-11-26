import Http from '@iovx/utils/http';
import { TaskExecutor } from '@iovx/utils/helpers';
import { plugins } from './task';

window.onload = () => {
  console.log('初始化...');
  setTimeout(() => {
    Http.get<any>({
      url: 'http://open.zzht.cursor.io/?w=form',
    })
      .then((res) => res.data)
      .then((result: any) => {
        console.log(result, plugins);
      })
      .finally(() => {
        TaskExecutor.new({ plugins })
          .series()
          .then(() => {
            console.log('执行完成！！！');
          });
      });
  }, 2000);
};
