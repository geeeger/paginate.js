# Paginate.js

该插件是一个脱离依赖的原生分页插件,支持UMD格式引用。向下兼容至ie 8。

## Usage

初始化插件

```js
var paginate = new Paginate({
    // required
    container: document.getElementById('main-message'),
    // required
    page_count: 100,
    // optional, default is 5,
    // 每页展示page数量
    page_size: 5,
    // optional, default is true,是否显示前一页按钮
    prev: true,
    // optional, default is 上一页按钮显示文字
    prev_text: '上一页',
    // optional, default is true,是否显示后一页按钮
    next: true,
    // optional, default is 下一页,下一页按钮显示文字
    next_text: '下一个',
    // optional, default is false,是否显示跳转到xx页
    redirect: false,
    // optional, default is go, 跳转按钮文字
    redirect_text: 'go'
});
```

---

事件

```js
// 点击下一页产生
paginate.on('nextClick', function (page) {
    // 点击某页后触发
    if (!user.saved.info) {
        return confirm('您并未保存信息，依然继续吗？');
    }
})
```

```js
// 点击下一页完毕（未return false）
paginate.on('nextClicked', function (page) {
    // 可以做一些其他事情
});
```

点击下一页完毕会触发nextClidecd和pageClicked两个事件

```js
// 任意点击任何能产生页面跳转动作的按钮触发该事件
paginate.on('pageClicked', function (page) {
    // 做一些其他事情
    ajax.get('/api/test/' + page, function (data) {
        render(data);
    });
});
```


```js
// 点击前一页
paginate.on('prevClick', function (page) {
    if (!user.saved.info) {
        return confirm('您并未保存信息，依然继续吗？');
    }
});
```

点击上一页完毕会触发prevClidecd和pageClicked两个事件

```js
paginate.on('prevClicked', function (page) {
    // 做一些其他事情
});
```

```js
// 点击某页时产生该事件
paginate.on('pageClick', function (page) {
    if (!user.saved.info) {
        return confirm('您并未保存信息，依然继续吗？');
    }
});
```

```js
// 点击跳转时，产生该事件
paginate.on('redirect', function (page) {
    if (!user.saved.info) {
        return confirm('您并未保存信息，依然继续吗？');
    }
});
```

点击跳转完毕会触发redirected和pageClicked两个事件

```js
paginate.on('redirected', function (page) {
    // 做一些其他事情
});
```

---

可用方法

```js
// 监听事件,非数组，无法重复
paginate.on(evt, fn)
// 销毁事件，
paginate.off(evt);
// 触发自定义事件
paginate.fire(evt, arg1, arg2, ...);
// 获取或者设置配置
paginate.config(key, value);
// 销毁
paginate.destory();
```

## 设计问题

prevClick,prevClicked, nextClick,nextClicked事件等，没什么意义，应该归类为pageClick,pageClicked

但是我不怎么想改。。。懒是原罪





