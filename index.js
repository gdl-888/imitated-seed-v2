// 병아리 엔진: 개인 the seed 모방 프로젝트

const perms = [
	'admin', 'ipacl', 'suspend_account', 'developer', 'hideip', 'update_thread_document',
	'update_thread_status', 'update_thread_topic', 'hide_thread_comment', 'grant',
	'editable_other_user_document', 'no_force_recaptcha', 'disable_two_factor_login',
	'login_history', 'delete_thread', 'nsacl'
];

function print(x) { console.log(x); }
function prt(x) { process.stdout.write(x); }

function beep(cnt = 1) { // 경고음 재생
	for(var i=1; i<=cnt; i++)
		prt("");
}

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function rndval(chars, length) {
	var result           = '';
	var characters       = chars;
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

const timeFormat = 'Y-m-d H:i:s';

const inputReader = require('wait-console-input'); // 입력받는 라이브러리

function input(p) {
	prt(p); // 일부러 이렇게. 바로하면 한글 깨짐.
	return inputReader.readLine('');
}

const exec = eval;

const { SHA3 } = require('sha3');
 
const hash = new SHA3(512);

function sha3(p) {
	hash.update(p);
	return hash.digest('hex');
}

// VB6 함수 모방
function Split(str, del) { return str.split(del); }; const split = Split;
function UCase(s) { return s.toUpperCase(); }; const ucase = UCase;
function LCase(s) { return s.toUpperCase(); }; const lcase = LCase;

const sqlite3 = require('sqlite3').verbose(); // SQLite 라이브러리 호출
const conn = new sqlite3.Database('./wikidata.db', (err) => {}); // 데이타베이스 연결

// 파이선 SQLite 모방
conn.commit = function() {};
conn.sd = [];

const curs = {
	execute: function executeSQL(sql = '', params = []) {
		return new Promise((resolve, reject) => {
			if(UCase(sql).startsWith("SELECT")) {
				conn.all(sql, params, (err, retval) => {
					if(err) return reject(err);
					conn.sd = retval;
					resolve(retval);
				});
			} else {
				conn.run(sql, params, err => {
					if(err) return reject(err);
					resolve(0);
				});
			}
		});
	},
	fetchall: function fetchSQLData() {
		return conn.sd;
	}
};
const express = require('express');
const session = require('express-session');
const swig = require('swig'); // swig 호출

const wiki = express();

function getTime() { return Math.floor(new Date().getTime()); }; const get_time = getTime;

function toDate(t) {
	var date = new Date(Number(t));
	
	var hour = date.getHours(); hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes(); min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds(); sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1; month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate(); day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}

function generateTime(time, fmt) {
	const d = split(time, ' ')[0];
	const t = split(time, ' ')[1];
	
	return `<time datetime="${d}T${t}.000Z" data-format="${fmt}">${time}</time>`;
}

generateTime.safe = true;

swig.setFilter('encode_userdoc', function encodeUserdocURL(input) {
	return encodeURIComponent('사용자:' + input);
});

swig.setFilter('encode_doc', function encodeDocURL(input) {
	return encodeURIComponent(input);
});

swig.setFilter('to_date', toDate);

swig.setFilter('localdate', generateTime);

wiki.use(session({
	key: 'sid',
	secret: 'secret',
	cookie: {
		expires: false
	}
}));

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

wiki.use(bodyParser.json());
wiki.use(bodyParser.urlencoded({ extended: true }));
wiki.use(upload.array()); 
wiki.use(express.static('public'));

const fs = require('fs');

var wikiconfig = {};
var permlist = {};
var _ready = 0;

var hostconfig;
try {
	hostconfig = require('./config.json'); 
	_ready = 1; 
} catch(e) { (async function() {
	print("병아리 엔진: the seed 모방 프로젝트에 오신것을 환영합니다.");
	print("버전 4.5.5 [디버그] - 테스트 목적으로만 사용됩니다.");
	print("고의적으로 배포하지 마십시오.");
	
	prt('\n');
	
	hostconfig = {
		host: input("호스트 주소: "),
		port: input("포트 번호: "),
		skin: input("기본 스킨 이름: ")
	};
	
	const tables = {
		'documents': ['title', 'content', 'namespace'],
		'history': ['title', 'namespace', 'content', 'rev', 'time', 'username', 'changes', 'log', 'iserq', 'erqnum', 'advance', 'ismember'],
		'namespaces': ['namespace', 'locked', 'norecent', 'file'],
		'users': ['username', 'password'],
		'user_settings': ['username', 'key', 'value'],
		'acl': ['title', 'no', 'type', 'content', 'action', 'expire'],
		'nsacl': ['namespace', 'no', 'type', 'content', 'action', 'expire'],
		'config': ['key', 'value'],
		'email_filters': ['address'],
		'stars': ['title', 'namespace', 'username', 'lastedit'],
		'perms': ['perm', 'username'],
		'threads': ['title', 'namespace', 'topic', 'status', 'time', 'tnum'],
		'res': ['id', 'content', 'username', 'time', 'hidden', 'hider', 'status', 'tnum', 'ismember', 'isadmin'],
		'useragents': ['username', 'string'],
		'login_history': ['username', 'ip'],
		'account_creation': ['key', 'email', 'time'],
		'acl': ['title', 'namespace', 'id', 'type', 'action', 'expiration', 'conditiontype', 'condition', 'ns'],
		'ipacl': ['cidr', 'al', 'expiration', 'note', 'date'],
	};
	
	for(var table in tables) {
		var sql = '';
		sql = `CREATE TABLE ${table} ( `;
		
		for(col of tables[table]) {
			sql += `${col} TEXT DEFAULT '', `;
		}
		
		sql = sql.replace(/[,]\s$/, '');		
		sql += `)`;
		
		await curs.execute(sql);
	}
	
	fs.writeFileSync('config.json', JSON.stringify(hostconfig), 'utf8');
	
	print('엔진을 다시 시작하십시오.');
	process.exit(0);
})(); } if(_ready) {

function markdown(content) {
	// ([^제외]*)
	
	ret = content;
	
	ret = html.escape(ret);
	
	ret = ret.replace(/[_][_]([^_]*)[_][_]/gi, '<u>$1</u>');
	
	ret = ret.replace(/[*][*][*]([^\*]*)[*][*][*]/gi, '<strong><i>$1</i></strong>');
	ret = ret.replace(/[*][*]([^\*]*)[*][*]/gi, '<strong>$1</strong>');
	ret = ret.replace(/[*]([^\*]*)[*]/gi, '<i>$1</i>');
	
	ret = ret.replace(/^[-]\s[-]\s[-]$/gim, '<hr />');
	ret = ret.replace(/^[*]\s[*]\s[*]$/gim, '<hr />');
	ret = ret.replace(/^[*][*][*][*][*]$/gim, '<hr />');
	ret = ret.replace(/^[*][*][*]$/gim, '<hr />');
	ret = ret.replace(/^[-]{3,80}$/gim, '<hr />');
	
	//ret = ret.replace(/[*]\s([^\*]*)/gim, '<li>$1</li>');
	//ret = ret.replace(/[-]\s([^[-]]*)/gim, '<li>$1</li>');
	
	ret = ret.replace(/^[#][#][#][#][#][#]\s{0,80}([^\n]*)/gim, '<h6 class=wiki-heading>-. $1</h6>');
	ret = ret.replace(/^[#][#][#][#][#]\s{0,80}([^\n]*)/gim, '<h5 class=wiki-heading>-. $1</h5>');
	ret = ret.replace(/^[#][#][#][#]\s{0,80}([^\n]*)/gim, '<h4 class=wiki-heading>-. $1</h4>');
	ret = ret.replace(/^[#][#][#]\s{0,80}([^\n]*)/gim, '<h3 class=wiki-heading>-. $1</h3>');
	ret = ret.replace(/^[#][#]\s{0,80}([^\n]*)/gim, '<h2 class=wiki-heading>-. $1</h2>');
	ret = ret.replace(/^[#]\s{0,80}([^\n]*)/gim, '<h1 class=wiki-heading>-. $1</h1>');
	
	// ret = ret.replace(/^([^\n]*)(\r|)\n[=]{4,180}/gi, '<h2 class=wiki-heading>-. $1</h1>');
	// ret = ret.replace(/^([^\n]*)(\r|)\n[-]{4,180}/gi, '<h1 class=wiki-heading>-. $1</h2>');
	
	ret = ret.replace(/[`][`][`]([^[`]]*)[`][`][`]/gi, '<pre>$1</pre>');
	ret = ret.replace(/[`]([^[`]]*)[`]/gi, '<code>$1</code>');
	
	return ret;
}

function islogin(req) {
	if(req.session.username) return true;
	return false;
}

function getUsername(req, forceIP = 0) {
	if(!forceIP && req.session.username) {
		return req.session.username;
	} else {
		if(req.headers['x-forwarded-for']) {
			return req.headers['x-forwarded-for'];
		} else {
			return req.connection.remoteAddress;
		}
	}
}

const ip_check = getUsername; // 오픈나무를 오랫동안 커스텀하느라 이 함수명에 익숙해진 바 있음

const config = {
	getString: function(str, def = '') {
		str = str.replace(/^wiki[.]/, '');
		
		if(typeof(wikiconfig[str]) == 'undefined') {
			curs.execute("insert into config (key, value) values (?, ?)", [str, def]);
			wikiconfig[str] = def;
			return def;
		}
		return wikiconfig[str];
	}
}

const _ = undefined;

function getSkin() {
	return hostconfig['skin'];
}

async function getperm(perm, username) {
	await curs.execute("select perm from perms where username = ? and perm = ?", [username, perm]);
	if(curs.fetchall().length) {
		return true;
	}
	return false;
}

function render(req, title = '', content = '', varlist = {}, subtitle = '', error = false, viewname = '') {
	const skinInfo = {
		title: title + subtitle,
		viewName: viewname,
	};
	
	const perms = {
		has(perm) {
			try {
				return permlist[ip_check(req)].includes(perm)
			} catch(e) {
				return false;
			}
		}
	}
	
	try {
		var template = swig.compileFile('./skins/' + getSkin() + '/views/default.html');
	} catch(e) {
		print(`[오류!] ${e}`);
		
		return `
			<title>` + title + ` (스킨 렌더링 오류!)</title>
			<meta charset=utf-8>` + content;
	}

	var output;
	var templateVariables = varlist;
	templateVariables['skinInfo'] = skinInfo;
	templateVariables['config'] = config;
	templateVariables['content'] = content;
	templateVariables['perms'] = perms;
	templateVariables['url'] = req.path;
	
	if(islogin(req)) {
		templateVariables['member'] = {
			username: req.session.username,
		}
	}
	
	if(viewname != '') {
		// templateVariables['document'] = title;
	}
	
	output = template(templateVariables);
	
	var header = '<html><head>';
	var skinconfig = require("./skins/" + getSkin() + "/config.json");
	header += `
		<title>${title}${subtitle} - ${config.getString('site_name', 'Wiki')}</title>
		<meta charset="utf-8">
		<meta http-equiv="x-ua-compatible" content="ie=edge">
		<meta http-equiv="x-pjax-version" content="">
		<meta name="generator" content="the seed">
		<meta name="application-name" content="` + config.getString('wiki.site_name', 'Wiki') + `">
		<meta name="mobile-web-app-capable" content="yes">
		<meta name="msapplication-tooltip" content="` + config.getString('wiki.site_name', 'Wiki') + `">
		<meta name="msapplication-starturl" content="/w/` + encodeURIComponent(config.getString('wiki.frontpage', 'FrontPage')) + `">
		<link rel="search" type="application/opensearchdescription+xml" title="` + config.getString('wiki.site_name', 'Wiki') + `" href="/opensearch.xml">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link rel="stylesheet" href="/css/diffview.css">
		<link rel="stylesheet" href="/css/katex.min.css">
		<link rel="stylesheet" href="/css/wiki.css">
	`;
	for(var i=0; i<skinconfig["auto_css_targets"]['*'].length; i++) {
		header += '<link rel=stylesheet href="/skins/' + getSkin() + '/' + skinconfig["auto_css_targets"]['*'][i] + '">';
	}
	header += `
		<!--[if (!IE)|(gt IE 8)]><!--><script type="text/javascript" src="/js/jquery-2.1.4.min.js"></script><!--<![endif]-->
		<!--[if lt IE 9]><script type="text/javascript" src="/js/jquery-1.11.3.min.js"></script><![endif]-->
		<script type="text/javascript" src="/js/dateformatter.js?508d6dd4"></script>
		<script type="text/javascript" src="/js/intersection-observer.js?36e469ff"></script>
		<script type="text/javascript" src="/js/theseed.js?24141115"></script>
	`;
	for(var i=0; i<skinconfig["auto_js_targets"]['*'].length; i++) {
		header += '<script type="text/javascript" src="/skins/' + getSkin() + '/' + skinconfig["auto_js_targets"]['*'][i]['path'] + '"></script>';
	}
	
	header += skinconfig['additional_heads'];
	header += '</head><body class="';
	for(var i=0; i<skinconfig['body_classes'].length; i++) {
		header += skinconfig['body_classes'][i] + ' ';
	}
	header += '">';
	var footer = '</body></html>';
	
	return header + output + footer;
}

function fetchErrorString(code) {
	const codes = {
		
	};
	
	if(typeof(codes[code]) == 'undefined') return code;
	else return codes[code];
}

function alertBalloon(content, type = 'danger', dismissible = true, classes = '') {
	return `
		<div class="alert alert-${type} ${dismissible ? 'alert-dismissible' : ''} ${classes}" role=alert>
			<button type=button class=close data-dismiss=alert aria-label=Close>
				<span aria-hidden=true>×</span>
				<span class=sr-only>Close</span>
			</button>
			<strong>${
				{
					none: '',
					danger: '[오류!]',
					warning: '',
					info: '',
					success: '[경고!]'
				}[type]
			}</strong> ${content}
		</div>`;
}

function fetchNamespaces() {
	return ['문서', '틀', '분류', '파일', '사용자', '특수기능', 'wiki', '토론', '휴지통', '투표'];
}

function showError(req, code) {
	return render(req, "문제가 발생했습니다!", `<h2>${fetchErrorString(code)}</h2>`);
}

function ip_pas(ip = '', ismember = '') {
	if(ismember == 'author') {
		return `<strong><a href="/w/사용자:${encodeURIComponent(ip)}">${html.escape(ip)}</a></strong>`;
	} else {
		return `<a href="/contribution/ip/${encodeURIComponent(ip)}/document">${html.escape(ip)}</a>`;
	}
}

async function getacl(title, type) {
	return 1;
}

function navbtn(cs, ce, s, e) {
	return '';
}

const html = {
	escape: function(content = '') {
		content = content.replace(/[<]/gi, '&lt;');
		content = content.replace(/[>]/gi, '&gt;');
		content = content.replace(/["]/gi, '&quot;');
		content = content.replace(/[&]/gi, '&amp;');
		
		return content;
	}
}

wiki.get(/^\/skins\/((?:(?!\/).)+)\/(.+)/, function dropSkinFile(req, res) {
	const skinname = req.params[0];
	const filepath = req.params[1];
	
	const afn = split(filepath, '/');
	const fn = afn[afn.length - 1];
	
	var rootp = './skins/' + skinname + '/static';
	var cnt = 0;
	for(dir of afn) {
		rootp += '/' + dir;
	}
	
	res.sendFile(fn, { root: rootp.replace('/' + fn, '') });
});

function dropSourceCode(req, res) {
	res.sendFile('index.js', { root: "./" });
}

wiki.get('/index.js', dropSourceCode);

wiki.get('/js/:filepath', function dropJS(req, res) {
	const filepath = req.param('filepath');
	res.sendFile(filepath, { root: "./js" });
});

wiki.get('/css/:filepath', function dropCSS(req, res) {
	const filepath = req.param('filepath');
	res.sendFile(filepath, { root: "./css" });
});

function redirectToFrontPage(req, res) {
	res.redirect('/w/' + config.getString('frontpage', 'FrontPage'));
}

function processTitle(d) {
	const sp = d.split(':');
	var ns = sp[0];
	var title = d;
	var forceShowNamespace = false;
	var nslist = fetchNamespaces();
	if(nslist.includes(ns)) {
		title = d.replace(ns + ':', '');
		if(sp[2] && ns == '문서' && nslist.includes(ns[1])) {
			forceShowNamespace = true;
		}
	} else {
		title = d;
		ns = '문서';
	}

	return {
		title, 
		namespace: ns, 
		forceShowNamespace,
		toString() {
			if(forceShowNamespace || this.namespace != '문서')
				return this.namespace + ':' + title;
			else
				return title;
		}
	};
}

function totitle(t, ns) {
	const nslist = fetchNamespaces();
	var forceShowNamespace = false;
	if(ns == '문서' && nslist.includes(t.split(':')[0]))
		forceShowNamespace = true;
	
	return {
		title: t, 
		namespace: ns, 
		forceShowNamespace,
		toString() {
			if(forceShowNamespace || this.namespace != '문서')
				return this.namespace + ':' + this.title;
			else
				return this.title;
		}
	};
}

function edittype(type, ...flags) {
	var ret = '';
	
	switch(type) {
		case 'create':
			ret = '새 문서';
		break; case 'move':
			ret = flags[0] + '에서 ' + flags[1] + '(으)로 문서 이동';
		break; case 'delete': 
			ret = '삭제';
		break; case 'revert':
			ret = 'r' + flags[0] + '로 되돌림';
		break; case 'acl':
			ret = flags[0] + '으로 ACL 변경';
	}
	
	return ret;
}

wiki.get(/^\/w$/, redirectToFrontPage);
wiki.get(/^\/w\/$/, redirectToFrontPage);
wiki.get('/', redirectToFrontPage);

wiki.get(/^\/w\/(.*)/, async function viewDocument(req, res) {
	const title = req.params[0];
	if(title.replace(/\s/g, '') == '') res.redirect('/w/' + config.getString('frontpage', 'FrontPage'));
	const doc = processTitle(title);
	
	const rawContent = await curs.execute("select content from documents where title = ? and namespace = ?", [doc.title, doc.namespace]);

	var content = '';
	
	var httpstat = 200;
	var viewname = 'wiki';
	var error = false;
	
	var lstedt = undefined;
	
	try {
		if(!await getacl(doc.title, doc.namespace, 'read')) {
			httpstat = 403;
			error = true;
			return res.status(403).send(showError(req, 'insufficient_privileges_read'));
		} else {
			content = markdown(rawContent[0].content);
			
			if(doc.namespace == '사용자' && await getperm('admin', doc.title)) {
				content = `
					<div style="border-width: 5px 1px 1px; border-style: solid; border-color: orange gray gray; padding: 10px; margin-bottom: 10px;" onmouseover="this.style.borderTopColor=\'red\';" onmouseout="this.style.borderTopColor=\'orange\';">
						<span style="font-size:14pt">이 사용자는 특수 권한을 가지고 있습니다.</span>
					</div>
				` + content;
			}
			
			var data = await curs.execute("select time from history where title = ? and namespace = ? order by cast(rev as integer) desc limit 1", [doc.title, doc.namespace]);
			lstedt = Number(data[0].time);
		}
	} catch(e) {
		viewname = 'notfound';
		
		print(`[오류!] ${e}`);
		
		httpstat = 404;
		content = `
			<p>해당 문서를 찾을 수 없습니다.</p>
			
			<p>
				<a rel="nofollow" href="/edit/` + encodeURIComponent(totitle(doc.title, doc.namespace)) + `">[새 문서 만들기]</a>
			</p>
		`;
	}
	
	res.status(httpstat).send(render(req, totitle(doc.title, doc.namespace), content, {
		star_count: 0,
		starred: false,
		date: lstedt,
		document: doc,
	}, _, error, viewname));
});

wiki.get(/^\/edit\/(.*)/, async function editDocument(req, res) {
	const title = req.params[0];
	const doc = processTitle(title);
	
	if(!await getacl(doc.title, doc.namespace, 'read')) {
		return res.status(403).send(showError(req, 'insufficient_privileges_read'));
	}
	
	var rawContent = await curs.execute("select content from documents where title = ? and namespace = ?", [doc.title, doc.namespace]);
	
	if(!rawContent[0]) rawContent = '';
	else rawContent = rawContent[0].content;
	
	var error = false;
	var content = '';
	
	var baserev;
	
	var data = await curs.execute("select rev from history where title = ? and namespace = ? order by CAST(rev AS INTEGER) desc limit 1", [doc.title, doc.namespace]);
	try {
		baserev = data[0].rev;
	} catch(e) {
		baserev = 0;
	}
	
	content = `
		<form method="post" id="editForm" enctype="multipart/form-data" data-title="${title}" data-recaptcha="0">
			<input type="hidden" name="token" value="">
			<input type="hidden" name="identifier" value="${islogin(req) ? 'm' : 'i'}:${ip_check(req)}">
			<input type="hidden" name="baserev" value="${baserev}">

			<ul class="nav nav-tabs" role="tablist" style="height: 38px;">
				<li class="nav-item">
					<a class="nav-link active" data-toggle="tab" href="#edit" role="tab">편집</a>
				</li>
				<li class="nav-item">
					<a id="previewLink" class="nav-link" data-toggle="tab" href="#preview" role="tab">미리보기</a>
				</li>
			</ul>

			<div class="tab-content bordered">
				<div class="tab-pane active" id="edit" role="tabpanel">
					<textarea id="textInput" name="text" wrap="soft" class="form-control">${html.escape(rawContent)}</textarea>
				</div>
				<div class="tab-pane" id="preview" role="tabpanel">
					
				</div>
			</div>
	`;
	
	var httpstat = 200;
	
	if(!await getacl(doc.title, doc.namespace, 'edit')) {
		error = true;
		content = `
			${alertBalloon('편집 권한이 부족합니다. 대신 <strong><a href="/new_edit_request/' + html.escape(title) + '">편집 요청</a></strong>을 생성하실 수 있습니다.', 'danger', true, 'fade in edit-alert')}
		` + content.replace('<textarea', '<textarea readonly=readonly') + `
			</form>
		`;
		httpstat = 403;
	} else {
		content += `
				<div class="form-group" style="margin-top: 1rem;">
					<label class="control-label" for="summaryInput">요약</label>
					<input type="text" class="form-control" id="logInput" name="log" value="">
				</div>

				<label><input type="checkbox" name="agree" id="agreeCheckbox" value="Y">&nbsp;문서 편집을 <strong>저장</strong>하면 당신은 기여한 내용을 <strong>CC-BY-NC-SA 2.0 KR</strong>으로 배포하고 기여한 문서에 대한 하이퍼링크나 URL을 이용하여 저작자 표시를 하는 것으로 충분하다는 데 동의하는 것입니다. 이 <strong>동의는 철회할 수 없습니다.</strong></label>
				
				${islogin(req) ? '' : `<p style="font-weight: bold;">비로그인 상태로 편집합니다. 편집 역사에 IP(${ip_check(req)})가 영구히 기록됩니다.</p>`}
				
				<div class="btns">
					<button id="editBtn" class="btn btn-primary" style="width: 100px;">저장</button>
				</div>

<!--
				<div id="recaptcha">
					<div class="grecaptcha-badge" style="width: 256px; height: 60px; box-shadow: gray 0px 0px 5px;">
						<div class="grecaptcha-logo">
							<iframe src="https://www.google.com/recaptcha/api2/anchor?k=6LcUuigTAAAAALyrWQPfwtFdFWFdeUoToQyVnD8Y&amp;co=aHR0cDovL3dlYi5hcmNoaXZlLm9yZzo4MA..&amp;hl=ko&amp;v=r20171212152908&amp;size=invisible&amp;badge=inline&amp;cb=6rdgqngv0djy" width="256" height="60" role="presentation" frameborder="0" scrolling="no" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation allow-modals allow-popups-to-escape-sandbox"></iframe>
						</div>
						
						<div class="grecaptcha-error"></div>
						
						<textarea id="g-recaptcha-response" name="g-recaptcha-response" class="g-recaptcha-response" style="width: 250px; height: 40px; border: 1px solid #c1c1c1; margin: 10px 25px; padding: 0px; resize: none;  display: none; "></textarea>
					</div>
				</div>
				<script>
					recaptchaInit('recaptcha', {
						'sitekey': '',
						'size': 'invisible',
						'badge': 'inline',
						'callback': function() { $("#editBtn").attr("disabled", true); $("#editForm").submit(); }
					}, function (id) {
						$("#editForm").attr('data-recaptcha', id);
					});
				</script>
-->
			</form>
		`;
	}
	
	res.status(httpstat).send(render(req, totitle(doc.title, doc.namespace) + ' (편집)', content, {
		document: doc,
	}, '', error, 'edit'));
});

wiki.post(/^\/edit\/(.*)/, async function saveDocument(req, res) {
	const title = req.params[0];
	const doc = processTitle(title);
	
	if(!await getacl(doc.title, doc.namespace, 'edit') || !await getacl(doc.title, doc.namespace, 'read')) {
		return res.send(showError(req, 'insufficient_privileges_edit'));
	}
	
	var original = await curs.execute("select content from documents where title = ? and namespace = ?", [doc.title, doc.namespace]);
	
	if(!original[0]) original = '';
	else original = original[0]['content'];
	
	const content = req.body['text'];
	const rawChanges = content.length - original.length;
	const changes = (rawChanges > 0 ? '+' : '') + String(rawChanges);
	const log = req.body['log'];
	const agree = req.body['agree'];
	const baserev = req.body['baserev'];
	const ismember = islogin(req) ? 'author' : 'ip';
	var advance = 'normal';
	
	var data = await curs.execute("select title from documents where title = ? and namespace = ?", [doc.title, doc.namespace]);
	if(!data.length) {
		advance = 'create';
		await curs.execute("insert into documents (title, namespace, content) values (?, ?, ?)", [doc.title, doc.namespace, content]);
	} else {
		await curs.execute("update documents set content = ? where title = ? and namespace = ?", [content, doc.title, doc.namespace]);
		curs.execute("update stars set lastedit = ? where title = ? and namespace = ?", [getTime(), doc.title, doc.namespace]);
	}
	
	curs.execute("insert into history (title, namespace, content, rev, username, time, changes, log, iserq, erqnum, ismember, advance) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
		doc.title, doc.namespace, content, String(Number(baserev) + 1), ip_check(req), getTime(), changes, log, '0', '-1', ismember, advance
	]);
	
	res.redirect('/w/' + encodeURIComponent(totitle(doc.title, doc.namespace)));
});

wiki.get('/RecentChanges', async function recentChanges(req, res) {
	var flag = req.query['logtype'];
	if(!['all', 'create', 'delete', 'move', 'revert'].includes(flag)) flag = 'all';
	if(flag == 'all') flag = '%';
	
	var data = await curs.execute("select title, namespace, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
					where not namespace = '사용자' and advance like ? order by cast(time as integer) desc limit 100", 
					[flag]);
	
	var content = `
		<ol class="breadcrumb link-nav">
			<li><a href="?logtype=all">[전체]</a></li>
			<li><a href="?logtype=create">[새 문서]</a></li>
			<li><a href="?logtype=delete">[삭제]</a></li>
			<li><a href="?logtype=move">[이동]</a></li>
			<li><a href="?logtype=revert">[되돌림]</a></li>
		</ol>
		
		<table class="table table-hover">
			<colgroup>
				<col>
				<col style="width: 25%;">
				<col style="width: 22%;">
			</colgroup>
			
			<thead id>
				<tr>
					<th>항목</th>
					<th>수정자</th>
					<th>수정 시간</th>
				</tr>
			</thead>
			
			<tbody id>
	`;
	
	for(var row of data) {
		var title = totitle(row.title, row.namespace) + '';
		
		content += `
				<tr${(row.log.length > 0 || row.advance.length > 0 ? ' class=no-line' : '')}>
					<td>
						<a href="/w/${encodeURIComponent(title)}">${html.escape(title)}</a> 
						<a href="/history/${encodeURIComponent(title)}">[역사]</a> 
						${
								Number(row.rev) > 1
								? '<a \href="/diff/' + encodeURIComponent(title) + '?rev=' + row.rev + '&oldrev=' + String(Number(row.rev) - 1) + '">[비교]</a>'
								: ''
						} 
						<a href="/discuss/${encodeURIComponent(title)}">[토론]</a> 
						
						(<span style="color: ${
							(
								Number(row.changes) > 0
								? 'green'
								: (
									Number(row.changes) < 0
									? 'red'
									: 'gray'
								)
							)
							
						};">${row.changes}</span>)
					</td>
					
					<td>
						${ip_pas(row.username, row.ismember)}
					</td>
					
					<td>
						${generateTime(toDate(row.time), timeFormat)}
					</td>
				</tr>
		`;
		
		if(row.log.length > 0 || row.advance != 'normal') {
			content += `
				<td colspan="3" style="padding-left: 1.5rem;">
					${row.log} ${row.advance != 'normal' ? `<i>(${edittype(row.advance)})</i>` : ''}
				</td>
			`;
		}
	}
	
	content += `
			</tbody>
		</table>
	`;
	
	res.send(render(req, '최근 변경내역', content, {}));
});

wiki.get(/^\/contribution\/(ip|author)\/(.*)\/document/, async function documentContributionList(req, res) {
	const ismember = req.params[0];
	const username = req.params[1];
	
	var data = await curs.execute("select title, namespace, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
				where cast(time as integer) >= ? and ismember = ? and username = ? order by cast(time as integer) desc", [
					Number(getTime()) - 2592000000, ismember, username
				]);
	
//			<li><a href="/contribution/${ismember}/${username}/document">[문서]</a></li>
//			<li><a href="/contribution/${ismember}/${username}/discuss">[토론]</a></li>
	
	var content = `
		<p>최근 30일동안의 기여 목록 입니다.</p>
	
		<ol class="breadcrumb link-nav">
			<li><strong>[문서]</strong></li>
			<li><a href="/contribution/${ismember}/${username}/discuss">[토론]</a></li>
		</ol>
		
		<table class="table table-hover">
			<colgroup>
				<col>
				<col style="width: 25%;">
				<col style="width: 22%;">
			</colgroup>
			
			<thead id>
				<tr>
					<th>문서</th>
					<th>수정자</th>
					<th>수정 시간</th>
				</tr>
			</thead>
			
			<tbody id>
	`;
	
	for(var row of data) {
		var title = totitle(row.title, row.namespace) + '';
		
		content += `
				<tr${(row.log.length > 0 || row.advance.length > 0 ? ' class=no-line' : '')}>
					<td>
						<a href="/w/${encodeURIComponent(title)}">${html.escape(title)}</a> 
						<a href="/history/${encodeURIComponent(title)}">[역사]</a> 
						${
								Number(row.rev) > 1
								? '<a \href="/diff/' + encodeURIComponent(title) + '?rev=' + row.rev + '&oldrev=' + String(Number(row.rev) - 1) + '">[비교]</a>'
								: ''
						} 
						<a href="/discuss/${encodeURIComponent(title)}">[토론]</a> 
						
						(<span style="color: ${
							(
								Number(row.changes) > 0
								? 'green'
								: (
									Number(row.changes) < 0
									? 'red'
									: 'gray'
								)
							)
							
						};">${row.changes}</span>)
					</td>
					
					<td>
						${ip_pas(row.username, row.ismember)}
					</td>
					
					<td>
						${generateTime(toDate(row.time), timeFormat)}
					</td>
				</tr>
		`;
		
		if(row.log.length > 0 || row.advance != 'normal') {
			content += `
				<td colspan="3" style="padding-left: 1.5rem;">
					${row.log} ${row.advance != 'normal' ? `<i>(${edittype(row.advance)})</i>` : ''}
				</td>
			`;
		}
	}
	
	content += `
			</tbody>
		</table>
	`;
	
	res.send(render(req, `"${username}" 기여 목록`, content, {}));
});

wiki.get('/RecentDiscuss', async function recentDicsuss(req, res) {
	var logtype = req.query['logtype'];
	if(!logtype) logtype = 'all';
	
	var content = `
		<ol class="breadcrumb link-nav">
			<li><a href="?logtype=normal_thread">[열린 토론]</a></li>
			<li><a href="?logtype=old_thread">[오래된 토론]</a></li>
			<li><a href="?logtype=closed_thread">[닫힌 토론]</a></li>

			<li><a href="?logtype=open_editrequest">[열린 편집 요청]</a></li>
			<li><a href="?logtype=accepted_editrequest">[승인된 편집 요청]</a></li>
			<li><a href="?logtype=closed_editrequest">[닫힌 편집 요청]</a></li>
		</ol>
		
		<table class="table table-hover">
			<colgroup>
				<col>
				<col style="width: 22%; min-width: 100px;">
			</colgroup>
			<thead>
				<tr>
					<th>항목</th>
					<th>수정 시간</th>
				</tr>
			</thead>
			
			<tbody id>
	`;
	
	var trds;
	
	switch(logtype) {
		case 'normal_thread':
			trds = await curs.execute("select title, namespace, topic, time, tnum from threads where status = 'normal' order by cast(time as integer) desc limit 120");
		break;case 'old_thread':
			trds = await curs.execute("select title, namespace, topic, time, tnum from threads where status = 'normal' order by cast(time as integer) asc limit 120");
		break;case 'closed_thread':
			trds = await curs.execute("select title, namespace, topic, time, tnum from threads where status = 'close' order by cast(time as integer) desc limit 120");
		break;default:
			trds = await curs.execute("select title, namespace, topic, time, tnum from threads where status = 'normal' order by cast(time as integer) desc limit 120");
	}
	
	for(var trd of trds) {
		const title = totitle(trd.title, trd.namespace) + '';
		
		content += `
			<tr>
				<td>
					<a href="/thread/${trd.tnum}">${html.escape(trd.topic)}</a> (<a href="/discuss/${encodeURIComponent(title)}">${html.escape(title)}</a>)
				</td>
				
				<td>
					${generateTime(toDate(trd.time), timeFormat)}
				</td>
			</tr>
		`;
	}
	
	content += `
			</tbody>
		</table>
	`;
	
	res.send(render(req, "최근 토론", content, {}));
});

wiki.get(/^\/contribution\/(ip|author)\/(.*)\/discuss/, async function discussionLog(req, res) {
	const ismember = req.params[0];
	const username = req.params[1];
	
	var dd = await curs.execute("select id, tnum, time, username, ismember from res \
				where cast(time as integer) >= ? and ismember = ? and username = ? order by cast(time as integer) desc", [
					Number(getTime()) - 2592000000, ismember, username
				]);
	
//			<li><a href="/contribution/${ismember}/${username}/document">[문서]</a></li>
//			<li><a href="/contribution/${ismember}/${username}/discuss">[토론]</a></li>
	
	var content = `
		<p>최근 30일동안의 기여 목록 입니다.</p>
	
		<ol class="breadcrumb link-nav">
			<li><a href="/contribution/${ismember}/${username}/document">[문서]</a></li>
			<li><strong>[토론]</strong></li>
		</ol>
		
		<table class="table table-hover">
			<colgroup>
				<col>
				<col style="width: 25%;">
				<col style="width: 22%;">
			</colgroup>
			
			<thead id>
				<tr>
					<th>항목</th>
					<th>수정자</th>
					<th>수정 시간</th>
				</tr>
			</thead>
			
			<tbody id>
	`;
	
	for(var row of dd) {
		const td = (await curs.execute("select title, namespace, topic from threads where tnum = ?", [row.tnum]))[0];
		const title = totitle(td.title, td.namespace) + '';
		
		content += `
				<tr>
					<td>
						<a href="/thread/${row.tnum}">#${row.id} ${html.escape(td['topic'])}</a> (<a href="/w/${encodeURIComponent(title)}">${html.escape(title)}</a>)
					</td>
					
					<td>
						${ip_pas(row.username, row.ismember)}
					</td>
					
					<td>
						${generateTime(toDate(row.time), timeFormat)}
					</td>
				</tr>
		`;
	}
	
	content += `
			</tbody>
		</table>
	`;
	
	res.send(render(req, `"${username}" 기여 목록`, content, {}));
});

wiki.get(/^\/history\/(.*)/, async function viewHistory(req, res) {
	var title = req.params[0];
	
	const doc = processTitle(title);
	const from = req.query['from'];
	const until = req.query['until'];
	title = totitle(doc.title, doc.namespace);
	
	if(!await getacl(doc.title, doc.namespace, 'read')) {
		return res.send(showError('insufficient_privileges_read'));
	}
	
	var data;
	
	if(from) {  // 더시드에서 from이 더 우선임
		data = await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and namespace = ? and (cast(rev as integer) <= ? AND cast(rev as integer) > ?) \
						order by cast(rev as integer) desc",
						[doc.title, doc.namespace, Number(from), Number(from) - 30]);
	} else if(until) {
		data = await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and namespace = ? and (cast(rev as integer) >= ? AND cast(rev as integer) < ?) \
						order by cast(rev as integer) desc",
						[doc.title, doc.namespace, Number(until), Number(until) + 30]);
	} else {
		data = await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and namespace = ? order by cast(rev as integer) desc limit 30",
						[doc.title, doc.namespace]);
	}
	
	if(!data.length) res.send(showError(req, 'document_not_exists'));
	
	const navbtns = navbtn(0, 0, 0, 0);
	
	var content = `
		<p>
			<button id="diffbtn" class="btn btn-secondary">선택 리비젼 비교</button>
		</p>
		
		${navbtns}
		
		<ul class=wiki-list>
	`;
	
	for(var row of data) {
		content += `
				<li>
					${generateTime(toDate(row.time), timeFormat)} 
		
					<span style="font-size: 8pt;">
						(<a rel=nofollow href="/w/${encodeURIComponent(title)}?rev=${row.rev}">보기</a> |
							<a rel=nofollow href="/raw/${encodeURIComponent(title)}?rev=${row.rev}" data-npjax="true">RAW</a> |
							<a rel=nofollow href="/blame/${encodeURIComponent(title)}?rev=${row.rev}">Blame</a> |
							<a rel=nofollow href="/revert/${encodeURIComponent(title)}?rev=${row.rev}">이 리비젼으로 되돌리기</a>${
								Number(row.rev) > 1
								? ' | <a rel=nofollow href="/diff/' + encodeURIComponent(title) + '?rev=' + row.rev + '&oldrev=' + String(Number(row.rev) - 1) + '">비교</a>'
								: ''
							})
					</span> 
					
					<input type="radio" name="oldrev" value="${row.rev}">
					<input type="radio" name="rev" value="${row.rev}">

					${row.advance != 'normal' ? `<i>(${edittype(row.advance)})</i>` : ''}
					
					<strong>r${row.rev}</strong> 
					
					(<span style="color: ${
						(
							Number(row.changes) > 0
							? 'green'
							: (
								Number(row.changes) < 0
								? 'red'
								: 'gray'
							)
						)
						
					};">${row.changes}</span>)
					
					${ip_pas(row.username, row.ismember)}
					
					(<span style="color: gray;">${row.log}</span>)
				</li>
		`;
	}
	
	content += `
		</ul>
		
		${navbtns}
		
		<script>historyInit("${encodeURIComponent(title)}");</script>
	`;
	
	res.send(render(req, totitle(doc.title, doc.namespace) + '의 역사', content, {
		document: doc,
	}, '', error = false, viewname = 'history'));
});

wiki.get(/^\/discuss\/(.*)/, async function threadList(req, res) {
	const title = req.params[0];
	const doc = processTitle(title);
	
	var state = req.query['state'];
	if(!state) state = '';
	
	if(!await getacl(doc.title, doc.namespace, 'read')) {
		return res.send(showError('insufficient_privileges_read'));
	}
	
	var content = '';
	
	var trdlst;
	
	var subtitle = '';
	var viewname = '';
	
	switch(state) {
		case 'close':
			content += '<ul class=wiki-list>';
			
			var cnt = 0;
			trdlst = await curs.execute("select topic, tnum from threads where title = ? and namespace = ? and status = 'close' order by cast(time as integer) desc", [doc.title, doc.namespace]);
			
			for(var trd of trdlst) {
				content += `<li><a href="#${++cnt}">${cnt}</a>. <a href="/thread/${trd.tnum}">${html.escape(trd.topic)}</a></li>`;
			}
			
			content += '</ul>';
			
			subtitle = ' (닫힌 토론)';
			viewname = 'thread_list_close';
		break;default:
			content += `
				<h3 class="wiki-heading">편집 요청</h3>
				<div class=wiki-heading-content>
					<ul class=wiki-list>
			`;
			
			content += `
					</ul>
				</div>
				
				<p>
					<a href="?state=closed_edit_requests">[닫힌 편집 요청 보기]</a>
				</p>
			`;
			
			content += `
				<h3 class="wiki-heading">토론</h3>
				<div class=wiki-heading-content>
					<ul class=wiki-list>
			`;
			
			var cnt = 0;
			trdlst = await curs.execute("select topic, tnum from threads where title = ? and namespace = ? and status = 'normal' order by cast(time as integer) desc", [doc.title, doc.namespace]);
			
			for(trd of trdlst) {
				content += `<li><a href="#${++cnt}">${cnt}</a>. <a href="/thread/${trd.tnum}">${html.escape(trd.topic)}</a></li>`;
			}
			
			content += `
					</ul>
				</div>
					
				<p>
					<a href="?state=close">[닫힌 토론 목록 보기]</a>
				</p>`
				
			trdlst = await curs.execute("select topic, tnum from threads where title = ? and namespace = ? and status = 'normal' order by cast(time as integer) desc", [doc.title, doc.namespace]);
			
			cnt = 0;
			for(var trd of trdlst) {
				content += `
					<h2 class=wiki-heading id="${++cnt}">
						${cnt}. <a href="/thread/${trd.tnum}">${html.escape(trd.topic)}</a>
					</h2>
					
					<div class=topic-discuss>
				`;
				
				const td = await curs.execute("select id, content, username, time, hidden, hider, status, ismember from res where tnum = ? order by cast(id as integer) asc", [trd.tnum]);
				const ltid = Number((await curs.execute("select id from res where tnum = ? order by cast(id as integer) desc limit 1", [trd.tnum]))[0]['id']);
				
				var ambx = false;
				
				const fstusr = (await curs.execute("select username from res where tnum = ? and (id = '1')", [trd.tnum]))[0]['username'];
				
				for(var rs of td) {
					const crid = Number(rs['id']);
					if(ltid > 4 && crid != 1 && (crid < ltid - 2)) {
						if(!ambx) {
							content += `
								<div>
									<a class=more-box href="/thread/${trd.tnum}">more...</a>
								</div>
							`;
							
							ambx = true;
						}
						continue;
					}
					
					content += `
						<div class=res-wrapper>
							<div class="res res-type-${rs['status'] == '1' ? 'status' : 'normal'}">
								<div class="r-head${rs['username'] == fstusr ? " first-author" : ''}">
									<span class=num>#${rs['id']}</span> ${ip_pas(rs['username'])} <span style="float: right;">${generateTime(toDate(rs['time']), timeFormat)}</span>
								</div>
								
								<div class="r-body${rs['hidden'] == '1' ? ' r-hidden-body' : ''}">
									${
										rs['hidden'] == '1'
										? (
											await getperm('hide_thread_comment', ip_check(req))
											? '[' + rs['hider'] + '에 의해 숨겨진 글입니다.]<div class="text-line-break" style="margin: 25px 0px 0px -10px; display:block"><a class="text" onclick="$(this).parent().parent().children(\'.hidden-content\').show(); $(this).parent().css(\'margin\', \'15px 0 15px -10px\'); return false;" style="display: block; color: #fff;">[ADMIN] Show hidden content</a><div class="line"></div></div><div class="hidden-content" style="display:none">' + markdown(rs['content'], rs['ismember']) + '</div>'
											: '[' + rs['hider'] + '에 의해 숨겨진 글입니다.]'
										  )
										: markdown(rs['content'], rs['ismember'])
									}
								</div>
							</div>
						</div>
					`;
				}
				
				content += '</div>';
			}
				
			content += `
				<h3 class="wiki-heading">새 주제 생성</h3>
				
				<form method="post" class="new-thread-form" id="topicForm">
					<input type="hidden" name="identifier" value="${islogin(req) ? 'm' : 'i'}:${ip_check(req)}">
					<div class="form-group">
						<label class="control-label" for="topicInput" style="margin-bottom: 0.2rem;">주제 :</label>
						<input type="text" class="form-control" id="topicInput" name="topic">
					</div>

					<div class="form-group">
					<label class="control-label" for="contentInput" style="margin-bottom: 0.2rem;">내용 :</label>
						<textarea name="text" class="form-control" id="contentInput" rows="5"></textarea>
					</div>

					
					${islogin(req) ? '' : `<p style="font-weight: bold; font-size: 1rem;">[알림] 비로그인 상태로 토론 주제를 생성합니다. 토론 내역에 IP(${ip_check(req)})가 영구히 기록됩니다.</p>`}
					

					<div class="btns">
						<button id="createBtn" class="btn btn-primary" style="width: 8rem;">전송</button>
					</div>

					<!--
					<div id="recaptcha"><div><noscript>Aktiviere JavaScript, um eine reCAPTCHA-Aufgabe zu erhalten.&lt;br&gt;</noscript><div class="if-js-enabled">Führe ein Upgrade auf einen <a href="http://web.archive.org/web/20171027095753/https://support.google.com/recaptcha/?hl=en#6223828">unterstützten Browser</a> aus, um eine reCAPTCHA-Aufgabe zu erhalten.</div><br>Wenn du meinst, dass diese Seite fälschlicherweise angezeigt wird, überprüfe bitte deine Internetverbindung und lade die Seite neu.<br><br><a href="http://web.archive.org/web/20171027095753/https://support.google.com/recaptcha#6262736" target="_blank">Warum gerade ich?</a></div></div>
					<script>
						recaptchaInit('recaptcha', {
							'sitekey': '6LcUuigTAAAAALyrWQPfwtFdFWFdeUoToQyVnD8Y',
							'size': 'invisible',
							'bind': 'createBtn',
							'badge': 'inline',
							'callback': function() { $("#createBtn").attr("disabled", true); $("#topicForm").submit(); }
						});
					</script>
					-->
				</form>
			`;
			
			subtitle = ' (토론)';
			viewname = 'thread_list';
	}
	
	res.send(render(req, totitle(doc.title, doc.namespace) + subtitle, content, {
		document: doc,
	}, '', false, viewname));
});

wiki.post(/^\/discuss\/(.*)/, async function createThread(req, res) {
	const title = req.params[0];
	const doc = processTitle(title);
	
	if(!await getacl(doc.title, doc.namespace, 'read')) {
		return res.send(showError('insufficient_privileges_read'));
	}
	
	if(!await getacl(doc.title, doc.namespace, 'create_thread')) {
		return res.send(showError(req, 'insufficient_privileges'));
	}
	
	var tnum = rndval('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 22);
	
	while(1) {
		await curs.execute("select tnum from threads where tnum = ?", [tnum]);
		if(!curs.fetchall().length) break;
		tnum = rndval('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 22);
	}
	
	await curs.execute("insert into threads (title, namespace, topic, status, time, tnum) values (?, ?, ?, ?, ?, ?)",
					[doc.title, doc.namespace, req.body['topic'], 'normal', getTime(), tnum]);
	
	await curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) values \
					(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
					['1', req.body['text'], ip_check(req), getTime(), '0', '', '0', tnum, islogin(req) ? 'author' : 'ip', await getperm('admin', ip_check(req)) ? '1' : '0']);
					
	res.redirect('/thread/' + tnum);
});

wiki.get('/thread/:tnum', async function viewThread(req, res) {
	const tnum = req.param("tnum");
	
	var data = await curs.execute("select id from res where tnum = ?", [tnum]);
	const rescount = data.length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }
	
	var data = await curs.execute("select title, namespace, topic, status from threads where tnum = ?", [tnum]);
	const title = data[0]['title'];
	const namespace = data[0]['namespace'];
	const topic = data[0]['topic'];
	const status = data[0]['status'];
	const doc = totitle(title, namespace);
	
	if(!await getacl(doc.title, doc.namespace, 'read')) {
		return res.send(showError(req, 'insufficient_privileges_read'));
	}
	
	var content = `
		<h2 class=wiki-heading style="cursor: pointer;">
			${html.escape(topic)}
			${
				await getperm('delete_thread', ip_check(req))
				? '<span class=pull-right><a onclick="return confirm(\'삭제하시겠습니까?\');" href="/admin/thread/' + tnum + '/delete" class="btn btn-danger btn-sm">[ADMIN] 삭제</a></span>'
				: ''
			}
		</h2>
		
		<div class=wiki-heading-content>
		
			<div id=res-container>
	`;
	
	for(var i=1; i<=rescount; i++) {
		content += `
			<div class="res-wrapper res-loading" data-id="${i}" data-locked="false" data-visible=false>
				<div class="res res-type-normal">
					<div class="r-head">
						<span class="num"><a id="${i}">#${i}</a>&nbsp;</span>
					</div>
					
					<div class="r-body"></div>
				</div>
			</div>
		`;
	}
	
	content += `
			</div>
		</div>
		
		<script>$(function() { discussPollStart("${tnum}"); });</script>
		
		<h2 class=wiki-heading style="cursor: pointer;">댓글 달기</h2>
	`;
	
	if(await getperm('update_thread_status', ip_check(req))) {
		var sts = '';
		
		switch(status) {
			case 'close':
				sts = `
					<option value="normal">normal</option>
					<option value="pause">pause</option>
				`;
			break;case 'normal':
				sts = `
					<option value="close">close</option>
					<option value="pause">pause</option>
				`;
			break;case 'pause':
				sts = `
					<option value="close">close</option>
					<option value="normal">normal</option>
				`;
		}
		
		content += `
		    <form method="post" id="thread-status-form">
        		[ADMIN] 쓰레드 상태 변경
        		<select name="status">${sts}</select>
        		<button id="changeBtn" class="d_btn type_blue">변경</button>
        	</form>
		`;
	}
	
	if(await getperm('update_thread_document', ip_check(req))) {
		content += `
        	<form method="post" id="thread-document-form">
        		[ADMIN] 쓰레드 이동
        		<input type="text" name="document" value="${title}">
        		<button id="changeBtn" class="d_btn type_blue">변경</button>
        	</form>
		`;
	}
	
	if(await getperm('update_thread_topic', ip_check(req))) {
		content += `
        	<form method="post" id="thread-topic-form">
        		[ADMIN] 쓰레드 주제 변경
        		<input type="text" name="topic" value="${topic}">
        		<button id="changeBtn" class="d_btn type_blue">변경</button>
        	</form>
		`;
	}
	
	content += `
		<form id=new-thread-form method=post>
			<textarea class=form-control rows=5 name=text ${['close', 'pause'].includes(status) ? 'disabled' : ''}>${status == 'pause' ? 'pause 상태입니다.' : (status == 'close' ? '닫힌 토론입니다.' : '')}</textarea>
		
			${islogin(req) ? '' : `<p style="font-weight: bold; font-size: 1rem;">[알림] 비로그인 상태로 토론에 참여합니다. 토론 내역에 IP(${ip_check(req)})가 영구히 기록됩니다.</p>`}
			
			<div class=btns>
				<button type=submit class="btn btn-primary" style="width: 120px;">전송</button>
			</div>
		</form>
	`;
	
	res.send(render(req, totitle(title, namespace) + ' (토론) - ' + topic, content, {
		document: doc,
	}, '', error = false, viewname = 'thread'));
});

wiki.post('/thread/:tnum', async function postThreadComment(req, res) {
	const tnum = req.param("tnum");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }
	
	var data = await curs.execute("select title, namespace, topic, status from threads where tnum = ?", [tnum]);
	const title = data[0]['title'];
	const topic = data[0]['topic'];
	const status = data[0]['status'];
	const namespace = data[0]['namespace'];
	const doc = totitle(title, namespace);
	
	if(!await getacl(doc.title, doc.namespace, 'read')) {
		return res.send(showError('insufficient_privileges_read'));
	}
	
	if(!await getacl(doc.title, doc.namespace, 'write_thread_comment')) {
		return res.send(showError(req, 'insufficient_privileges'));
	}
	
	var data = await curs.execute("select id from res where tnum = ? order by cast(id as integer) desc limit 1", [tnum]);
	const lid = Number(data[0]['id']);
	
	await curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
						String(lid + 1), req.body['text'], ip_check(req), getTime(), '0', '', '0', tnum, islogin(req) ? 'author' : 'ip', await getperm('admin', ip_check(req)) ? '1' : '0'
					]);
					
	await curs.execute("update threads set time = ? where tnum = ?", [getTime(), tnum]);
	
	res.json({});
});

wiki.get('/thread/:tnum/:id', async function dropThreadData(req, res) {
	const tnum = req.param("tnum");
	const tid = req.param("id");
	
	var data = await curs.execute("select id from res where tnum = ?", [tnum]);
	const rescount = data.length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }
	
	var data = await curs.execute("select username from res where tnum = ? and (id = '1')", [tnum]);
	const fstusr = data[0]['username'];
	
	var data = await curs.execute("select title, namespace, topic, status from threads where tnum = ?", [tnum]);
	const title = data[0]['title'];
	const namespace = data[0]['namespace'];
	const topic = data[0]['topic'];
	const status = data[0]['status'];
	const doc = totitle(title, namespace);
	
	if(!await getacl(doc.title, doc.namespace, 'read')) {
		return res.send(showError(req, 'insufficient_privileges_read'));
	}
	
	content = ``;
	
	var data = await curs.execute("select id, content, username, time, hidden, hider, status, ismember from res where tnum = ? and (cast(id as integer) = 1 or (cast(id as integer) >= ? and cast(id as integer) < ?)) order by cast(id as integer) asc", [tnum, Number(tid), Number(tid) + 30]);
	for(var rs of data) {
		content += `
			<div class=res-wrapper data-id="${rs['id']}">
				<div class="res res-type-${rs['status'] == '1' ? 'status' : 'normal'}">
					<div class="r-head${rs['username'] == fstusr ? " first-author" : ''}">
						<span class=num>
							<a id="${rs['id']}">#${rs['id']}</a>&nbsp;
						</span> ${ip_pas(rs['username'], rs['ismember'])} <span style="float: right;">${generateTime(toDate(rs['time']), timeFormat)}</span>
					</div>
					
					<div class="r-body${rs['hidden'] == '1' ? ' r-hidden-body' : ''}">
						${
							rs['hidden'] == '1'
							? (
								await getperm('hide_thread_comment', ip_check(req))
								? '[' + rs['hider'] + '에 의해 숨겨진 글입니다.]<div class="text-line-break" style="margin: 25px 0px 0px -10px; display:block"><a class="text" onclick="$(this).parent().parent().children(\'.hidden-content\').show(); $(this).parent().css(\'margin\', \'15px 0 15px -10px\'); $(this).hide(); return false;" style="display: block; color: #fff;">[ADMIN] Show hidden content</a><div class="line"></div></div><div class="hidden-content" style="display:none">' + markdown(rs['content']) + '</div>'
								: '[' + rs['hider'] + '에 의해 숨겨진 글입니다.]'
							  )
							: (
								rs['status'] == 1
								? rs['content']
								: markdown(rs['content'])
							)
						}
					</div>
				</div>`;
		if(await getperm('hide_thread_comment', ip_check(req))) {
			content += `
				<div class="combo admin-menu">
					<a class="btn btn-danger btn-sm" href="/admin/thread/${tnum}/${rs['id']}/${rs['hidden'] == '1' ? 'show' : 'hide'}">[ADMIN] 숨기기${rs['hidden'] == '1' ? ' 해제' : ''}</a>
				</div>
			`;
		}
		content += `
			</div>
		`;
	}
	
	res.send(content);
});

wiki.get('/admin/thread/:tnum/:id/show', async function showHiddenComment(req, res) {
	const tnum = req.param("tnum");
	const tid = req.param("id");
	
	var data = await curs.execute("select id from res where tnum = ?", [tnum]);
	const rescount = data.length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }
	
	if(!await getperm('hide_thread_comment', ip_check(req))) {
		return res.send(showError(req, 'insufficient_privileges'));
	}
	
	await curs.execute("update res set hidden = '0', hider = '' where tnum = ? and id = ?", [tnum, tid]);
	
	res.redirect('/thread/' + tnum);
});

wiki.get('/admin/thread/:tnum/:id/hide', async function hideComment(req, res) {
	const tnum = req.param("tnum");
	const tid = req.param("id");
	
	var data = await curs.execute("select id from res where tnum = ?", [tnum]);
	const rescount = data.length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }
	
	if(!await getperm('hide_thread_comment', ip_check(req))) {
		return res.send(showError(req, 'insufficient_privileges'));
	}
	
	await curs.execute("update res set hidden = '1', hider = ? where tnum = ? and id = ?", [ip_check(req), tnum, tid]);
	
	res.redirect('/thread/' + tnum);
});

wiki.post('/admin/thread/:tnum/status', async function updateThreadStatus(req, res) {
	const tnum = req.param("tnum");
	
	var data = await curs.execute("select id from res where tnum = ?", [tnum]);
	const rescount = data.length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }

	var newstatus = req.body['status'];
	if(!['close', 'pause', 'normal'].includes(newstatus)) newstatus = 'normal';
	
	if(!await getperm('update_thread_status', ip_check(req))) {
		return res.send(showError(req, 'insufficient_privileges'));
	}
	
	curs.execute("update threads set status = ? where tnum = ?", [newstatus, tnum]);
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) \
					values (?, ?, ?, ?, '0', '', '1', ?, ?, ?)", [
						String(rescount + 1), '스레드 상태를 <strong>' + newstatus + '</strong>로 변경', ip_check(req), getTime(), tnum, islogin(req) ? 'author' : 'ip', await getperm('admin', ip_check(req)) ? '1' : '0' 
					]);
	
	res.json({});
});

wiki.post('/admin/thread/:tnum/document', async function updateThreadDocument(req, res) {
	const tnum = req.param("tnum");
	
	var data = await curs.execute("select id from res where tnum = ?", [tnum]);
	const rescount = data.length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }

	if(!await getperm('update_thread_document', ip_check(req))) {
		return res.send(showError(req, 'insufficient_privileges'));
	}
	
	var newdoc = req.body['document'];
	if(!newdoc.length) {
		return res.send('');
	}
	
	curs.execute("update threads set title = ? where tnum = ?", [newdoc, tnum]);
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) \
					values (?, ?, ?, ?, '0', '', '1', ?, ?, ?)", [
						String(rescount + 1), '스레드를 <strong>' + newdoc + '</strong> 문서로 이동', ip_check(req), getTime(), tnum, islogin(req) ? 'author' : 'ip', await getperm('admin', ip_check(req)) ? '1' : '0' 
					]);
	
	res.json({});
});

wiki.post('/admin/thread/:tnum/topic', async function updateThreadTopic(req, res) {
	const tnum = req.param("tnum");
	
	var data = await curs.execute("select id from res where tnum = ?", [tnum]);
	const rescount = data.length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }

	if(!await getperm('update_thread_topic', ip_check(req))) {
		return res.send(showError(req, 'insufficient_privileges'));
	}

	var newtopic = req.body['topic'];
	if(!newtopic.length) {
		return res.send('');
	}
		
	curs.execute("update threads set topic = ? where tnum = ?", [newtopic, tnum]);
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) \
					values (?, ?, ?, ?, '0', '', '1', ?, ?, ?)", [
						String(rescount + 1), '스레드 주제를 <strong>' + newtopic + '</strong>로 변경', ip_check(req), getTime(), tnum, islogin(req) ? 'author' : 'ip', await getperm('admin', ip_check(req)) ? '1' : '0' 
					]);
	
	res.json({});
});

wiki.get('/admin/thread/:tnum/delete', async function deleteThread(req, res) {
	const tnum = req.param("tnum");
	
	var data = await curs.execute("select id from res where tnum = ?", [tnum]);
	const rescount = data.length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }
	
	if(!await getperm('delete_thread', ip_check(req))) {
		return res.send(showError(req, 'insufficient_privileges'));
	}
	
	curs.execute("delete from threads where tnum = ?", [tnum]);
	curs.execute("delete from res where tnum = ?", [tnum]);
	
	res.redirect('/discuss/' + encodeURIComponent(title));
});

wiki.post('/notify/thread/:tnum', async function notifyEvent(req, res) {
	var tnum = req.param("tnum");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }
	
	var data = await curs.execute("select id from res where tnum = ? order by cast(time as integer) desc limit 1", [tnum]);
	
	res.json({
		status: "event",
		comment_id: Number(data[0].id)
	});
});

wiki.all(/^\/member\/login$/, async function loginScreen(req, res, next) {
	if(!['GET', 'POST'].includes(req.method)) return next();
	
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	var id = '1', pw = '1';
	
	if(req.method == 'POST') {
		id = req.body['username'];
		pw = req.body['password'];
		
		var data = await curs.execute("select username from users where username = ? COLLATE NOCASE", [id]);
		var invalidusername = !data.length;
		
		var data = curs.execute("select username, password from users where username = ? and password = ?", [id, sha3(pw)]);
		var invalidpw = !invalidusername && !data.length;
		
		if(!invalidusername && !invalidpw) {
			curs.execute("insert into login_history (username, ip) values (?, ?)", [id, ip_check(req, 1)]);
	
			req.session.username = id;
			
			conn.run("delete from useragents where username = ?", [id], () => {
				curs.execute("insert into useragents (username, string) values (?, ?)", [id, req.headers['user-agent']]);
			});
			
			return res.redirect(desturl);
		}
	}
	
	var content = `
		<form class=login-form method=post>
			<div class=form-group>
				<label>Username</label><br>
				<input class=form-control name="username" type="text">
				${!id.length ? `<p class=error-desc>사용자 이름의 값은 필수입니다.</p>` : ''}
				${id.length && invalidusername ? `<p class=error-desc>사용자 이름이 올바르지 않습니다.</p>` : ''}
			</div>

			<div class=form-group>
				<label>Password</label><br>
				<input class=form-control name="password" type="password">
				${id.length && !invalidusername && !pw.length ? `<p class=error-desc>암호의 값은 필수입니다.</p>` : ''}
				${id.length && !invalidusername && invalidpw ? `<p class=error-desc>암호가 올바르지 않습니다.</p>` : ''}
			</div>
			
			<div class="checkbox" style="display: inline-block;">
				<label>
					<input type="checkbox" name="autologin">
					<span>자동 로그인</span>
				</label>
			</div>
			
			<a href="/member/recover_password" style="float: right;">[아이디/비밀번호 찾기]</a> <br>
			
			<a href="/member/signup" class="btn btn-secondary">계정 만들기</a><button type="submit" class="btn btn-primary">로그인</button>
		</form>
	`;
	
	res.send(render(req, '로그인', content, {}));
});

wiki.all(/^\/member\/signup$/, async function signupEmailScreen(req, res, next) {
	if(!['GET', 'POST'].includes(req.method)) return next();
	
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	if(req.method == 'POST') {
		var data = await curs.execute("select email from account_creation where email = ?", [req.body['email']]);
		if(data.length) var duplicate = 1;
		
		if(!duplicate) {
			await curs.execute("delete from account_creation where cast(time as integer) < ?", [Number(getTime()) - 86400000]);
			const key = rndval('abcdef1234567890', 64);
			curs.execute("insert into account_creation (key, email, time) values (?, ?, ?)", [key, req.body['email'], String(getTime())]);
			
			return res.send(render(req, '계정 만들기', `
				<p>
					이메일(<strong>${req.body['email']}</strong>)로 계정 생성 이메일 인증 메일을 전송했습니다. 메일함에 도착한 메일을 통해 계정 생성을 계속 진행해 주시기 바랍니다.
				</p>

				<ul class=wiki-list>
					<li>간혹 메일이 도착하지 않는 경우가 있습니다. 이 경우, 스팸함을 확인해주시기 바랍니다.</li>
					<li>인증 메일은 24시간동안 유효합니다.</li>
				</ul>
				
				<p style="font-weight: bold; color: red;">
					[디버그] 가입 주소: <a href="/member/signup/${key}">/member/signup/${key}</a>
				</p>
			`, {}));
		}
	}
	
	var content = `
		<form method=post class=signup-form>
			<div class=form-group>
				<label>전자우편 주소</label><br>
				<input type=email name=email class=form-control />
				${duplicate ? `<p class=error-desc>해당 이메일로 이미 계정 생성 인증 메일을 보냈습니다.</p>` : ''}
			</div>
			
			<p>
				<strong>가입후 탈퇴는 불가능합니다.</strong>
			</p>
		
			<div class=btns>
				<button type=reset class="btn btn-secondary">초기화</button>
				<button type=submit class="btn btn-primary">가입</button>
			</div>
		</form>
	`;
	
	res.send(render(req, '계정 만들기', content, {}));
});

wiki.all(/^\/member\/signup\/(.*)$/, async function signupScreen(req, res, next) {
	if(!['GET', 'POST'].includes(req.method)) return next();
	
	await curs.execute("delete from account_creation where cast(time as integer) < ?", [Number(getTime()) - 86400000]);
	
	const key = req.params[0];
	await curs.execute("select key from account_creation where key = ?", [key]);
	if(!curs.fetchall().length) {
		return res.send(showError(req, 'invalid_signup_key'));
	}
	
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	var id = '1', pw = '1', pw2 = '1';
	
	if(req.method == 'POST') {
		id = req.body['username'];
		pw = req.body['password'];
		pw2 = req.body['password_check'];
		
		var data = await curs.execute("select username from users where username = ? COLLATE NOCASE", [id]);
		if(data.length) {
			var duplicate = 1;
		}
		if(id.length && !duplicate && pw.length && pw == pw2) {
			var data = await curs.execute("select username from users");
			if(!data.length) {
				for(var perm of perms) {
					curs.execute(`insert into perms (username, perm) values (?, ?)`, [id, perm]);
				}
			}
			
			req.session.username = id;
			
			await curs.execute("insert into users (username, password) values (?, ?)", [id, sha3(pw)]);
			await curs.execute("insert into documents (title, namespace, content) values (?, '사용자', '')", [id]);
			await curs.execute("insert into history (title, namespace, content, rev, time, username, changes, log, iserq, erqnum, advance, ismember) \
							values (?, '사용자', '', '1', ?, ?, '0', '', '0', '', 'create', 'author')", [
								id, getTime(), id
							]);
			await curs.execute("insert into login_history (username, ip) values (?, ?)", [id, ip_check(req, 1)]);
			await curs.execute("insert into useragents (username, string) values (?, ?)", [id, req.headers['user-agent']]);
			
			return res.send(render(req, '계정 만들기', `
				<p>환영합니다! <strong>${html.escape(id)}</strong>님 계정 생성이 완료되었습니다.</p>
			`, {}));
		}
	}
	
	var content = `
		<form class=signup-form method=post>
			<div class=form-group>
				<label>사용자 ID</label><br>
				<input class=form-control name="username" type="text" />
				${duplicate ? `<p class=error-desc>해당 사용자가 이미 존재합니다.</p>` : ''}
				${!duplicate && !id.length ? `<p class=error-desc>사용자 이름의 값은 필수입니다.</p>` : ''}
			</div>

			<div class=form-group>
				<label>암호</label><br>
				<input class=form-control name="password" type="password" />
				${!duplicate && id.length && !pw.length ? `<p class=error-desc>암호의 값은 필수입니다.</p>` : ''}
			</div>

			<div class=form-group>
				<label>암호 확인</label><br>
				<input class=form-control name="password_check" type="password" />
				${!duplicate && id.length && pw.length && pw != pw2 ? `<p class=error-desc>암호 확인이 올바르지 않습니다.</p>` : ''}
			</div>
			
			<p><strong>가입후 탈퇴는 불가능합니다.</strong></p>
			
			<button type=reset class="btn btn-secondary">초기화</button><button type="submit" class="btn btn-primary">가입</button>
		</form>
	`;
	
	res.send(render(req, '계정 만들기', content, {}));
});

wiki.get(/^\/RandomPage$/, async function randomPage(req, res) {
	var ns = req.query['namespace'];
	if(!ns) ns = '문서';
	
	var data = await curs.execute("select title from documents where namespace = ? order by random() limit 20", [ns]);
	
	var content = `
		<fieldset class="recent-option">
			<form class="form-inline" method=get>
				<div class="form-group">
					<label class="control-label">이름공간 :</label>
					<select class="form-control" id="namespace" name=namespace>
					
	`;
	
	for(var nsp of fetchNamespaces()) {
		content += `
			<option value="${nsp}"${nsp == ns ? ' selected' : ''}>${nsp == 'wiki' ? config.getString('wiki.site_name', 'Wiki') : nsp}</option>
		`;
	}
	
	content += `
					</select>
				</div>
				
				<div class="form-group btns">
					<button type=submit class="btn btn-primary" style="width: 5rem;">제출</button>
				</div>
			</form>
		</fieldset>
		
		<ul class=wiki-list>
	`;
	
	for(var i of data)
        content += '<li><a href="/w/' + encodeURIComponent(totitle(i.title, ns)) + '">' + html.escape(i['title']) + '</a></li>';
	
	content += '</ul>';
	
	res.send(render(req, 'RandomPage', content, {}));
});

wiki.get(/^\/ShortestPages$/, async function shortestPages(req, res) {
	var from = req.query['from'];
	if(!from) ns = '1';
	
	var sql_num = 0;
    if(from > 0)
        sql_num = from - 122;
    else
        sql_num = 0;
	
	var data = await curs.execute("select title from documents where namespace = '문서' order by length(content) limit ?, '122'", [sql_num]);
	
	var content = `
		<p>내용이 짧은 문서 (문서 이름공간, 리다이렉트 제외)</p>
		
		${navbtn(0, 0, 0, 0)}
		
		<ul class=wiki-list>
	`;
	
	for(var i of data)
        content += '<li><a href="/w/' + encodeURIComponent(i['title']) + '">' + html.escape(i['title']) + '</a></li>';
	
	content += '</ul>' + navbtn(0, 0, 0, 0);
	
	res.send(render(req, '내용이 짧은 문서', content, {}));
});

wiki.get(/^\/LongestPages$/, async function longestPages(req, res) {
	var from = req.query['from'];
	if(!from) ns = '1';
	
	var sql_num = 0;
    if(from > 0)
        sql_num = from - 122;
    else
        sql_num = 0;
	
	var data = await curs.execute("select title from documents where namespace = '문서' order by length(content) desc limit ?, '122'", [sql_num]);
	
	var content = `
		<p>내용이 긴 문서 (문서 이름공간, 리다이렉트 제외)</p>
		
		${navbtn(0, 0, 0, 0)}
		
		<ul class=wiki-list>
	`;
	
	for(var i of data)
        content += '<li><a href="/w/' + encodeURIComponent(i['title']) + '">' + html.escape(i['title']) + '</a></li>';
	
	content += '</ul>' + navbtn(0, 0, 0, 0);
	
	res.send(render(req, '내용이 긴 문서', content, {}));
});

wiki.use(function(req, res, next) {
    return res.status(404).send(`
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=1240">
			<title>Page is not found!</title>
			<style>
				section {
					position: fixed;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					padding: 80px 0 0;
					background-color:#EFEFEF;
					font-family: "Open Sans", sans-serif;
					text-align: center;
				}
				
				h1 {
					margin: 0 0 19px;
					font-size: 40px;
					font-weight: normal;
					color: #E02B2B;
					line-height: 40px;
				}
				
				p {
					margin: 0 0 57px;
					font-size: 16px;
					color:#444;
					line-height: 23px;
				}
			</style>
		</head>
		
		<body>
			<section>
				<h1>404</h1>
				
				<p>
					Page is not found!<br>
					<a href="/">Back to home</a>
				</p>
			</section>
		</body>
	`);
});

(async function setWikiData() {
	var data = await curs.execute("select key, value from config");
	
	for(var cfg of data) {
		wikiconfig[cfg['key']] = cfg['value'];
	}
	
	var data = await curs.execute("select username, perm from perms order by username");
	
	for(var prm of data) {
		if(typeof(permlist[prm['username']]) == 'undefined')
			permlist[prm['username']] = [prm['perm']];
		else
			permlist[prm['username']].push(prm['perm']);
	}
})();

const server = wiki.listen(hostconfig['port']); // 서버실행
print(String(hostconfig['host']) + ":" + String(hostconfig['port']) + "에 실행 중. . .");

}