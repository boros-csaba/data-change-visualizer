import { read, utils } from 'xlsx';

export class Data {

    items = [];
    timeLabels = [];
    sortOrderByTime = [];

    constructor(arrayBuffer) {

        let workbook = read(
            arrayBuffer,
            { type: 'binary' },
            { dateNF: 'mm/dd/yyyy' }
        );
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        var rawData = utils.sheet_to_json(sheet, { header: 1 });
        rawData = rawData.slice(1);
        rawData = rawData.sort((a, b) => a[0] - b[0]);
        this.timeLabels = [...new Set(rawData.map((row) => row[0]).slice(1))];

        
        for (var i = 0; i < rawData.length; i++) {
            let item = this.items.filter((item) => item.name === rawData[i][1]);
            if (item.length === 0) {
                item = { name: rawData[i][1], data: [] };
                this.items.push(item);
            }
        }

        let yearNr = 0;
        let currentDate = rawData[1][0];
        for (var i = 0; i < rawData.length; i++) {
            let item = this.items.filter((item) => item.name === rawData[i][1])[0];
            item.data.push(rawData[i][2]);
            let newData = rawData[i][0];

            if (currentDate !== newData) {
                yearNr++;
                currentDate = newData;
                for (let j = 0; j < this.items.length; j++) {
                    if (this.items[j].data.length < yearNr) {
                        this.items[j].data.push(0);
                    }
                }
            }
        }

        yearNr++;
        for (let j = 0; j < this.items.length; j++) {
            if (this.items[j].data.length < yearNr) {
                this.items[j].data.push(0);
            }
        }

        for (let time = 0; time < this.timeLabels.length; time++) {
            let dataForTime = this.items
                .map((item, _) => ({ value: item.data[time], name: item.name }))
                .sort((a, b) => b.value - a.value)
                .map((item, _) => item.name);
    
            this.sortOrderByTime.push(dataForTime);
        }

    }

    getMaxValue(time) {
        return this.items.map(item => item.data[time]).reduce((a, b) => Math.max(a, b));
    }

    getItemOrder(name, time) {
        return this.sortOrderByTime[time].indexOf(name);
    }
}