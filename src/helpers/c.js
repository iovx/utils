/**
 * @typedef {{id:string, plugins:Function[]}} IBootOptions
 */

/**
 * boot
 * @param {IBootOptions} options
 */
function boot(options) {
  const { id, plugins } = options;
  const context = {
    id,
    initialized: true,
    version: '1.0.27',
    plugin: {
      size: plugins.length,
    },
    getState() {
      return plugins;
    },
  };

  // apply plugin
  function gc(i) {
    return {
      ...context,
      getIndex: () => i,
    };
  }

  const stateArr = new Array(plugins.length).fill(0);

  function series(plugins) {
    let i = 0;

    function r() {
      const plugin = plugins.shift();
      if (!plugin) {
        return;
      }
      plugin(gc(i))(() => {
        stateArr[i] = true;
        i++;
        r(plugins);
      });
    }

    r();
  }

  // series(plugins);
  function parallel(plugins) {
    plugins.forEach((plugin, i) => {
      plugin(gc(i))(() => {
        stateArr[i] = true;
      });
    });
  }

  parallel(plugins);
}

boot({
  id: 'wind',
  plugins: [
    (context) => (done) => {
      setTimeout(() => {
        console.log('执行任务1:', context.getIndex());
        done();
      }, 3000);
    },
    (context) => (done) => {
      setTimeout(() => {
        console.log('执行任务2:', context.getIndex());
        done();
      }, 1000);
    },
    (context) => (done) => {
      console.log('执行任务3:', context.getIndex());
      done();
    },
    (context) => (done) => {
      setTimeout(() => {
        console.log('执行任务4:', context.getIndex());
        done();
      }, 1000);
    },
  ],
});

