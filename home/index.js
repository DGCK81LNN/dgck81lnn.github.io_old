const vm = new Vue({
    el: "#app",
    data: {

    },
    methods: {
        naviSelect(index) {
            location.href = `/${index}`;
        }
    }
});