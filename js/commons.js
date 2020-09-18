const SITENAME = "灵魂小站";

Vue.component('soul-header', {
    props: ['defaultActive'],
    template: `<el-header class="soul-header clearfix">
    <el-container class="soul-header-logo"><a href="/" title="回到首页"><img src="/site_icon.png"/>灵魂小站</a></el-container>
    <el-container class="soul-header-navi">
        <slot></slot>
        <el-menu
            class="soul-header-navi-tabs"
            mode="horizontal"
            :default-active="defaultActive"
            @select="naviSelect"
        >
            <el-menu-item index="home">首页</el-menu-item>
            <el-menu-item index="apps">应用</el-menu-item>
            <el-menu-item index="res">资源</el-menu-item>
            <el-menu-item index="about">关于</el-menu-item>
        </el-menu>
    </el-container>
</el-header>`,
    methods: {
        naviSelect(index) {
            location.href = `/${index}`;
        }
    }
});

Vue.component('soul-footer', {
    template: `<el-footer class="soul-footer" height="auto">
    <el-container class="soul-footer-flex">
        <el-container class="soul-footer-col">
            <h3>链接</h3>
            <p><el-link href="https://space.bilibili.com/328066747">B站账号</el-link></p>
            <p><el-link href="http://www.mywiki.cn/dgck81lnn">LNN的博客？</el-link></p>
            <p><el-link href="https://github.com/DGCK81LNN">GitHub</el-link></p>
            <p><el-link href="https://zh.moegirl.org.cn/User:DGCK81LNN">萌娘百科用户页</el-link></p>
        </el-container>
        <el-container class="soul-footer-col">
            <h3>Blahblah</h3>
            <p>测试测试</p>
            <p>测试测试</p>
            <p>测试测试</p>
            <p>测试测试</p>
        </el-container>
        <el-container class="soul-footer-col">
            <h3>©2020 DGCK81LNN.</h3>
            <p>本站图文内容除另有声明外，<br>均采用<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/deed.zh">知识共享署名-相同方式共享 4.0 国际许可协议</a>进行许可。</p>
            <p><a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/deed.zh"><img alt="知识共享许可协议" style="border-width:0" src="/cc_by-sa_4.0_88x31.png"/></a></p>
        </el-container>
    </el-container>
</el-footer>`
});