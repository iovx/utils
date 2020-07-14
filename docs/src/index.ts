import Http from '@iovx/utils/http';

window.onload = () => {
  setTimeout(() => {
    Http.get({
      url: 'http://open.zzht.cursor.io/?w=form',
    }).then(res => res.data)
      .then(result => {
        console.log(result);
      });
  }, 2000);
};



