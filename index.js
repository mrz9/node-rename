var fs = require("fs");
var path = (process.argv[2]) ? process.argv[2]+'/' : __dirname+'/tmp/';

fs.exists(path,function(flag){
	if(flag){
		fs.realpath(path, function (err, resolvedPath) {
		  if (err) throw err;
		  	path = resolvedPath+'/';
		  	start();
		});
	}
})

var start = function(){
	fs.readdir(path,function(err,files){
		if(err) return console.error(err);
		var promislist = [];
		var index = 0;
		var length = files.length;
		files.forEach(function(file){
			++index;
			var suffix = file.split('.').pop();
			var newName = path+Date.now()+parseInt(Math.random()*1000)+'.'+suffix;

			(function(i){fs.stat(path+file, function (err, stats) {
			    if(stats.isFile()){
			    	promislist.push(rename(path+file,newName));
			    }
			    if(i == length){
					Promise.all(promislist).then(function(list){
						console.log(list);
					});
			    }
			})})(index);
		});

	})
}

var rename = function(oldPath,newPath){
	return new Promise(function(resolve,reject){
		fs.rename(oldPath,newPath,function(err){
			if(err) reject(err);
			resolve(true);
		})
	});
}

