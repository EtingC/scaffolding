# npm start
//调试模式：会指定启动浏览器，JS自动引用mock/adapter(根据profile实现的模拟设备)

# npm run build
//打测试包 ，可用于上传JD、美国、KIT平台,也可拷贝到手机上（智慧星）。但有大量调试代码，不可用于正式发布

# npm run prod
//正式发布包

# 另外开提供得了2个参数：
platform：UI包使用平台，默认dna。会自动引用平台的adapter和SDK；
protocol：代码中使用的哪个的标准参数，默认dna。


# 传入参数示例：
1.使用JD的参数，开发JD的UI包
npm run prod/build -- --env.platform=jd env.protocol=jd

2.使用DNA的参数，开发JD的UI包
npm run prod/build -- --env.platform=jd
npm run prod/build -- --env.platform=jd env.protocol=dna