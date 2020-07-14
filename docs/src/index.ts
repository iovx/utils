import Http from '@iovx/utils/http';

window.onload = () => {
  setTimeout(() => {
    Http.get<any>({
      url: 'http://open.zzht.cursor.io/?w=form',
    }).then((res: any) => res.data)
      .then((result: any) => {
        console.log(result);
      });
  }, 2000);
};



