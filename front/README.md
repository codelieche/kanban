# kanban

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 环境变量说明
- `VUE_APP_BASE_URL`: 后端API的基本地址
- `VUE_APP_API_TIMEOUT`: API超时时间

当`yarn build`使用的模式是`production`会加载`.env.production`中的配置。  
当`yarn run serve`使用的模式是`development`会加载`.env.development.local`中的配置

`.env.development.local`是被git忽略掉的文件，自行创建一下。
```
VUE_APP_BASE_URL=http://127.0.0.1:9000
VUE_APP_API_TIMEOUT=30000
```