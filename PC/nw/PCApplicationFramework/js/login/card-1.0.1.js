(function (win){
	

	var Const = {

		lowestVersion:'3.0.2.11',
		

		version: '3.0.2.11',
		

		readyConst : {

			pluginId:'mdc-card-pluginXdja',
			getEmbed:function (){return '<embed width="0" style="margin:0;padding:0;position: fixed; filter: alpha(opacity=0);" height="0" type="application/NPCardCert" id="' + this.pluginId + '" />'}
		},
		

		errorDesc : {
		},
		
		cardUsage : {
			X_CARD_USAGE_ADMIN : 0, //0-管理卡
			X_CARD_USAGE_USER : 1, //1-用户卡
			X_CARD_USAGE_All : -1 //所有
		}
	};
	
	win.Card = win.Card || {};

	var noop = function(){};
	

	function compareVersion(currentVersion, version) {
		if(currentVersion == version) return 0;

		var currentVersionArray = currentVersion.split('.');
		var versionArray = version.split('.');	
		var len1 = currentVersionArray.length;
		var len2 = versionArray.length;

		if (len1 == len2){
			for (var i = 0; i < len1; i++){
				if (currentVersionArray[i] - versionArray[i] > 0){
					return 2;
				}

				if (currentVersionArray[i] - versionArray[i] < 0){
					return 1;
				}
			 }
		}

		if (len1 < len2) return 1;
		if (len1 > len2) return 2;
		return 0;
	}
	

	function getExCode(ex){

		if(typeof ex.number != 'undefined') return ex.number-0;

		if(typeof ex.message!= 'undefined') return ex.message-0;

		return ex-0;
	}


	function readCard(cardType, cardUsage, callback){
		if(typeof callback != 'function') callback = noop;
		
		var ret;
		try { 
			var cardNos = plugin.card().GetAllCards(cardType, cardUsage);
			cardNos = cardNos? cardNos.split('#') : [];
			
			ret = new CertWrap(cardNos);
		}catch(e) {
			var code = getExCode(e);
			ret = {isException:true, code:code};
		}
		callback.call(ret, ret);
		return ret;
	}

	function getPinResult(fn, context, callback){
		if(typeof callback != 'function') callback = noop;
		
		var ret, lockError = {'-10':true, '-16':true, '-4':true, '-5':true};
		try { 
			var result = fn.call(context, plugin.card());
			var time = result.time - 0;
			if(result.pinTry) {
				ret = time>0?{success:true, code:time, isLock:false}:{success:false, code:time, message:Const.errorDesc[time]||'未知错误', isLock:!!lockError[time]};
			} else {
				ret = time?{success:false, code:time, message: Const.errorDesc[time] || 'PIN码错误', isLock:!!lockError[time]} : {success:true, isLock:false};
			}
		} catch(e) {
			var code = getExCode(e);
			ret = {success:false, code:code, message: Const.errorDesc[code] || '未知错误', isLock:!!lockError[code], ex:e};
		}
		
		callback.call(context, ret);
		return ret;
	}

	function pullCard(cardId, callback, isHandle){
		if(typeof callback != 'function') callback = noop;
		if(!cardId) throw new Error('cardId为必须参数');
		var handle, ret = {stop:noop}, error = false;
		
		if(isHandle) {
			handle = cardId;
		} else {
			try {
				if ((handle = plugin.card().GetCardHandle(cardId)) == -1) error = true;
			} catch (e) {
				error = true;
			}
			
			if(error){
				callback.call(ret, ret);
				return ret;
			}
		}
		
		var timer, fn = function(){
			try {
				if(!plugin.card().GetCosVer(handle)) error = true; //没有获取到CosVer
			} catch (e) {
				error = true;
			}
			
			if(error){
				clearInterval(timer);
				callback.call(ret, ret);
			}
		};
		
		timer = setInterval(fn, 800);
		fn();
		ret.stop = function(){if(timer) clearInterval(timer);};
		return ret; //停止检测
	}
	
	function fnCaller(fn, ctx, callback){
		if(typeof callback != 'function') callback = noop;
		var ret;
		
		try {
			ret = fn.call(ctx, plugin.card());
		} catch (e) {
			var code = getExCode(e);
			ret = {success:false, code:code, message:Const.errorDesc[code] || '未知错误', ex: e};
		}
		
		callback.call(ctx, ret);
		return ret;
	}
	

	var plugin = (function(d){
		var cardWrap = new CardWrap();
		cardWrap.success = false;
		var cardCertObj, activeX = false;
		
		if(typeof safekey == "object") {
			cardCertObj = safekey;
		}  else {
			if (!!window.ActiveXObject || 'ActiveXObject' in window) {
				activeX = true;
				try {
					cardCertObj = new ActiveXObject("CardCert.WriteCard");
				} catch (e) {
					return {error:{success:false, code:0, message:Const.readyConst[0]}, cardWrap:cardWrap, ex:e};
				}
			} else {
				d.write(Const.readyConst.getEmbed());
				var cardCertObj = d.getElementById(Const.readyConst.pluginId);
				
				if(!cardCertObj.Test) {
					return {error:{success:false, code:0, message:Const.readyConst[0]}, cardWrap:cardWrap};
				}
			}
		}
		
		var ver = cardCertObj.Test();
		if(compareVersion(ver, Const.lowestVersion) == 1) { //小于最低版本号
			return {error:{success:false, code:3, message:Const.readyConst[3]}, cardWrap:cardWrap};
		} 

		cardWrap.newVer = compareVersion(ver, Const.version) == 1;
		cardWrap.success = true;
		return {cardWrap:cardWrap, card : function(){return cardCertObj;}, activeX:activeX};
	})(document);
	

	var inited;

	win.Card.ready = function (callback){
		if(typeof callback != 'function') callback = noop;
		
		if(plugin.error) {
			callback.call(plugin.error, plugin.error);
			return plugin.error;
		}
		
		callback.call(plugin.cardWrap, {success:true});
		return plugin.cardWrap;
	};
	
	function CertKit(cardNo){

		this.getCardId = function(){return cardNo;};
	}
	

	CertKit.prototype.getCardInfo = function(callback){
		var fn = function(plugin){
			var info = plugin.GetCardInfo(this.getCardId()).split('#');
			return {type:info[0], usage:info[1], container:info.length == 3? info[2].match(/\d{1}/g):[]};
		};
		return fnCaller(fn, this, callback);
	};
	

	CertKit.prototype.getCert = function (containerId, callback){
		var fn = function(plugin){
			var cert = plugin.GetCert(this.getCardId(), containerId);
			return {success:true, cert:cert};
		};
		return fnCaller(fn, this, callback);
	};
	

	 CertKit.prototype.getCertEx = function(containerId, certType, callback) {
		var fn = function(plugin){
			var cert = plugin.GetCertEx(this.getCardId(), containerId, certType);
			return {success:true, cert:cert};
		};
		return fnCaller(fn, this, callback);
	};
	

	function CosWrap(handle){
		this.handle = handle;
	}


	CosWrap.prototype.getCosVer = function (callback){
		var fn = function(plugin){
			var version = plugin.GetCosVer(this.handle);
			return {success:true, version:version};
		};
		return fnCaller(fn, this, callback);
	};
	

	CertKit.prototype.getHandle = function(callback) {
		if(typeof callback != 'function') callback = noop;

		var ret, handle;
		try {
			handle = plugin.card().GetCardHandle(this.getCardId());
			ret = {success:true, handle:handle};
		} catch (e) {
			var code = getExCode(e);
			ret = {success:false, code:code, message:Const.errorDesc[code] || '未知错误', ex:e};
		}
		
		callback.call(handle? new CosWrap(handle):this, ret);
		return ret;
	};


	CertKit.prototype.checkPin = function (pin, callback){
		return this.checkPinEx(pin, 0x11, callback);
	};


	CertKit.prototype.checkPinEx = function (pin, role, callback){
		if(!pin) throw new Error('pin为必须参数');
		return getPinResult(function(card){return {time:card.SafePin(this.getCardId(), pin, role)};}, this, callback);
	};

	CertKit.prototype.safeChangePin = function (oldPin, newPin, callback){
		return this.safeChangePinEx(oldPin, newPin, 0x11, callback);
	};
	

	CertKit.prototype.safeChangePinEx = function (oldPin, newPin, role, callback){
		return getPinResult(function(card){return {time:card.SafeChangePin(this.getCardId(), oldPin, newPin, role)};}, this, callback);
	};
	

	CertKit.prototype.importCert = function (containerId, certType, callback){
		return this.importCertEx(containerId, certType, 0x11, callback);
	};
	

	CertKit.prototype.importCertEx = function (containerId, certType, role, callback){
		var fn = function(plugin){
			plugin.ImportKeyCertEx(this.getCardId(), '111111', role, containerId, certType);
			return {success:true};
		};
		return fnCaller(fn, this, callback);
	};


	CertKit.prototype.setCardId = function (callback){
		var fn = function(plugin){
			plugin.SetCardId(this.getCardId());
			return {success:true};
		};
		return fnCaller(fn, this, callback);
	};
	

	CertKit.prototype.getPinTryCount = function(callback) {
		return this.getPinTryCountEx(0x11, callback);
	};
	

	CertKit.prototype.getPinTryCountEx = function(role, callback) {
		return getPinResult(function(card){return {time:card.GetPinTryCount(this.getCardId(), role), pinTry:true};}, this, callback);
	};


	CertKit.prototype.unlockCodePin = function(unlockCode, newPin, role, callback){
		return this.unlockCodePinEx(unlockCode, newPin, 0x11, callback);
	};
	

	CertKit.prototype.unlockCodePinEx = function(unlockCode, newPin, role, callback){
		var fn = function(plugin){
			var code = plugin.ReloadPIN(this.getCardId(), unlockCode, role, newPin) - 0;
			return code?{success:false, code: code, message: Const.errorDesc[code]||'未知错误'}:{success:true};
		};
		return fnCaller(fn, this, callback);
	};
	

	CertKit.prototype.genKeypair = function(password, containerid, alg, certusage, keybits, callback){
		var fn = function(plugin){
			var publicKey = plugin.GenKeypair(this.getCardId(), password, containerid, alg, certusage, keybits);
			return {success:true, publicKey:publicKey};
		};
		return fnCaller(fn, this, callback);
	};
	

	CertKit.prototype.genKeypairRSA = function(password, containerid, certusage, callback) {
		if(typeof containerid == 'function'){
			callback = containerid;
			containerid = null;
		} else if(typeof certusage == 'function'){
			callback = certusage;
			certusage = null;
		} 
		return this.genKeypair(password, containerid||0, 0, certusage||0, 1024, callback);
	};
	

	CertKit.prototype.genKeypairSM2 = function(password, containerid, certusage, callback) {
		if(typeof containerid == 'function'){
			callback = containerid;
			containerid = null;
		} else if(typeof certusage == 'function'){
			callback = certusage;
			certusage = null;
		}
		return this.genKeypair(password, containerid || 0, 1, certusage || 0, 256, callback);
	};
	

	CertKit.prototype.writeCert = function(password, containerid, certusage, cert, callback){
		var fn = function(plugin){
			plugin.WriteCert(this.getCardId(), password, containerid, certusage, cert);
			return {success:true};
		};
		return fnCaller(fn, this, callback);
	};
	

	CertKit.prototype.writeCertEx = function(password, containerid, certusage, cert, callback){
		var _cert = cert;
		if(typeof containerid == 'string'){
			_cert = containerid;
			containerid = null;
			if(typeof certusage == 'function'){
				callback = certusage;
				certusage = null;
			}
		} else if(typeof certusage == 'string'){
			_cert = certusage;
			if(typeof cert == 'function') callback = cert;
			certusage = null;
			cert = null;
		}
		return this.writeCert(password, containerid||0, certusage||0, _cert, callback);
	};
	

	CertKit.prototype.writeGateCert = function(password, cert, callback){
		var fn = function(plugin){
			plugin.WriteGateCert(this.getCardId(), password, cert);
			return {success:true};
		};
		return fnCaller(fn, this, callback);
	};
	

	CertKit.prototype.writeGateCertEx = function(password, cert, cert2, callback){
		var fn = function(plugin){
			plugin.WriteGateCertEx(this.getCardId(), password, cert, cert2);
			return {success:true};
		};
		return fnCaller(fn, this, callback);
	};
	

	CertKit.prototype.importAsymKey = function(role, pin, container, alg, usage, privateKey, callback){
		var fn = function(plugin){
			var str = plugin.ImportAsymKey(this.getCardId(), role, pin, container, alg, usage, privateKey);
			return {success:true};
		};
		return fnCaller(fn, this, callback);
	};
	

	CertKit.prototype.asymDecryption = function(role, pin, container, alg, usage, inBase64, certBase64, callback) {
		var fn = function(plugin){
			var str = plugin.AsymDecryption(this.getCardId(), role, pin, container, alg, usage, inBase64, certBase64);
			return {success:!!str, dekuep:str};
		};
		return fnCaller(fn, this, callback);
	};
	

	CertKit.prototype.cardSign = function(role, pin, container, alg, usage, inData, dataType, callback){
		var fn = function(plugin){
			var str = plugin.CardSign(this.getCardId(), role, pin, container, alg, usage, inData, dataType);
			return {success:!!str, signature:str};
		};
		return fnCaller(fn, this, callback);
	};
	

	CertKit.prototype.cardRSASign = function(pin, container, usage, inData, callback){
		return this.cardSign(0x11, pin, container, 0, usage, inData, 1, callback);
	};
	

	CertKit.prototype.cardSM2Sign = function(pin, container, usage, inData, callback){
		return this.cardSign(0x11, pin, container, 1, usage, inData, 1, callback);
	};
	

	CertKit.prototype.cardSha1RSASign = function(pin, container, usage, inData, callback){
		return this.cardSign(0x11, pin, container, 0, usage, inData, 0, callback);
	};
	

	CertKit.prototype.cardSha1SM2Sign = function(pwd, container, usage, inData, callback){
		return this.cardSign(0x11, pwd, container, 1, usage, inData, 0, callback);
	};
	

	CertKit.prototype.onpullcard = function(callback){
		return pullCard(this.getCardId(), callback);
	};

	function CertWrap(cardNos){
		for(var i = 0; i < cardNos.length; i++ ) {
            this[i] = new CertKit(cardNos[i]);
        }
        this.length = cardNos.length;
	}
	

	CertWrap.prototype.each = function (callback){
		if(typeof callback == 'function') {
			for (var i = 0; i < this.length; i++) {
				callback.call(this[i], i, this[i]);
			}
		}
		return this;
	};
	

	CertWrap.prototype.push = function(certWrap) {
		if(!certWrap || !certWrap.length) return this;
		var len = this.length;
		
		for (var i = 0; i < certWrap.length; i++) {
			this[len++] = certWrap[i];
		}
		this.length = this.length + certWrap.length;
		return this;
	};


	function CardWrap(){}
	

	CardWrap.prototype.onpullcard = function(cardId, callback){
		return pullCard(cardId, callback);
	};
	

	CardWrap.prototype.onpullhandle = function(handle, callback){
		return pullCard(handle, callback, true);
	};
	

	CardWrap.prototype.readUserCard = function (callback){
		return readCard.call(this, -1, Const.cardUsage.X_CARD_USAGE_USER, callback);
	};

	CardWrap.prototype.readUserACE = function (callback){
		return readCard.call(this, 2, Const.cardUsage.X_CARD_USAGE_USER, callback);
	};
	
	CardWrap.prototype.readUserTFCard = function (callback){
		return readCard.call(this, 0, Const.cardUsage.X_CARD_USAGE_USER, callback);
	};
	
	CardWrap.prototype.readUserUSBKeyCard = function (callback){
		return readCard.call(this, 1, Const.cardUsage.X_CARD_USAGE_USER, callback);
	};

	CardWrap.prototype.readAdminCard = function (cardType, callback){
		return readCard.call(this, -1, Const.cardUsage.X_CARD_USAGE_ADMIN, callback);
	};

	CardWrap.prototype.readAdminTFCard = function (cardType, callback){
		return readCard.call(this, 0, Const.cardUsage.X_CARD_USAGE_ADMIN, callback);
	};

	CardWrap.prototype.readAdminUSBKeyCard = function (cardType, callback){
		return readCard.call(this, 1, Const.cardUsage.X_CARD_USAGE_ADMIN, callback);
	};

	CardWrap.prototype.showMsgTip = function (message, time, type, callback){
		var fn = function(plugin){
			plugin.ShowMsgTip(message, time, type);
			return {success:true};
		};
		return fnCaller(fn, this, callback);
	};
	
	CardWrap.prototype.getCard = function(callback){
		var fn = function(plugin){
			return {success:true, cardId:plugin.GetCardId()};
		};
		return fnCaller(fn, this, callback);
	};

	CardWrap.prototype.cardKit = function(cardNo){
		return new CertKit(cardNo);
	};
	
	CardWrap.prototype.asymDecryption = function(cardId, role, pin, container, alg, usage, inBase64, certBase64, callback) {
		var fn = function(plugin){
			var str = plugin.AsymDecryption(cardId, role, pin, container, alg, usage, inBase64, certBase64);
			return {success:!!str, dekuep:str};
		};
		return fnCaller(fn, this, callback);
	};

	CardWrap.prototype.countACE = function(callback){
		var fn = function(plugin){
			return {success:true, count:plugin.EnumACE() || 0};
		};
		return fnCaller(fn, this, callback);
	};

	CardWrap.prototype.connectACE = function(callback){
		var fn = function(plugin){
			var str = plugin.ConnectACE();
			return {success:str == undefined? false : !!!str};
		};
		return fnCaller(fn, this, callback);
	};

	CardWrap.prototype.uninstallApk = function(callback){
		var fn = function(plugin){
			plugin.UnInstallApk();
			return {success:true};
		};
		return fnCaller(fn, this, callback);
	};
	
})(window);