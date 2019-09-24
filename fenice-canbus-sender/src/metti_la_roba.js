class A {



    canData = null;
    pushData(msg) {
        if (msg.id == '0xFF')
            for (const el of msg.payload) {
                canData.latitude.push(el);
            }
    }

    constructor(millis, callback) {
        setInterval(() => {
            this.canData = this.defaultCanData();
            callback(canData);

        }, millis);
    }

}