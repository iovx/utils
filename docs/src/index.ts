import Http from '@iovx/utils/http';
import {ISimpleXHRNextInterceptor, ISimpleXHRPrevInterceptor} from "@iovx/utils/http/interface";

const interceptor: ISimpleXHRNextInterceptor = {
  intercept(res) {
    console.log(res);
    return res;
  }
};
const interceptor2: ISimpleXHRPrevInterceptor = {
  intercept(options) {
    console.log(options);
    return true;
  }
};
Http.interceptor('next', interceptor);
Http.interceptor('prev', interceptor2);

window.onload = () => {
  setTimeout(() => {
    Http.get<any>({
      url: 'http://open.zzht.cursor.io/?w=form',
    }).then((res: any) => {
      console.log(res);
      return res.data;
    })
      .then((result: any) => {
        console.log(result);
      });
  }, 2000);
};



