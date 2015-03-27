//借用apicloud的fs模块操作本地文件，实现设置和获取一些缓存信息，基本没什么特别的，主要是可以设置缓存时间（单位秒）。
//调用方法：设置缓存Cache.set(key,value,expire);删除缓存Cache.rm(key);获取缓存Cache.get(key,success);
var Cache = {
	get : function(key, success) {
		var content = '';
		var fs = api.require('fs');
		// 判断缓存文件是否存在
		fs.exist({
			path : 'cache://' + key + '.txt'
		}, function(ret, err) {
			if (ret.status) {
				if (!ret.exist) {//如果文件不存在直接返回空
					success(content);
				} else {
					// 打开文件
					fs.open({
						path : 'cache://' + key + '.txt',
						flags : 'read_write'
					}, function(ret, err) {
						if (ret.status) {
							// 读取文件
							fs.read({
								fd : ret.fd,
								offset : 0,
								length : 0
							}, function(ret, err) {
								if (ret.status) {
									// api.alert({msg:ret.data});
									content = ret.data;
									var expire = parseInt(content.substr(0, 12));
									fs.getAttribute({
										path : 'cache://' + key + '.txt'
									}, function(ret, err) {
										if (ret.status) {
											var modify_time = ret.attribute.modificationDate;
											if (expire != 0 && parseInt((new Date().getTime() - modify_time) / 1000) > expire) {
												//缓存过期删除缓存文件
												Cache.rm(key);
											} else {
												content = content.substr(12);
											}
											// 把结果当回调函数参数传出
											success(content);
										} else {
											api.alert({
												msg : err.msg
											});
										}
									});
								} else {
									api.alert({
										msg : err.msg
									});
								}
							});
						} else {
							api.alert({
								msg : err.msg
							});
						}
					});
				}
			}
		});

	},
	set : function(key, value, expire) {
		var data = JSON.stringify(value);
		data = pad(expire, 12) + data;
		var fs = api.require('fs');
		// 判断缓存文件是否存在
		fs.exist({
			path : 'cache://' + key + '.txt'
		}, function(ret, err) {
			if (ret.status) {
				if (!ret.exist) {//如果文件不存在
					// 创建文件
					fs.createFile({
						path : 'cache://' + key + '.txt'
					}, function(ret, err) {
						var status = ret.status;
						if (status) {
							// api.alert({msg:'创建文件成功'});
							writeFs(key, data);
						}
					});
				} else {
					writeFs(key, data);
				}
			} else {
				api.alert({
					msg : err.msg
				});
			}
		});
		function writeFs(key, data) {
			// 打开文件
			fs.open({
				path : 'cache://' + key + '.txt',
				flags : 'read_write'
			}, function(ret, err) {
				if (ret.status) {//文件打开成功
					// 写文件
					fs.write({
						fd : ret.fd,
						data : data,
						offset : 0
					}, function(ret, err) {
						if (ret.status) {
							api.alert({
								msg : 'write操作成功'
							});
						} else {
							api.alert({
								msg : err.msg
							});
						}
					});
				} else {
					api.alert({
						msg : err.msg
					});
				}
			});
		}

	},
	rm : function(key) {
		var fs = api.require('fs');
		// 判断缓存文件是否存在
		fs.exist({
			path : 'cache://' + key + '.txt'
		}, function(ret, err) {
			if (ret.status) {
				if (ret.exist) {//如果文件存在
					fs.remove({
						path : 'cache://' + key + '.txt'
					}, function(ret, err) {
						var status = ret.status;
						if (status) {
							api.alert({
								msg : '删除文件成功'
							});
						} else {
							api.alert({
								msg : err.msg
							});
						};
					});
				}
			}
		});
	}
}
// 填充数字num到n位，前面补0
function pad(num, n) {
	var len = num.toString().length;
	while (len < n) {
		num = "0" + num;
		len++;
	}
	return num;
}
