# koa2-mongodb-fetch

> 本项目完全遵守MVC规范，修改api接口名字在`controllers`目录下，因为本项目为爬虫服务器，固`models`目录不建立Schema对应关系，而改为爬虫代码+数据库操作目录，因为superagent和koa中间件返回promise，所以在爬取完成后直接返回数据库操作继续then链式操作，具体看代码

- 服务器： koa2（包括各种第三方中间件）, babel, monk
- 爬虫： superagent, cheerio

## 启动服务器

```
node index
```