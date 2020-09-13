const vm = new Vue({
    el: "#app",
    data: {
        path: location.pathname
    },
    methods: {
        naviSelect(index) {
            location.href = `/${index}`;
        }
    }
});