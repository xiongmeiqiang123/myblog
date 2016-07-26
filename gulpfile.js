
var basePath = './myapp/public',
    rootPath = './myapp',
    jsPath   = basePath + '/js',
    libPath  = basePath + '/bower_components',
    cssPath  = basePath + '/css',
    sassPath = basePath + '/sass',
    distPath = basePath + '/dist',
    imgPatch = basePath + '/source',
    pagePath = basePath + '/page',
    demoPath = basePath + '/demo',
    mockPath = basePath + '/mock',
    currentPath  = process.env.PWD,
    templatePath = basePath + '/template';

var gulp = require('gulp-help')(require('gulp')),
    rev = require('gulp-rev'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    babel = require('gulp-babel'),
    colors = require('colors'),
    cssmin = require('gulp-cssmin'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    stylish = require('jshint-stylish'),
    replace = require('gulp-html-replace'),
    connect = require('gulp-connect'),
    htmlmin = require('gulp-htmlmin'),
    combiner = require('stream-combiner2'),
    livereload = require('gulp-livereload'),
    revReplace = require('gulp-rev-replace'),
    sourcemaps = require('gulp-sourcemaps'),
    amdOptimize = require('gulp-amd-optimizer');

var Mock = require(bowerPath + '/mockjs/dist/mock-min.js');
    // config = require(basePath + '/config.json'),
    // router = require(mockPath + '/router.json');
var Random = Mock.Random;

Random.email();
Random.paragraph(1, 3);
Random.word( 1,2);
Random.cparagraph( 1, 3 );
Random.city();
Random.province();
Random.county();
Random.cname();
Random.url();
Random.cword(3, 5);
Random.csentence();
Random.color();
Random.image();
Random.now();
Random.date();
Random.increment();
Random.guid();



var fs = require('fs');

//设置terminal打印颜色
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

gulp.task('watch', 'watch files` change '.info, function(){

    livereload.listen();

    gulp.watch(sassPath + '/**/*.scss', ['sass'], function() {

    });

    gulp.watch(jsPath + '/**/*.js', function() {
        gulp.src(jsPath + '/**/*.js').pipe(livereload());

    });

    gulp.watch(pagePath + '/**/*.html', function() {
        gulp.src(pagePath + '/**/*.html').pipe(livereload());
    });

});

gulp.task('sass','编译 scss文件'.info , function() {
    return gulp.src(sassPath + '/**/*.scss') //该任务针对的文件
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))//该任务调用的模块
        .pipe(gulp.dest(cssPath)) //生成css
        .pipe(livereload())
});//sass


gulp.task('css','dist to css'.info , ['sass'], function() {
    return gulp.src(cssPath + '/**/*.css') //该任务针对的文件
        .pipe(cssmin())
        //.pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(distPath + '/css'))//将会在src/css下生成index.css
        .pipe(livereload())
});//sass

gulp.task('lintJs', function(){
    return gulp.src(jsPath + '/**/*.js')
        //.pipe(jscs())   //检测JS风格
        .pipe(jshint({
            "undef": false,
            "unused": false
        }))
        //.pipe(jshint.reporter('default'))  //错误默认提示
        .pipe(jshint.reporter(stylish))   //高亮提示
        .pipe(jshint.reporter('fail'));
});

gulp.task('page', 'minify the HTML pages'.info, function(){
    return gulp.src(pagePath + '/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(distPath + '/page'))
        .pipe(livereload());
});

gulp.task('img', 'dest img to dist'.info, function() {
    return gulp.src(imgPatch + '/*')
        .pipe(gulp.dest(distPath + '/source'))
        .pipe(livereload());
});//img

gulp.task('lib', 'dest lib to dist'.info, function() {
    return gulp.src(libPath + '/*')
        .pipe(gulp.dest(distPath + '/lib'))
        .pipe(livereload());
});//lib


// gulp.task('tpl', 'build tpl to HTML'.info, function() {

//     gulp.src(demoPath + '/**/*.html')
//         .pipe(replace({
//                 header: getFile(templatePath + '/header.tpl'),
//                 footer: getFile(templatePath + '/footer.tpl'),
//                 indexShow: getFile(templatePath + '/indexShow.tpl'),
//                 js: config.js,
//                 css: config.css
//             },
//             {
//                 keepBlockTags: true
//             }))
//         .pipe(gulp.dest(distPath + '/demo'))
//         .pipe(gulp.dest(basePath + '/demo'))
//         .pipe(livereload());
// });

//在当前目录新建模板
gulp.task('buildTpl', 'create HTML page base on tpl'.info, function() {

    console.log('在当前文件夹下根据tpl模板创建html文件 ----------------'.info);
    console.log('请指定tpl类型和命名.格式为: gulp buildTpl --tpl type1 --name test -----------'.info);

    var tpl  = getArg('--tpl');
    var name = getArg('--name');

    if(!tpl) {
        console.log('lack of tpl'.error);
        return;
    }

    if(!name) {
        console.log('lack of name'.error);
        return;
    }

    var dirList = fs.readdirSync(templatePath);
    tpl     = dirList.filter(function(num){ return num.match(tpl)});

    if(tpl.length > 1) { //如果匹配的模板不止一个
        console.log('匹配的模板超过一个,精确匹配 : -------------'.error);
        console.log(tpl)
        return;
    }

    if(tpl.length) {
        gulp.src(templatePath + '/' + tpl[0])
            .pipe(rename({
                extname: '.html',
                basename: name,
            }))
            .pipe(gulp.dest(currentPath));
        gulp.run('tpl');
    }else {
        console.log('没有匹配的模板 -------'.error)
    }


});//build

//编译ES6到ES5
gulp.task('ES6', 'translate ES6 to javascript 2015'.info, function() {
    return gulp.src(jsPath + '/**/*.ES6.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(distPath + '/js/ES6'))
});

gulp.task('mock', 'mock'.info, function() {
    var isMock = getArg('--mock');
    if(isMock == 'true'){
        gulp.src(rootPath + '/**/*.jsp')
    }else {

    }
    return gulp.src(mockPath + '/**/*.json')
        .pipe(livereload());
});


gulp.task('connect', 'start main web server'.info,['watch'], function() {

    //拦截ajax请求, router是映射, 用mock数据响应
    // var express = require('express');
    // var app = express();
    // for(var i in router) {
    //     var resText =  require(mockPath + '/' + router[i].pageName + '.json');
    //     if(resText.test) resText = resText.test;
    //     if(router[i].method == 'get'){
    //         app.get(i , function(req, res) {
    //             var url = req.url.split('?')[0];
    //             var text = require(mockPath + '/' + router[url].pageName + '.json').test ||
    //                 require(mockPath + '/' + router[url].pageName + '.json');
    //             res.send(Mock.mock(text));
    //         });
    //     }
    //     if(router[i].method == 'post'){
    //         app.post(i , function(req, res) {
    //             var url = req.url.split('?')[0];
    //             var text = require(mockPath + '/' + router[url].pageName + '.json').test ||
    //                 require(mockPath + '/' + router[url].pageName + '.json');
    //             res.send(Mock.mock(text));
    //         });
    //     }
    // }

    connect.server({
        root: rootPath,
        port: 8088 ,
        livereload: true,
        // middleware: function(connect, opt) {
        //     return [app];
        // }
    });
});

gulp.task('default', 'defalt task: connect & watch'.info, ['connect'], function() {

});



gulp.task('revision', 'tab the version of the source'.info, ['clean', 'css', 'inject', 'concat'], function(){
    return gulp.src([distPath + '/**/*.css', distPath + '/**/*.js'])
        .pipe(rev())
        .pipe(gulp.dest(distPath))
        .pipe(rev.manifest())
        .pipe(gulp.dest(basePath + '/rev'))
});

// gulp.task('inject', function () {
//     var type1 = getFile(templatePath + '/type1.tpl');
//     var type2 = getFile(templatePath + '/type2.tpl');
//     var type3 = getFile(templatePath + '/type3.tpl');
//     var type4 = getFile(templatePath + '/type4.tpl');
//     var type5 = getFile(templatePath + '/type5.tpl');
//     console.log(config.js)
//     gulp.src(pagePath + '/**/*.html')
//         .pipe(replace({
//                 js: config.js,
//                 css: config.css,
//                 //type1: type1,
//                 //type2: type2,
//                 //type3: type3,
//                 //type4: type4,
//                 //type5: type5
//             },
//             {
//                 keepBlockTags: true
//             }))
//         .pipe(gulp.dest(basePath + '/page'))
//         .pipe(livereload());
// });

gulp.task('revreplace', 'replace the source version in html'.info , ['revision'], function() {
    var manifest = gulp.src(basePath + '/rev/rev-manifest.json');

    return gulp.src(basePath + '/page/index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest(distPath + '/page'));
});

gulp.task('clean', 'remove all files in dist folder'.info, function() {
    gulp.src([distPath], {read: false})
        .pipe(clean());
});

gulp.task('concat','join js together'.info, function () {
    var source = config.concat;

    source.forEach(function (item) {
        gulp.src(basePath + item.src)
            // Traces all modules and outputs them in the correct order.
            .pipe(amdOptimize({
                baseUrl: ''
            }))
            .pipe(concat(item.distName))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(distPath + item.dist));
    });
});

function getFile(url){
    if(url) return fs.readFileSync(url, 'utf8');
    return '';
}

function getArg(key) {

    var index = process.argv.indexOf(key);
    var next = process.argv[index + 1];
    return (index < 0) ? null : (!next || next[0] === '-') ? null : next;

}