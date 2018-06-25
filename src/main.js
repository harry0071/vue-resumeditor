import 'css/style.css';
import 'css/change_skin.css';
import 'css/pink_skin.css';
import 'css/blue_skin.css';
import 'css/gray_skin.css';

import Vue from 'vue';
import swal from 'sweetalert2';

import AV from 'leancloud-storage';
let APP_ID = 'U2vtDMuIgkOrm8iLIQzs9YsR-gzGzoHsz';
let APP_KEY = 'ohdM2AWuPnuLTicwNt3eIxJA';

AV.init({
	appId: APP_ID,
	appKey: APP_KEY
});


import Login from 'cp/Login.vue';
import ChangeSkin from 'cp/ChangeSkin.vue';
import Resume from 'cp/Resume.vue';
import LeftNav from 'cp/LeftNav.vue';

const app = new Vue({
	el: '#app',
	components:{
		Login,
		ChangeSkin,
		Resume,
		LeftNav,
	},
	data: {
		mode:'edit',
		isLogin:false,
		changeSkinSeen:false,
		currentUser:AV.User.current(),
		shareUser:{id:null},
		shareSeen:false,
		shareLink:'',
		loginpartSeen: true,
		resume:{
			imgUrl:'https://i.loli.net/2018/05/27/5b0a6c40ae11c.jpg',
			skinColor:null,
			name:'模板',
			job:'应聘前端开发工程师',
			infos: ['男', '1994.07', 'xx大学', '信息科学与工程'],
			contacts:[{icon:'icon-homepage',link:'http://toadw.cn/'},{icon:'icon-github',link:'https://github.com/toadwoo'},{icon:'icon-email',link:'toadwoo@foxmail.com'},{icon:'icon-phone',link:'tel:138*****123'},{icon:'icon-link',link:'QQ:3511*****'}],
			titles:['实践经历','项目经验','专业技能','奖项证书'],
			practices:[{time:`2016.07 ~ 2016.10`,company:`四三九九(厦门)网络股份有限公司`,description:`负责4399儿歌、动漫业务PC端及移动端的多个活动页面的前端开发，原有网站的前端界面更新及维护，使其达到更好的视觉体验和用户体验。同时参与了4399表情站整站的前端开发，并兼容至IE6，上线后不断的维护与优化。`,},{time:`2016.07 ~ 2016.10`,company:`四三九九(厦门)网络股份有限公司`,description:`负责4399儿歌、动漫业务PC端及移动端的多个活动页面的前端开发，原有网站的前端界面更新及维护，使其达到更好的视觉体验和用户体验。同时参与了4399表情站整站的前端开发，并兼容至IE6，上线后不断的维护与优化。`,},{time:`2015.10 ~ 至今`,company:`集美大学·智弧信息科技工作室`,description:`负责与客户对接开发需求、制作原型及UI，并参与项目的研发及维护，此外还负责项目的前端工作分配，参与各创业比赛及路演， 以智弧工作室为项目参加福建省“创青春”创新创业大赛获得创业之星称号。`,}],
			projects:[{time:'2017.02',art:'图书盒子Pro·微信小程序',description:'该项目基于微信小程序MINA框架的WXML、WXSS，视图层采用Flex弹性布局，逻辑层采用模块化的开发，项目使用了开放的图书馆数据接口，后端采用 LeanCloud后端云进行云端数据存储，极大方便了同学查询馆藏图书及借阅情况，上线 2周用户近 1000人，Github获得近 50个Star。',link:'https://www.github.com'},{time:'2016.12',art:'思客拓客·创业想法交流平台',description:'该项目为移动端产品，利用了HTML5、CSS3、Sass、Iconfont、rem自适应等技术来丰富展示前端界面， 使用BaiduTemplate做为模板引擎进行数据逻辑处理，通过Ajax与后端进行数据交互，实现了大量的前后端分离，以及复杂的业务逻辑。',link:'https://www.github.com'},{time:'2016.09',art:'链接有空·时间售卖与技能交易平台',description:'该平台是基于微信公众号的移动端Web应用，采用了Vue.js做为MVVM框架，实现了部分数据的前后端分离。产品上线后不断的维护与重构，优化用户体验及性能。',link:'https://www.github.com'},],
			skills:['熟悉使用HTML5、CSS3、Sass，能准确还原设计稿。','会点设计，有点审美能力，重视用户体验','了解 MVVM框架 Vue、微信小程序','熟练使用Git进行版本控制和代码托管、Markdown进行文档编写，并以MacOS X、WebStorm作为日常开发环境进行工作，了解项目开发流程及开发调试工具的使用。'],
			prizes:[{time:'2013-2017',description:'集美大学专业二等奖学金·多次获得'},{time:'2015.05',description:'集美大学首届数学建模大赛·二等奖'},{time:'2016.09',description:'福建省“创青春”创新创业大赛·创业之星'}],
			skillbars:[{name:'HTML',flex:80},{name:'CSS',flex:75},{name:'JavaScript',flex:70},{name:'Jquery',flex:90},{name:'Vue',flex:65},],
		},
		signup: {
			email: ``,
			password: ``,
		},
		login:{email:``,password:``,},
	},
	watch:{
		'currentUser' : function (newVal) {
			if (newVal) {
				this.getLcData('currentUser');
				this.shareLink = location.origin + location.pathname + '?uid=' + this.currentUser.id;
			}
		},
	},
	created(){
		if (this.currentUser) {
			this.shareLink = location.origin + location.pathname + '?uid=' + this.currentUser.id;
		}
	},
	methods: {
		changeResume(key, ev) {
			const value = `ev.target.innerText`;

			//key === 'skills[0].name'
			//由于传过来的 skills[0].name 是个字符串,所以要用eval做处理
			eval(`this.resume.${key}=${value}`);
		},
		saveImg(ev){
			console.log(ev)
			let file = ev.target.files[0];
			let avFile = new AV.File(file.name, file).save().then(data=>app.resume.imgUrl=data.thumbnailURL(200, 200),error=>console.log(error));
		},
		addItem(key){
			const data = this.resume[key][this.resume[key].length-1];
			this.resume[key].push(JSON.parse(JSON.stringify(data)));
		},
		deleteItem(key,i){
			this.resume[key].splice(i,1);
		},
		clickSaveBtn() {
			if (this.currentUser) {
				this.saveData(this.currentUser).then(()=>swal("成功保存到云端！",'',"success"),()=>{swal("保存失败！", '',"error");});
			} else {
				this.isLogin = true;
			}
		},
		clickLogout(){
			AV.User.logOut().then(()=>location.reload());
		},
		saveData(currentUser){
			const user = AV.Object.createWithoutData('User', currentUser.id);
			user.set('resume', this.resume);
			return user.save();
		},
		onSignup() {
			if (this.loginpartSeen) {
				this.doLogin();
			} else {
				this.doSignup();
			}
		},
		doLogin() {
			AV.User.logIn(this.login.email, this.login.password).then((loginedUser)=> {
				this.isLogin= false;
				this.currentUser = AV.User.current();
			}, function(error) {
				if (error.code === 211) {
					swal("该邮箱未注册，请先注册！",'',"warning");
				} else if (error.code === 210) {
					swal("邮箱和密码不匹配！",'',"warning");
				}
			});
		},
		doSignup() {
			let user = new AV.User();
			user.setUsername(this.signup.email);
			user.setPassword(this.signup.password);
			user.setEmail(this.signup.email);
			user.signUp().then((loginedUser)=> {
				swal("注册成功",'',"success");
				this.isLogin = false;
				this.currentUser = loginedUser;
			}, function(error) {
				//console.dir(error) 可以看出error的层级
				swal(error.rawMessage,'',"warning");
			});
		},
		print(){
			document.title = this.resume.name+'的简历';
			print();
			document.title = 'STAGE在线简历编辑器';
		},
		changeSkin(color){
			color=='default'? this.resume.skinColor = null : this.resume.skinColor = color;
			this.changeSkinSeen = false;
		},
		getLcData(user){
			const query = new AV.Query('User');
			query.get(this[user].id).then((datas)=> {
				if(!this.currentUser){
					this.currentUser={};
				}
	    		Object.assign(this.currentUser,datas);
	    		let data = datas.toJSON();
	    		Object.assign(this.resume,data.resume);
    		});
		},
	}
});

//获取分享链接的uid
let search = location.search;
let reg = /\?uid=(\w+)/;
let matches = search.match(reg);
let uid;
if(matches){
	uid = matches[1];
}

if(uid){
	app.shareUser.id = uid;
	app.mode = 'share';
	app.getLcData('shareUser');
}else if(app.currentUser){
	app.getLcData('currentUser');
	app.mode = 'edit';
}

