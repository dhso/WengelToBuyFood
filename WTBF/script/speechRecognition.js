function openSpeechRecognizer() {
	var obj = api.require('speechRecognizer');
	obj.record({
		vadbos : '5000',
		vadeos : '5000',
		rate : '16000',
		asrptt : '1',
		audioPath : ''
	}, function(ret, err) {
		if (ret.status) {
			document.getElementById("recordStr").innerText = ret.wordStr;
		}
	});

	// 如果用户添加了录音标识,则显示.
	obj.showRecordHUD();

};
function stopSpeechRecognizer() {
	var obj = api.require('speechRecognizer');
	obj.stopRecord();

	// 隐藏录音标识.
	obj.hideRecordHUD();
};
function cancelSpeechRecognizer() {
	var obj = api.require('speechRecognizer');
	obj.cancel();
};

//语音合成
function playSpeechRecognizer() {
	var obj = api.require('speechRecognizer');
	obj.read({
		speed : '60',
		volume : '60',
		voice : '0',
		rate : '16000',
		audioPath : '',
		readStr : ''
	}, function(ret, err) {
		if (ret.status) {
			document.getElementById("progress2").value = ret.speakProgress;
		} else {
			api.alert({
				msg : err.msg
			});
		}
	});
};

function pauseSpeechRecognizer() {
	var obj = api.require('speechRecognizer');
	obj.pause();
};
function resumeSpeechRecognizer() {
	var obj = api.require('speechRecognizer');
	obj.resume();
};
function stopSpeechRecognizer() {
	var obj = api.require('speechRecognizer');
	alert(JSON.stringify(obj));
	obj.stopRead();
};
function addSpeechHUD() {
	var obj = api.require('speechRecognizer');
	obj.addRecordHUD();
}