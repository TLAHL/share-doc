/**
 * Created by mdc on 2015/12/29.
 * 基于nw的本地交互的函数定义
 */
(function (window, undefined) {
    var indexFileName = process.mainModule.filename;

    //增加项目根目录
    window.rootPath = 'file:///' + process.mainModule.filename.substring(0, indexFileName.lastIndexOf('/'));

    //阻止文件拖拽进窗口
    window.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'none';
    }, false);

    window.addEventListener('drop', function (e) {
        e.preventDefault();
    }, false);


    document.addEventListener('dragstart', function (e) {

        var nodeName = e.target && e.target.nodeName.toUpperCase();
        if (nodeName == 'A' || nodeName == 'IMG') {
            e.preventDefault();
        }
    }, false);
    //防止页面的A和IMG被拖放


    var gui = require('nw.gui');
    var thisWindow = window.thisWindow = gui.Window.get();

    /**
     * 给输入框统一加入复制、粘贴、剪切右键菜单
     */
    function Menu() {
        this.menu = new gui.Menu();
        this.cut = new gui.MenuItem({
            label: '剪切',
            click: function () {
                document.execCommand('cut');
            }
        });

        this.copy = new gui.MenuItem({
            label: '复制',
            click: function () {
                document.execCommand('copy');
            }
        });

        this.paste = new gui.MenuItem({
            label: '粘贴',
            click: function () {
                document.execCommand('paste');
            }
        });

        this.menu.append(this.cut);
        this.menu.append(this.copy);
        this.menu.append(this.paste);
    }

    Menu.prototype.canCut = function (bool) {
        this.cut.enabled = bool;
    };

    Menu.prototype.canCopy = function (bool) {
        this.copy.enabled = bool;
    };

    Menu.prototype.canPaste = function (bool) {
        this.paste.enabled = bool;
    };

    Menu.prototype.popup = function (x, y) {
        this.menu.popup(x, y);
    };

    var contextmenu = new Menu();
    //给整个文档增加右键菜单
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        var target = e.target;
        var selectionType = window.getSelection().type.toUpperCase();

        if (target.nodeName && (target.nodeName.toUpperCase() == 'INPUT' && target.type === 'text') || target.nodeName.toUpperCase() == 'TEXTAREA') {
            var clipData = gui.Clipboard.get().get();
            if (target.readOnly) {
                contextmenu.canCut(false);
                contextmenu.canPaste(false);
            } else {
                contextmenu.canCut(selectionType === 'RANGE');
                contextmenu.canPaste(clipData.length > 0);
            }

            contextmenu.canCopy(selectionType === 'RANGE');
            contextmenu.popup(e.x, e.y);
        }
    }, false);

    /**
     * 关闭[指定]窗口
     * @param win
     */
    window.closeWindow = function (win) {
        win ? win.clsoe() : thisWindow.close();

    };

    /**
     * 关闭所有窗口
     * @param win
     */
    window.closeAllWindow = function () {
        gui.App.closeAllWindows();
    };

    /**
     * 最大化[指定]窗口
     * @param win
     */
    window.maxWindow = function (win) {
        win ? win.maximize() : thisWindow.maximize();
    };

    /**
     * 退出最大化[指定]窗口
     * @param win
     */
    window.unmaxWindow = function (win) {
        win ? win.unmaximize() : thisWindow.unmaximize();
    };

    /**
     * 最小化[指定]窗口
     * @param win
     */
    window.miniWindow = function (win) {
        win ? win.minimize() : thisWindow.minimize();
    };

    var fs = require('fs');

    /**
     * 文件操作,基于nodejs
     * @type {{copyFile: Function}}
     */
    window.nodefile = {

        /**
         * 复制文件, 此方法为异步操作
         * @param src 源文件目录
         * @param dest 复制到目标文件
         * @param callback 复制的回调,发生错误会有一个error参数
         */
        copyFile: function (src, dest, callback) {
            var callback = callback || function () {
                };

            fs.readFile(src, function (err, data) {
                if (err) {
                    return callback.call(this, err);
                }

                fs.writeFile(dest, data, function () {
                    if (err) {
                        return callback.call(this, err);
                    }

                    callback.call(this);
                });
            });
        },

        /**
         * 检查指定的文件是否存在, 此方法为同步操作
         * @param path 文件路径
         */
        isExists: function (path) {
            return fs.existsSync(path)
        },

        /**
         * 写入文本文件, 异步写入
         * @param path 文件路径
         * @param text 写入的文本
         * @param callback 写入文件的回调函数function(error)
         */
        writeTextFile: function (path, text, callback) {
            fs.writeFile(path, new Buffer(text, 'utf8'), callback);
        },

        /**
         * 生成缩略图,返回base64编码字符串
         * @param filePath文件路径
         * @param size 图片的长度和宽度,单位px
         * @param onscuccess 成功回调,函数参数base64字符串
         * @param onerror 错误回调函数
         */
        thumbImgage: function (filePath, size, onsuccess, onerror) {
            //计算高度和宽度的缩放结果
            var zoom = function (w, h) {
                var width = w, height = h;

                if (w >= h && w > size) { //宽 > 高
                    width = size;
                    height = size / w * h;
                } else if (w < h && h > size) {
                    height = size;
                    width = size / h * w;
                }

                return {width: width, height: height};
            };

            //图片加载完成
            var imageOnload = function () {
                var wh = zoom(img.width, img.height);

                var canvas = document.createElement('CANVAS');
                canvas.width = wh.width;
                canvas.height = wh.height;

                var context = canvas.getContext("2d");
                context.clearRect(0, 0, wh.width, wh.height);
                context.drawImage(img, 0, 0, wh.width, wh.height);
                if (onsuccess) {
                    var b64Img = canvas.toDataURL('image/png');
                    onsuccess(b64Img.substring(22), b64Img);
                }
            };

            var img = new Image();
            img.src = filePath;
            img.onload = imageOnload;
            img.onerror = onerror || function (e) {
                    return true;
                };
        },


        /**
         * 播放音频, 基于html5
         * @param options
         * @returns {{play: Function, pause: Function, stop: Function}}
         */
        playSong: function (options) {
            var noop = function () {
            };
            var defaults = {
                data:null,
                src: null, //声音源
                autoplay: false, //是否自动播放
                loop: false,//是否循环播放
                muted: false, //是否静音
                controls: false, //是否显示控制面板
                onplay: noop, //当播放时触发的事件
                onpause: noop, //当暂停时触发的事件
                onstop: noop, //当停止时触发的事件
                onerror: noop, //当发生错误时触发的事件
                onended: noop //当播放结束时触发的事件
            };

            options = options || {};
            for (var it in defaults) {
                if (typeof options[it] != 'undefined' && options[it] != null) defaults[it] = options[it];
            }

            var audio = new Audio();
            audio.preload = true;

            for (var it in defaults) {
                if (/^on/.test(it)) {
                    (function (fn, data) {
                        audio[it] = function (evt) {
                            fn.call(this, evt, data || audio.data);
                        };
                    })(defaults[it], defaults.data);

                } else {
                    audio[it] = defaults[it];
                }
            }

            return {
                play: function (src, data) { //播放
                    if (src && audio.currentSrc != src) {
                        var event = document.createEvent('HTMLEvents');
                        event.initEvent("stop", true, true);
                        event.eventType = 'stop';
                        audio.dispatchEvent(event);

                        audio.src = src;
                        audio.data = data;
                        audio.load();
                    }
                    if (!audio.paused) audio.currentTime = 0;
                    audio.play();
                },

                pause: function () { //暂停
                    audio.pause();
                },

                stop: function () { //停止
                    audio.load();
                }
            };

        }

    };

    /**
     * 对话框组件的封装
     * @param options
     * @returns {Window|*}
     */
    window.nwDialog = function (options) {
        var defaults = {
            maxAble: false, //是否显示最大化
            miniAble: false, //是否显示最小化
            closeAble: true, //是否显示关闭
            title: null,//标题
            buttons: [], //按钮列表
            content: '' //文档内容
        };

        angular.extend(defaults, options);
        defaults.args = defaults.args || {};

        angular.extend(defaults.args, {
            maxAble: defaults.maxAble,
            miniAble: defaults.miniAble,
            closeAble: defaults.closeAble,
            title: defaults.title,
            buttons: defaults.buttons,
            content: defaults.content //文档内容
        });

        return openWindow(defaults);
    };


    /**
     * 打开新窗体
     * @param options 配置项
     * @returns {Window|*}
     */
    window.openWindow = function (options) {
        var defaults = {
            frame: false,
            resizable: false,
            show_in_taskbar: false,
            toolbar: false,
            focus: true,
            alwaysOnTop: false,
            transparent: true,
            position: 'center',
            args: {}//向子页面传递的参数
        };

        angular.extend(defaults, options);
        var newWin = gui.Window.open(defaults.url, defaults);

        newWin.on('document-start', function () {
            newWin.window.window.args = defaults.args;
        });

        //置顶窗口
        if (defaults.alwaysOnTop)  newWin.setAlwaysOnTop(true);
        return newWin;
    };


    var shell = gui.Shell;
    //node-webkit扩展方法
    window.nw = {

        //alert
        alert: function (options) {
            var defaults = {
                title: '提示',
                okVal: '确定',
                ok: function (dialog) {
                    dialog.close();
                },
                width: 377,
                height: 200,
                max_width: 375,
                max_height: 200,
                url: rootPath + '/dialogs/simpleDialog.html'
            };

            angular.extend(defaults, options);

            defaults.buttons = defaults.buttons || [];
            //加入确定按钮
            defaults.buttons.splice(0, 0, {
                name: defaults.okVal,
                callback: defaults.ok,
                primary: true
            });

            return nwDialog(defaults);
        },


        //confirm
        confirm: function (options) {
            var defaults = {
                cancel: function (dialog) {
                    dialog.close();
                },
                cancelVal: '取消',
            };

            angular.extend(defaults, options);
            defaults.buttons = defaults.buttons || [];
            //加入确定按钮
            defaults.buttons.push(
                {
                    name: defaults.cancelVal,
                    callback: defaults.cancel,
                    primary: false
                }
            );

            return this.alert(defaults);
        },

        //通用对话框组件
        dialog: function (options) {
            options = options || {};
            var url = options.url;
            options.url = rootPath + '/dialogs/simpleDialog.html';

            options.args = options.args || {};
            options.args.url = url;

            return nwDialog(options)
        },

        /**
         * 打开另存为对话框
         * @param filename
         */
        openSaveAsDialog: function (filename, callback) {

            callback = callback || function () {
                };
            var fileDialog = document.getElementById('file-dialog');

            if (!fileDialog) {
                var input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('style', 'display: none');
                fileDialog = document.body.appendChild(input);
            }

            fileDialog.setAttribute('nwsaveas', filename);

            var handler = function () {
                if (this.files.length) {
                    var path = this.files[0].path;
                    setTimeout(function () {
                        callback.call(fileDialog, path);
                    }, 0);

                    fileDialog.value = '';
                }
                fileDialog.removeEventListener('change', handler, false);
            };

            fileDialog.addEventListener('change', handler, false);
            fileDialog.click();
        },

        /**
         * 用桌面系统默认的行为，在应用外部打开URI
         * @param url
         */
        openUrl: function (url) {
            url && shell.openExternal(decodeURIComponent(url||''));
        },

        /**
         * 以操作系统默认方式打开指定路径
         * @param path 文件路径
         */
        openFileByExternal: function (path) {
            path && shell.openItem(path);
        },

        /**
         * 在文件管理器中显示指定的文件
         * @param path
         */
        openInFolder: function (path) {
            path && shell.showItemInFolder(path);
        }
    };

    //剪切板
    var clipboard = gui.Clipboard.get();
    /**
     * 剪切板对象
     * @type {{setText: Function, getText: Function}}
     */
    window.clipboard = {
        /**
         * 设置剪切板的文本数据
         * @param text
         * @constructor
         */
        setText: function (text) {
            //目前只支持text
            clipboard.set(text, 'text');
        },

        /**
         * 获取剪切板数据
         */
        getText: function () {
            return clipboard.get('text')
        },

        /**
         * 清除剪贴板内容
         */
        clear: function () {
            clipboard.clear();
        }
    };

})(window);