# selector

为了解决系统默认下拉框样式无法**自定义**化的问题，

再次基础上最大化模拟原生下拉列表的特性：

1.**宽度超出屏幕右侧会向左展开**

2.**高度超出屏幕底部会向上展开**

并满足了屏幕高度极窄，上下都可能超出的情况，会自动调整高度。

除以上之外还有：

### 搜索列表

默认不开启搜索

开启：在原生select上加上searchable属性即可

### 多选功能

使用：$('select').qselect();

多选的情况：在原生select上加上multiselect属性即可

notice: 使用之前需要确保所选元素在页面存在，如果是页面selector动态生成的，需要生成后再调用

author blog: 秋叶博客[https://www.mizuiren.com](https://www.mizuiren.com)
