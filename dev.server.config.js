function Config(){
    
    var files = {
        '/users/*':{},
        '/file/*':{},
        '/order/*':{},
        '/product/*':{},
        '/operations/*':{},
        '/api/*':{},
        '/*/*':{},
    }

    for(var i in files){
        files[i].target ="http://icy.iidingyun.com/"
        files[i].changeOrigin = true;
    }
    return {
        port: 8081,
        disableHostCheck:true,
        historyApiFallback: true,
        hot: true,
        inline: true,
        stats: { colors: true },
        proxy: files
    }
}

module.exports =  Config();