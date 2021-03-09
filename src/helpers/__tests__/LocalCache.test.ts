import LocalCache from '../LocalCache';

describe('Test LocalCache', () => {
  test('test cache never expired', function () {
    const cache = LocalCache.new();
    cache.set('age', 18);
    expect(cache.get('age')).toBe(18);
    expect(cache.get('name')).toBe(null);
    expect(cache.get('name', 100)).toBe(100);
    cache.clear();
    expect(cache.keys().length).toBe(0);
    cache.set('name', 'wx');
    expect(cache.get('name')).toBe('wx');
    cache.remove('name');
    expect(cache.has('name')).toBeFalsy();
    expect(cache.has('age')).toBeFalsy();
  });
  test('test cache with expires', function (done) {
    const cache = LocalCache.new({expire: 3000});
    cache.set('age', 18);
    cache.set('name', 'wx', -100);
    expect(cache.get('name')).toBe(null);
    expect(cache.get('age')).toBe(18);
    setTimeout(() => {
      expect(cache.get('age')).toBe(null);
      done();
    }, 4000);
  });
});
